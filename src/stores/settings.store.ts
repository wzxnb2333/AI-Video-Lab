import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  DEFAULT_INTERPOLATE_PARAMS,
  DEFAULT_UPSCALE_PARAMS,
} from '@/types/models'
import type { InterpolateParams, UpscaleParams } from '@/types/models'

export interface SettingsState {
  upscaleParams: UpscaleParams
  interpolateParams: InterpolateParams
  outputDirectory: string
  theme: 'dark' | 'light' | 'system'
  setUpscaleParams: (params: Partial<UpscaleParams>) => void
  setInterpolateParams: (params: Partial<InterpolateParams>) => void
  setOutputDirectory: (dir: string) => void
  setTheme: (theme: 'dark' | 'light' | 'system') => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      upscaleParams: DEFAULT_UPSCALE_PARAMS,
      interpolateParams: DEFAULT_INTERPOLATE_PARAMS,
      outputDirectory: '',
      theme: 'dark',
      setUpscaleParams: (params) => {
        set((state) => ({
          upscaleParams: {
            ...state.upscaleParams,
            ...params,
          },
        }))
      },
      setInterpolateParams: (params) => {
        set((state) => ({
          interpolateParams: {
            ...state.interpolateParams,
            ...params,
          },
        }))
      },
      setOutputDirectory: (dir) => {
        set({ outputDirectory: dir })
      },
      setTheme: (theme) => {
        set({ theme })
      },
    }),
    {
      name: 'ai-video-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        upscaleParams: state.upscaleParams,
        interpolateParams: state.interpolateParams,
        outputDirectory: state.outputDirectory,
        theme: state.theme,
      }),
    },
  ),
)
