import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { App } from './App'
import './index.css'

const applyInitialTheme = (): void => {
  let theme: 'dark' | 'light' | 'system' = 'dark'

  try {
    const raw = localStorage.getItem('ai-video-settings')
    if (raw) {
      const parsed = JSON.parse(raw) as {
        state?: {
          theme?: 'dark' | 'light' | 'system'
        }
      }

      const persistedTheme = parsed.state?.theme
      if (persistedTheme === 'dark' || persistedTheme === 'light' || persistedTheme === 'system') {
        theme = persistedTheme
      }
    }
  } catch {
    theme = 'dark'
  }

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme === 'dark' || (theme === 'system' && systemDark)
  document.documentElement.classList.toggle('dark', isDark)
}

applyInitialTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>,
)
