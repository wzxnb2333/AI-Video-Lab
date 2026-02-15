import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { TitleBar } from '@/components/layout/title-bar'

interface AppShellProps {
  children?: ReactNode
}

export function AppShell({ children }: AppShellProps): React.JSX.Element {
  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(20,184,166,0.12),transparent_25%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_42%,#f5f7fb_100%)] text-zinc-900 dark:bg-[radial-gradient(circle_at_10%_10%,rgba(8,145,178,0.18),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(14,116,144,0.15),transparent_25%),linear-gradient(180deg,#09090b_0%,#111827_42%,#0a0a0a_100%)] dark:text-zinc-100">
      <TitleBar />
      <Sidebar />
      <div className="flex h-full flex-col pl-56 pt-10">
        <Header />
        <main className="app-scroll flex-1 overflow-y-auto p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}
