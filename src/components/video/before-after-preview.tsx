import { VideoPlayer } from '@/components/video/video-player'

interface BeforeAfterPreviewProps {
  originalSrc: string | null
  processedSrc: string | null
}

export function BeforeAfterPreview({
  originalSrc,
  processedSrc,
}: BeforeAfterPreviewProps): React.JSX.Element {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-2">
        <p className="text-xs tracking-[0.22em] text-zinc-950 dark:text-zinc-400">原始视频</p>
        <VideoPlayer src={originalSrc} index={1} title="原始视频" />
      </div>
      <div className="space-y-2">
        <p className="text-xs tracking-[0.22em] text-zinc-950 dark:text-zinc-400">处理后视频</p>
        <VideoPlayer src={processedSrc} index={2} title="处理后视频" />
      </div>
    </section>
  )
}
