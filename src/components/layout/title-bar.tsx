import { Minus, Square, X } from 'lucide-react'
import { getCurrentWindow } from '@tauri-apps/api/window'

export function TitleBar(): React.JSX.Element {
  const appWindow = getCurrentWindow()

  const runWindowCommand = async (command: () => Promise<unknown>): Promise<void> => {
    try {
      await command()
    } catch (error) {
      console.error('[title-bar] window action failed:', error)
    }
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-[100] flex h-10 select-none items-center justify-between border-b border-zinc-200/70 bg-white/95 pl-4 dark:border-white/10 dark:bg-zinc-950/95">
      <div
        className="flex h-full flex-1 cursor-move items-center gap-2"
        data-tauri-drag-region
      >
        <div className="h-2.5 w-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400/90" />
        <p className="text-xs tracking-[0.2em] text-zinc-700 dark:text-zinc-300">
          AI Video Lab
        </p>
      </div>

      <div className="z-[101] flex h-full items-stretch">
        <button
          type="button"
          className="group flex w-12 items-center justify-center transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
          onClick={() => void runWindowCommand(() => appWindow.minimize())}
          aria-label="最小化"
        >
          <Minus className="h-4 w-4 text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100" />
        </button>
        <button
          type="button"
          className="group flex w-12 items-center justify-center transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
          onClick={() => void runWindowCommand(() => appWindow.toggleMaximize())}
          aria-label="最大化"
        >
          <Square className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100" />
        </button>
        <button
          type="button"
          className="group flex w-12 items-center justify-center transition-colors hover:bg-red-500"
          onClick={() => void runWindowCommand(() => appWindow.close())}
          aria-label="关闭"
        >
          <X className="h-4 w-4 text-zinc-500 group-hover:text-white dark:text-zinc-400" />
        </button>
      </div>
    </div>
  )
}
