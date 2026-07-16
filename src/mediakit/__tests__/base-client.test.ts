import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getTask, waitForTask } from '../base-client.js'

vi.mock('../../http/index.js', () => ({
  HttpClient: vi.fn(),
}))

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('getTask', () => {
  it('calls http.get with task URL and returns domain result', async () => {
    const mockHttp = createMockHttp()
    const apiResponse = {
      success: true,
      task_id: 'task-001',
      status: 'completed' as const,
      request_id: 'req-001',
    }
    mockHttp.get.mockResolvedValue(apiResponse)

    const result = await getTask(mockHttp as never, 'task-001')

    expect(mockHttp.get).toHaveBeenCalledWith('/api/v1/tasks/task-001')
    expect(result).toEqual(apiResponse)
  })
})

describe('waitForTask', () => {
  it('resolves immediately when task is completed', async () => {
    const mockHttp = createMockHttp()
    const completedTask = {
      success: true,
      task_id: 'task-001',
      status: 'completed' as const,
      request_id: 'req-001',
    }
    mockHttp.get.mockResolvedValue(completedTask)

    const result = await waitForTask(mockHttp as never, 'task-001', {
      interval: 1000,
      timeout: 5000,
    })

    expect(result).toEqual(completedTask)
    expect(mockHttp.get).toHaveBeenCalledTimes(1)
  })

  it('polls until task completes', async () => {
    const mockHttp = createMockHttp()
    const pendingTask = {
      success: true,
      task_id: 'task-001',
      status: 'pending' as const,
      request_id: 'req-001',
    }
    const completedTask = {
      success: true,
      task_id: 'task-001',
      status: 'completed' as const,
      request_id: 'req-001',
    }

    mockHttp.get
      .mockResolvedValueOnce(pendingTask)
      .mockResolvedValueOnce(pendingTask)
      .mockResolvedValueOnce(completedTask)

    const pollPromise = waitForTask(mockHttp as never, 'task-001', {
      interval: 100,
      timeout: 10_000,
    })

    for (let i = 0; i < 3; i++) {
      await vi.advanceTimersByTimeAsync(100)
    }

    const result = await pollPromise
    expect(result.status).toBe('completed')
    expect(mockHttp.get).toHaveBeenCalledTimes(3)
  })

  it('throws on timeout', async () => {
    const mockHttp = createMockHttp()
    const pendingTask = {
      success: true,
      task_id: 'task-001',
      status: 'pending' as const,
      request_id: 'req-001',
    }
    mockHttp.get.mockResolvedValue(pendingTask)

    const pollPromise = waitForTask(mockHttp as never, 'task-001', {
      interval: 100,
      timeout: 500,
    })

    // Attach handler BEFORE advancing timers to avoid unhandled rejection
    const assertPromise = expect(pollPromise).rejects.toThrow(/did not complete/)
    await vi.advanceTimersByTimeAsync(1000)
    await assertPromise
  })

  it('calls onProgress callback on each poll', async () => {
    const mockHttp = createMockHttp()
    const pendingTask = {
      success: true,
      task_id: 'task-001',
      status: 'pending' as const,
      request_id: 'req-001',
    }
    const completedTask = {
      success: true,
      task_id: 'task-001',
      status: 'completed' as const,
      request_id: 'req-001',
    }

    mockHttp.get
      .mockResolvedValueOnce(pendingTask)
      .mockResolvedValueOnce(completedTask)

    const onProgress = vi.fn()

    const pollPromise = waitForTask(mockHttp as never, 'task-001', {
      interval: 100,
      timeout: 5000,
      onProgress,
    })

    await vi.advanceTimersByTimeAsync(200)

    await pollPromise
    expect(onProgress).toHaveBeenCalled()
    expect(onProgress.mock.calls[0][0].status).toBe('pending')
  })
})
