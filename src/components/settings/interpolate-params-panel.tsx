import { Gauge, WandSparkles } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { INTERPOLATE_MODELS } from '@/types/models'
import { useSettingsStore } from '@/stores/settings.store'

export function InterpolateParamsPanel(): React.JSX.Element {
  const params = useSettingsStore((state) => state.interpolateParams)
  const setInterpolateParams = useSettingsStore((state) => state.setInterpolateParams)

  const selectedModel =
    INTERPOLATE_MODELS.find((model) => model.name === params.model) ?? INTERPOLATE_MODELS[0]

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/75 shadow-[0_18px_45px_-30px_rgba(34,197,94,0.42)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <Gauge className="h-5 w-5 text-emerald-300" />
          补帧参数
        </CardTitle>
        <CardDescription className="text-zinc-950 dark:text-zinc-400">
          通过模型与倍率配置，让运动画面更丝滑。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>模型</Label>
          <Select
            value={params.model}
            onValueChange={(value) => {
              const model = INTERPOLATE_MODELS.find((entry) => entry.name === value)
              if (!model) {
                return
              }
              setInterpolateParams({
                model: model.name,
                multiplier: model.supportedMultipliers.includes(params.multiplier)
                  ? params.multiplier
                  : model.defaultMultiplier,
              })
            }}
          >
            <SelectTrigger className="border-zinc-300 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTERPOLATE_MODELS.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  {model.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="flex items-start gap-2 text-xs text-zinc-950 dark:text-zinc-400">
            <WandSparkles className="mt-0.5 h-3.5 w-3.5 text-emerald-300" />
            {selectedModel.description}
          </p>
        </div>

        <div className="space-y-2">
          <Label>补帧倍率</Label>
          <Select
            value={String(params.multiplier)}
            onValueChange={(value) => {
              setInterpolateParams({ multiplier: Number(value) as 2 | 3 | 4 | 8 })
            }}
          >
            <SelectTrigger className="border-zinc-300 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {selectedModel.supportedMultipliers.map((multiplier) => (
                <SelectItem key={multiplier} value={String(multiplier)}>
                  {multiplier}x
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">UHD 模式</p>
            <p className="text-xs text-zinc-950 dark:text-zinc-400">针对 4K 工作流优化显存策略。</p>
          </div>
          <Switch
            checked={params.uhd}
            onCheckedChange={(checked) => {
              setInterpolateParams({ uhd: checked })
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interpolate-gpu">GPU 编号</Label>
          <Input
            id="interpolate-gpu"
            type="number"
            min={0}
            value={params.gpuId}
            className="border-zinc-300 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            onChange={(event) => {
              setInterpolateParams({ gpuId: Number(event.target.value) })
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
