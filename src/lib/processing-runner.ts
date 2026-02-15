import { ProcessingPipeline } from '@/lib/pipeline'
import { useProcessingStore } from '@/stores/processing.store'
import type { ProcessingTask } from '@/types/pipeline'

const pipeline = new ProcessingPipeline()

let initialized = false
let running = false
let currentTaskId: string | null = null

const isCancelledError = (error: unknown): boolean => {
  if (!error) {
    return false
  }
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('cancel')
  }
  return String(error).toLowerCase().includes('cancel')
}

const pickNextTask = (tasks: ProcessingTask[]): ProcessingTask | null => {
  const currentlyProcessing = tasks.find((task) => task.status === 'processing')
  if (currentlyProcessing) {
    return currentlyProcessing
  }

  const pending = [...tasks].reverse().find((task) => task.status === 'pending')
  return pending ?? null
}

const updateTaskProgress = (taskId: string, progress: number, currentFrame: number, totalFrames: number, eta: number): void => {
  const state = useProcessingStore.getState()
  const task = state.tasks.find((item) => item.id === taskId)
  if (!task || task.status !== 'processing') {
    return
  }

  state.updateTask(taskId, {
    progress,
    currentFrame,
    totalFrames,
    eta,
  })
}

const processTask = async (task: ProcessingTask): Promise<void> => {
  const state = useProcessingStore.getState()
  const snapshot = state.tasks.find((item) => item.id === task.id) ?? task

  if (snapshot.status === 'pending') {
    state.updateTask(task.id, {
      status: 'processing',
      startTime: Date.now(),
      endTime: null,
      progress: 0,
      eta: 0,
      currentFrame: 0,
      totalFrames: 0,
      error: null,
    })
  }

  currentTaskId = task.id

  try {
    const latestTask = useProcessingStore.getState().tasks.find((item) => item.id === task.id) ?? snapshot
    await pipeline.start(latestTask)

    const finalState = useProcessingStore.getState()
    const finalTask = finalState.tasks.find((item) => item.id === task.id)

    if (finalTask?.status === 'cancelled') {
      return
    }

    finalState.updateTask(task.id, {
      status: 'completed',
      progress: 100,
      eta: 0,
      endTime: Date.now(),
      error: null,
    })
  } catch (error) {
    const finalState = useProcessingStore.getState()
    const finalTask = finalState.tasks.find((item) => item.id === task.id)

    if (finalTask?.status === 'cancelled' || isCancelledError(error)) {
      finalState.updateTask(task.id, {
        status: 'cancelled',
        endTime: Date.now(),
        eta: 0,
      })
      return
    }

    finalState.updateTask(task.id, {
      status: 'error',
      endTime: Date.now(),
      error: error instanceof Error ? error.message : String(error),
    })
  } finally {
    currentTaskId = null
  }
}

const scheduleProcessing = (): void => {
  if (running) {
    return
  }

  const state = useProcessingStore.getState()
  const nextTask = pickNextTask(state.tasks)
  if (!nextTask) {
    return
  }

  running = true
  void processTask(nextTask).finally(() => {
    running = false
    scheduleProcessing()
  })
}

export const ensureProcessingRunner = (): void => {
  if (initialized) {
    return
  }
  initialized = true

  pipeline.onProgress((progress) => {
    if (!currentTaskId) {
      return
    }
    updateTaskProgress(
      currentTaskId,
      progress.progress,
      progress.currentFrame,
      progress.totalFrames,
      progress.eta,
    )
  })

  useProcessingStore.subscribe((state, previous) => {
    if (state.tasks !== previous.tasks) {
      scheduleProcessing()
    }
  })

  scheduleProcessing()
}

export const cancelProcessingTask = async (taskId: string): Promise<void> => {
  const state = useProcessingStore.getState()
  const task = state.tasks.find((item) => item.id === taskId)
  if (!task || task.status === 'completed' || task.status === 'error' || task.status === 'cancelled') {
    return
  }

  state.updateTask(taskId, {
    status: 'cancelled',
    endTime: Date.now(),
    eta: 0,
    error: null,
  })

  if (currentTaskId === taskId) {
    await pipeline.cancel()
  }
}
