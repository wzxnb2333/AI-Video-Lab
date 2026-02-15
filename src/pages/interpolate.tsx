import { GaugeCircle } from 'lucide-react'
import { useState } from 'react'

import { InterpolateParamsPanel } from '@/components/settings/interpolate-params-panel'
import { Button } from '@/components/ui/button'
import { FileDropzone } from '@/components/video/file-dropzone'
import { BeforeAfterPreview } from '@/components/video/before-after-preview'
import { useProcessing } from '@/hooks/useProcessing'

export function InterpolatePage(): React.JSX.Element {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const { addInterpolateTask } = useProcessing()

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <FileDropzone onFileSelect={setSelectedPath} />
          <BeforeAfterPreview originalSrc={selectedPath} processedSrc={null} />
        </div>
        <div className="space-y-6">
          <InterpolateParamsPanel />
          <Button
            className="h-12 w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
            disabled={!selectedPath}
            onClick={() => {
              if (!selectedPath) {
                return
              }
              addInterpolateTask(selectedPath)
            }}
          >
            <GaugeCircle className="mr-2 h-4 w-4" />
            开始补帧处理
          </Button>
        </div>
      </div>
    </section>
  )
}
