import { describe, expect, it, vi } from 'vitest'
import { enhanceVideo, enhanceVideoAndWait } from '../tools/enhance-video.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

describe('enhanceVideo', () => {
  it('posts to /api/v1/tools/enhance-video with params', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({
      success: true,
      task_id: 'ev-task-001',
      request_id: 'req-001',
    })

    const params = {
      video_url: 'https://example.com/video.mp4',
      resolution: '1080p' as const,
    }

    const result = await enhanceVideo(mockHttp as never, params)

    expect(mockHttp.post).toHaveBeenCalledWith(
      '/api/v1/tools/enhance-video',
      params,
    )
    expect(result).toEqual({
      success: true,
      task_id: 'ev-task-001',
      request_id: 'req-001',
    })
  })

  it('passes all optional parameters', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({
      success: true,
      task_id: 'task-002',
      request_id: 'req-002',
    })

    const params = {
      video_url: 'https://example.com/video.mp4',
      scene: 'aigc' as const,
      tool_version: 'professional' as const,
      fps: 60,
    }

    await enhanceVideo(mockHttp as never, params)

    expect(mockHttp.post).toHaveBeenCalledWith(
      '/api/v1/tools/enhance-video',
      expect.objectContaining({
        scene: 'aigc',
        tool_version: 'professional',
        fps: 60,
      }),
    )
  })
})

describe('enhanceVideoAndWait', () => {
  it('submits task then polls until completion', async () => {
    const mockHttp = createMockHttp()
    const taskId = 'ev-task-003'

    mockHttp.post.mockResolvedValue({
      success: true,
      task_id: taskId,
      request_id: 'req-003',
    })

    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: taskId,
      status: 'completed',
      request_id: 'req-003',
      result: {
        duration: 120,
        fps: 30,
        resolution: '1920x1080',
        tool_version: 'standard',
        video_url: 'https://example.com/enhanced.mp4',
      },
    })

    const params = {
      video_url: 'https://example.com/video.mp4',
      resolution: '1080p' as const,
    }

    const result = await enhanceVideoAndWait(mockHttp as never, params, {
      interval: 100,
      timeout: 5000,
    })

    expect(mockHttp.post).toHaveBeenCalledTimes(1)
    expect(mockHttp.get).toHaveBeenCalledWith(`/api/v1/tasks/${taskId}`)
    expect(result.status).toBe('completed')
    expect(result.result?.video_url).toBe('https://example.com/enhanced.mp4')
  })
})
