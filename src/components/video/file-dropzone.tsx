import { FileVideo, UploadCloud } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { open } from '@tauri-apps/plugin-dialog'

interface FileDropzoneProps {
  onFileSelect: (path: string) => void
}

const extensions = ['mp4', 'avi', 'mkv', 'mov', 'webm']

const isSupportedVideo = (fileName: string): boolean => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ext ? extensions.includes(ext) : false
}

const getFileName = (path: string): string => {
  const pieces = path.replace(/\\/g, '/').split('/')
  return pieces[pieces.length - 1] ?? path
}

export function FileDropzone({ onFileSelect }: FileDropzoneProps): React.JSX.Element {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pickFile = async (): Promise<void> => {
    const picked = await open({
      multiple: false,
      filters: [
        {
          name: '视频',
          extensions,
        },
      ],
    })

    if (!picked || Array.isArray(picked)) {
      return
    }

    setError(null)
    setSelectedPath(picked)
    onFileSelect(picked)
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files.item(0)
    if (!file || !isSupportedVideo(file.name)) {
      setError('仅支持 MP4、AVI、MKV、MOV、WEBM 格式。')
      return
    }

    const path = (file as File & { path?: string }).path ?? file.name
    setError(null)
    setSelectedPath(path)
    onFileSelect(path)
  }

  return (
    <section
      className={cn(
        'rounded-3xl border border-dashed p-8 transition-all',
        isDragging
          ? 'border-cyan-300 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.24)]'
          : 'border-zinc-300 bg-zinc-50 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50',
      )}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => {
        setIsDragging(false)
      }}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-2xl bg-cyan-500/15 p-4 text-cyan-300">
          <UploadCloud className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">将源视频拖放到这里</h3>
          <p className="text-sm text-zinc-950 dark:text-zinc-400">你可以直接拖拽视频文件，或点击按钮选择文件。</p>
        </div>
        <Button onClick={pickFile} className="bg-cyan-500 text-zinc-950 hover:bg-cyan-400">
          浏览文件
        </Button>

        {selectedPath ? (
          <div className="mt-2 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-700 dark:text-cyan-200">
            <FileVideo className="h-3.5 w-3.5" />
            <span>{getFileName(selectedPath)}</span>
          </div>
        ) : null}

        {error ? <p className="text-xs text-red-300">{error}</p> : null}
      </div>
    </section>
  )
}
