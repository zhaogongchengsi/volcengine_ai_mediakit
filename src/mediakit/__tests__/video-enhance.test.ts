import { describe, expect, it, vi } from 'vitest'
import { enhanceVideoGenerative, enhanceVideoGenerativeAndWait } from '../tools/video-enhance.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

describe('enhanceVideoGenerative', () => {
  it('posts to /api/v1/tools/enhance-video-generative', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'evg-001', request_id: 'req-001' })

    await enhanceVideoGenerative(mockHttp as never, { video_url: 'https://example.com/video.mp4' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/enhance-video-generative', {
      video_url: 'https://example.com/video.mp4',
    })
  })

  it('passes optional params', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'evg-002', request_id: 'req-002' })

    await enhanceVideoGenerative(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      resolution: '2k',
      bitrate_level: 'high',
      fps: 60,
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/enhance-video-generative', expect.objectContaining({
      resolution: '2k',
      bitrate_level: 'high',
      fps: 60,
    }))
  })
})

describe('enhanceVideoGenerativeAndWait', () => {
  it('returns enhanced video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'evg-003', request_id: 'req-003' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'evg-003',
      status: 'completed',
      request_id: 'req-003',
      result: { video_url: 'https://example.com/enhanced.mp4', duration: 120, resolution: '2560x1440', fps: 60 },
    })

    const result = await enhanceVideoGenerativeAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4' })
    expect(result.result?.resolution).toBe('2560x1440')
    expect(result.result?.fps).toBe(60)
  })
})
