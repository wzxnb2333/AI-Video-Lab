import { resolveResource } from '@tauri-apps/api/path'
import { exists, mkdir, readDir } from '@tauri-apps/plugin-fs'
import { Command } from '@tauri-apps/plugin-shell'

import { getResourcePath } from '@/lib/ffmpeg'
import type { InterpolateParams } from '@/types/models'

type InterpolateProgressCallback = (current: number, total: number) => void

let activeInterpolateChild: { kill: () => Promise<void> } | null = null

function parseProgressLine(line: string): { current: number; total: number } | null {
  const percentMatch = line.match(/(\d+(?:\.\d+)?)%/)
  if (percentMatch) {
    const percentage = Math.min(100, Math.max(0, Math.round(Number(percentMatch[1]))))
    return { current: percentage, total: 100 }
  }

  const frameMatch = line.match(/(\d+)\s*\/\s*(\d+)/)
  if (frameMatch) {
    const current = Number(frameMatch[1])
    const total = Number(frameMatch[2])
    if (Number.isFinite(current) && Number.isFinite(total) && total > 0) {
      return { current: Math.min(current, total), total }
    }
  }

  return null
}

async function resolveModelDirectory(modelName: string): Promise<string> {
  const candidates = [`models/rife-ncnn-vulkan/${modelName}`, `models/${modelName}`]

  for (const candidate of candidates) {
    const resolved = await resolveResource(candidate)
    if (await exists(resolved)) {
      return resolved
    }
  }

  throw new Error(`Interpolate model not found: ${modelName}`)
}

async function countInputFrames(inputDir: string): Promise<number> {
  const entries = await readDir(inputDir)
  return entries.filter((entry) => entry.isFile && /\.(png|jpg|jpeg|webp)$/i.test(entry.name)).length
}

export async function cancelActiveInterpolateProcess(): Promise<void> {
  if (activeInterpolateChild) {
    await activeInterpolateChild.kill()
    activeInterpolateChild = null
  }
}

export async function runInterpolate(
  inputDir: string,
  outputDir: string,
  params: InterpolateParams,
  onProgress?: InterpolateProgressCallback,
): Promise<void> {
  if (!(await exists(outputDir))) {
    await mkdir(outputDir, { recursive: true })
  }

  const binaryPath = await getResourcePath('rife-ncnn-vulkan')
  const modelPath = await resolveModelDirectory(params.model)
  const inputFrames = await countInputFrames(inputDir)
  const targetFrames = inputFrames > 1 ? (inputFrames - 1) * params.multiplier + 1 : inputFrames

  const args = [
    '-i',
    inputDir,
    '-o',
    outputDir,
    '-m',
    modelPath,
    '-g',
    `${params.gpuId}`,
    '-n',
    `${Math.max(1, targetFrames)}`,
    ...params.customArgs,
  ]

  if (params.uhd) {
    args.push('-u')
  }

  const command = Command.create(binaryPath, args)

  const expectedTotal = targetFrames > 0 ? targetFrames : 100

  command.stdout.on('data', (line) => {
    const parsed = parseProgressLine(line)
    if (parsed && onProgress) {
      const normalizedCurrent = parsed.total === 100 ? Math.round((parsed.current / 100) * expectedTotal) : parsed.current
      const normalizedTotal = parsed.total === 100 ? expectedTotal : parsed.total
      onProgress(Math.min(normalizedCurrent, normalizedTotal), normalizedTotal)
    }
  })

  command.stderr.on('data', (line) => {
    const parsed = parseProgressLine(line)
    if (parsed && onProgress) {
      const normalizedCurrent = parsed.total === 100 ? Math.round((parsed.current / 100) * expectedTotal) : parsed.current
      const normalizedTotal = parsed.total === 100 ? expectedTotal : parsed.total
      onProgress(Math.min(normalizedCurrent, normalizedTotal), normalizedTotal)
    }
  })

  activeInterpolateChild = await command.spawn()

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

  activeInterpolateChild = null

  if (result.code !== 0) {
    throw new Error(result.stderr || `rife-ncnn-vulkan failed with code ${String(result.code)}`)
  }

  if (onProgress) {
    onProgress(expectedTotal, expectedTotal)
  }
}
