import { describe, expect, it, vi } from 'vitest'
import { matteGreenscreenVideo, matteGreenscreenVideoAndWait } from '../tools/video-matte-watermark.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

describe('matteGreenscreenVideo', () => {
  it('posts to /api/v1/tools/matte-greenscreen-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'mgv-001', request_id: 'req-001' })

    await matteGreenscreenVideo(mockHttp as never, { video_url: 'https://example.com/video.mp4' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/matte-greenscreen-video', {
      video_url: 'https://example.com/video.mp4',
    })
  })

  it('passes format option', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'mgv-002', request_id: 'req-002' })

    await matteGreenscreenVideo(mockHttp as never, { video_url: 'https://example.com/video.mp4', format: 'MOV' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/matte-greenscreen-video', {
      video_url: 'https://example.com/video.mp4',
      format: 'MOV',
    })
  })
})

describe('matteGreenscreenVideoAndWait', () => {
  it('returns matted video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'mgv-003', request_id: 'req-003' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'mgv-003',
      status: 'completed',
      request_id: 'req-003',
      result: { video_url: 'https://example.com/matted.webm', duration: 60 },
    })

    const result = await matteGreenscreenVideoAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4' })
    expect(result.result?.video_url).toBe('https://example.com/matted.webm')
  })
})
