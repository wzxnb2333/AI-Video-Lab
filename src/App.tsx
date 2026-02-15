import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'
import { HomePage } from '@/pages/home'
import { InterpolatePage } from '@/pages/interpolate'
import { QueuePage } from '@/pages/queue'
import { SettingsPage } from '@/pages/settings-page'
import { UpscalePage } from '@/pages/upscale'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'upscale',
        element: <UpscalePage />,
      },
      {
        path: 'interpolate',
        element: <InterpolatePage />,
      },
      {
        path: 'queue',
        element: <QueuePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
])

export function App(): React.JSX.Element {
  return <RouterProvider router={router} />
}
