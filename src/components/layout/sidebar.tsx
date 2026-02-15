import { ArrowUpCircle, Film, Home, ListOrdered, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/upscale', label: '超分辨率', icon: ArrowUpCircle },
  { to: '/interpolate', label: '补帧', icon: Film },
  { to: '/queue', label: '任务队列', icon: ListOrdered },
  { to: '/settings', label: '设置', icon: Settings },
]

export function Sidebar(): React.JSX.Element {
  return (
    <aside className="fixed bottom-0 left-0 top-10 z-40 w-56 border-r border-zinc-200/80 bg-white/95 px-4 py-6 dark:border-white/10 dark:bg-zinc-950/95">
      <div className="mb-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/15 via-cyan-100/40 to-white p-4 shadow-[0_18px_35px_-18px_rgba(34,211,238,0.35)] dark:from-cyan-500/20 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-[0_18px_35px_-18px_rgba(34,211,238,0.45)]">
        <p className="text-xs tracking-[0.25em] text-cyan-700/80 dark:text-cyan-200/80">AI Video Lab</p>
        <h1 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">视频增强工坊</h1>
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">本地桌面端处理套件</p>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'border-cyan-400/40 bg-cyan-500/15 text-cyan-800 shadow-[0_0_0_1px_rgba(34,211,238,0.24)] dark:text-cyan-100'
                  : 'border-transparent text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100/90 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
