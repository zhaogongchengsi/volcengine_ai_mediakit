import { describe, expect, it, vi } from 'vitest'
import { textToScrollingVideo, textToScrollingVideoAndWait } from '../tools/text-to-scrolling-video.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

describe('textToScrollingVideo', () => {
  it('posts to /api/v1/tools/text-to-scrolling-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ttsv-001', request_id: 'req-001' })

    await textToScrollingVideo(mockHttp as never, {
      text: 'Hello World\n这是第二行',
      image_url: 'https://example.com/bg.jpg',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/text-to-scrolling-video', {
      text: 'Hello World\n这是第二行',
      image_url: 'https://example.com/bg.jpg',
    })
  })

  it('passes all optional params', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ttsv-002', request_id: 'req-002' })

    await textToScrollingVideo(mockHttp as never, {
      text: '滚屏文字',
      image_url: 'https://example.com/bg.jpg',
      audio_url: 'https://example.com/music.mp3',
      resolution: '1080p',
      font_type: 'pm_zhengdao',
      font_color: '#FF0000FF',
      single_roll_duration: 4,
      start_hold_duration: 1,
      end_hold_duration: 1,
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/text-to-scrolling-video', expect.objectContaining({
      resolution: '1080p',
      font_type: 'pm_zhengdao',
      font_color: '#FF0000FF',
      single_roll_duration: 4,
    }))
  })
})

describe('textToScrollingVideoAndWait', () => {
  it('returns video result', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ttsv-003', request_id: 'req-003' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'ttsv-003',
      status: 'completed',
      request_id: 'req-003',
      result: { video_url: 'https://example.com/scrolling.mp4', duration: 30, resolution: '720x1280' },
    })

    const result = await textToScrollingVideoAndWait(mockHttp as never, {
      text: '滚屏文字',
      image_url: 'https://example.com/bg.jpg',
    }, { interval: 100, timeout: 5000 })

    expect(result.result?.video_url).toBe('https://example.com/scrolling.mp4')
  })
})
