import { Rocket } from 'lucide-react'
import { useState } from 'react'

import { UpscaleParamsPanel } from '@/components/settings/upscale-params-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileDropzone } from '@/components/video/file-dropzone'
import { VideoPlayer } from '@/components/video/video-player'
import { useProcessing } from '@/hooks/useProcessing'
import { useVideoInfo } from '@/hooks/useVideoInfo'

const formatFileSize = (bytes: number): string => {
  if (bytes <= 0) {
    return '0 MB'
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function UpscalePage(): React.JSX.Element {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const { addUpscaleTask } = useProcessing()
  const { info, loading, error } = useVideoInfo(selectedPath)

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <FileDropzone onFileSelect={setSelectedPath} />
          <VideoPlayer src={selectedPath} index={1} title="当前视频" />
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70">
            <CardHeader>
              <CardTitle className="text-zinc-900 dark:text-zinc-100">源视频信息</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-950 dark:text-zinc-400">
              {loading ? (
                <p>正在读取元数据...</p>
              ) : error ? (
                <p className="text-red-500 dark:text-red-300">读取元数据失败：{error}</p>
              ) : info ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <p>文件名: {info.filename}</p>
                  <p>分辨率: {info.width}x{info.height}</p>
                  <p>FPS: {info.fps}</p>
                  <p>编码格式: {info.codec}</p>
                  <p>音频: {info.audioCodec ?? '无'}</p>
                  <p>大小: {formatFileSize(info.fileSize)}</p>
                </div>
              ) : (
                <p>请选择一个视频文件以查看详细信息。</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <UpscaleParamsPanel />
          <Button
            className="h-12 w-full bg-cyan-500 text-zinc-950 hover:bg-cyan-400"
            disabled={!selectedPath}
            onClick={() => {
              if (!selectedPath) {
                return
              }
              addUpscaleTask(selectedPath)
            }}
          >
            <Rocket className="mr-2 h-4 w-4" />
            开始超分辨率处理
          </Button>
        </div>
      </div>
    </section>
  )
}
