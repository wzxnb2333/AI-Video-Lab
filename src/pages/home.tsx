import { ArrowRight, ArrowUpCircle, Film, FolderCog } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    title: 'AI 超分辨率',
    description: '借助 GPU 加速模型恢复细节并提升画面锐度。',
    icon: ArrowUpCircle,
    to: '/upscale',
    accent: 'from-cyan-500/25 to-cyan-900/30',
  },
  {
    title: 'AI 补帧',
    description: '让运动画面更流畅，提升慢动作与高速场景表现。',
    icon: Film,
    to: '/interpolate',
    accent: 'from-emerald-500/25 to-emerald-900/30',
  },
  {
    title: '流程管线控制',
    description: '统一管理任务队列、默认参数与可重复工作流。',
    icon: FolderCog,
    to: '/queue',
    accent: 'from-amber-500/25 to-amber-900/30',
  },
]

export function HomePage(): React.JSX.Element {
  return (
    <section className="space-y-6">
      <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70">
        <CardContent className="relative p-8">
          <div className="absolute -left-8 top-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
          <Badge className="mb-4 border-cyan-400/40 bg-cyan-500/15 text-cyan-700 dark:text-cyan-100">实时 AI 处理管线</Badge>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50">
            将原始素材一键增强为可交付成片，细节与流畅度同时升级。
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-950 dark:text-zinc-400">
            支持批量排队处理、即时对比结果，让每段视频都在你的掌控之中。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-cyan-500 text-zinc-950 hover:bg-cyan-400">
              <Link to="/upscale">
                开始超分辨率
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-zinc-300 bg-zinc-50 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              <Link to="/interpolate">前往补帧设置</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70">
            <CardHeader>
              <div
                className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-zinc-900 dark:text-zinc-100`}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-zinc-900 dark:text-zinc-100">{feature.title}</CardTitle>
              <CardDescription className="text-zinc-950 dark:text-zinc-400">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="px-0 text-cyan-700 hover:bg-transparent hover:text-cyan-800 dark:text-cyan-200 dark:hover:text-cyan-100">
                <Link to={feature.to}>
                  进入模块
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
