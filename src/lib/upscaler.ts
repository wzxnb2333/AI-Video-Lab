import { resolveResource } from '@tauri-apps/api/path'
import { exists, mkdir } from '@tauri-apps/plugin-fs'
import { Command } from '@tauri-apps/plugin-shell'

import { getResourcePath } from '@/lib/ffmpeg'
import type { UpscaleParams } from '@/types/models'

type UpscaleProgressCallback = (current: number, total: number) => void

let activeUpscaleChild: { kill: () => Promise<void> } | null = null

function parseProgressLine(line: string): { current: number; total: number } | null {
  const percentMatch = line.match(/(\d+(?:\.\d+)?)%/)
  if (percentMatch) {
    const percentage = Math.min(100, Math.max(0, Math.round(Number(percentMatch[1]))))
    return { current: percentage, total: 100 }
  }

  const fractionMatch = line.match(/(\d+)\s*\/\s*(\d+)/)
  if (fractionMatch) {
    const current = Number(fractionMatch[1])
    const total = Number(fractionMatch[2])
    if (Number.isFinite(current) && Number.isFinite(total) && total > 0) {
      return { current: Math.min(current, total), total }
    }
  }

  return null
}

async function resolveModelDirectory(modelName: string): Promise<string> {
  const candidates = [
    `models/waifu2x-ncnn-vulkan/${modelName}`,
    `models/${modelName}`,
    `models/${modelName.replace(/^models-/, '')}`,
  ]

  for (const candidate of candidates) {
    const resolved = await resolveResource(candidate)
    if (await exists(resolved)) {
      return resolved
    }
  }

  throw new Error(`Upscale model not found: ${modelName}`)
}

export async function cancelActiveUpscaleProcess(): Promise<void> {
  if (activeUpscaleChild) {
    await activeUpscaleChild.kill()
    activeUpscaleChild = null
  }
}

export async function runUpscale(
  inputDir: string,
  outputDir: string,
  params: UpscaleParams,
  onProgress?: UpscaleProgressCallback,
): Promise<void> {
  if (!(await exists(outputDir))) {
    await mkdir(outputDir, { recursive: true })
  }

  const binaryPath = await getResourcePath('waifu2x-ncnn-vulkan')
  const modelPath = await resolveModelDirectory(params.model)

  const args = [
    '-i',
    inputDir,
    '-o',
    outputDir,
    '-n',
    `${params.denoiseLevel}`,
    '-s',
    `${params.scale}`,
    '-t',
    `${params.tileSize}`,
    '-g',
    `${params.gpuId}`,
    '-m',
    modelPath,
    '-f',
    params.format,
    ...params.customArgs,
  ]

  const command = Command.create(binaryPath, args)
  command.stdout.on('data', (line) => {
    const parsed = parseProgressLine(line)
    if (parsed && onProgress) {
      onProgress(parsed.current, parsed.total)
    }
  })

  command.stderr.on('data', (line) => {
    const parsed = parseProgressLine(line)
    if (parsed && onProgress) {
      onProgress(parsed.current, parsed.total)
    }
  })

  activeUpscaleChild = await command.spawn()

  const result = await new Promise<{ code: number | null; stderr: string }>((resolveResult, rejectResult) => {
    const stderrParts: string[] = []
    command.stderr.on('data', (line) => {
      stderrParts.push(line)
    })

    command.on('error', (error) => {
      rejectResult(new Error(error))
    })

    command.on('close', (payload) => {
      resolveResult({ code: payload.code, stderr: stderrParts.join('\n') })
    })
  })

  activeUpscaleChild = null

  if (result.code !== 0) {
    throw new Error(result.stderr || `waifu2x-ncnn-vulkan failed with code ${String(result.code)}`)
  }

  if (onProgress) {
    onProgress(100, 100)
  }
}
