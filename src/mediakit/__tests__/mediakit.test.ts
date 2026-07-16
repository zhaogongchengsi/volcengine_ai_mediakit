import { beforeEach, describe, expect, it, vi } from 'vitest'

import { __mockClient as mockClient } from '../../http/index.js'
import { Mediakit } from '../index.js'

vi.mock('../../http/index.js', () => {
  const mockClient = {
    get: vi.fn(),
    post: vi.fn(),
    setApiKey: vi.fn(),
    getApiKey: vi.fn(),
  }

  const HttpClient = vi.fn().mockImplementation(
    class {
      constructor() {
        return mockClient
      }
    },
  )

  return { HttpClient, __mockClient: mockClient }
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('mediakit', () => {
  describe('constructor', () => {
    it('sets apiKey on the underlying client', () => {
      void new Mediakit({ apiKey: 'test-key' })

      expect(mockClient.setApiKey).toHaveBeenCalledWith('test-key')
    })

    it('creates client with custom baseURL', async () => {
      const { HttpClient } = await import('../../http/index.js')
      void new Mediakit({ apiKey: 'test-key', baseURL: 'https://custom.example.com' })

      expect(HttpClient).toHaveBeenCalledWith('https://custom.example.com')
    })
  })

  describe('enhanceVideo', () => {
    it('delegates to enhanceVideo module function', async () => {
      mockClient.post.mockResolvedValue({
        success: true,
        task_id: 'ev-001',
        request_id: 'req-001',
      })

      const client = new Mediakit({ apiKey: 'test-key' })
      const result = await client.enhanceVideo({
        video_url: 'https://example.com/video.mp4',
      })

      expect(mockClient.post).toHaveBeenCalledWith(
        '/api/v1/tools/enhance-video',
        { video_url: 'https://example.com/video.mp4' },
      )
      expect(result.task_id).toBe('ev-001')
    })
  })

  describe('getTask', () => {
    it('delegates to getTask function', async () => {
      mockClient.get.mockResolvedValue({
        success: true,
        task_id: 'task-001',
        status: 'completed',
        request_id: 'req-001',
      })

      const client = new Mediakit({ apiKey: 'test-key' })
      const result = await client.getTask('task-001')

      expect(mockClient.get).toHaveBeenCalledWith('/api/v1/tasks/task-001')
      expect(result.status).toBe('completed')
    })
  })

  describe('waitForTask', () => {
    it('polls until task completes', async () => {
      const pendingTask = {
        success: true,
        task_id: 'task-001',
        status: 'pending',
        request_id: 'req-001',
      }
      const completedTask = {
        success: true,
        task_id: 'task-001',
        status: 'completed',
        request_id: 'req-001',
      }

      mockClient.get
        .mockResolvedValueOnce(pendingTask)
        .mockResolvedValueOnce(completedTask)

      vi.useFakeTimers()
      const pollPromise = (
        new Mediakit({ apiKey: 'test-key' })
      ).waitForTask('task-001', { interval: 100, timeout: 10_000 })

      await vi.advanceTimersByTimeAsync(200)
      const result = await pollPromise
      vi.useRealTimers()

      expect(result.status).toBe('completed')
    })
  })

  describe('enhanceVideoAndWait', () => {
    it('submits task then polls for result', async () => {
      mockClient.post.mockResolvedValue({
        success: true,
        task_id: 'ev-002',
        request_id: 'req-002',
      })
      mockClient.get.mockResolvedValue({
        success: true,
        task_id: 'ev-002',
        status: 'completed',
        request_id: 'req-002',
        result: { video_url: 'https://enhanced.mp4' },
      })

      const client = new Mediakit({ apiKey: 'test-key' })
      const result = await client.enhanceVideoAndWait(
        { video_url: 'https://example.com/video.mp4' },
        { interval: 100, timeout: 5000 },
      )

      expect(mockClient.post).toHaveBeenCalledTimes(1)
      expect(mockClient.get).toHaveBeenCalledWith('/api/v1/tasks/ev-002')
      expect(result.result?.video_url).toBe('https://enhanced.mp4')
    })
  })
})
