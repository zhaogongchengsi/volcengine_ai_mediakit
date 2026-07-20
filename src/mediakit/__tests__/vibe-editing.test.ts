import { describe, expect, it, vi } from 'vitest'
import { vibeEditing, vibeEditingAndWait } from '../tools/vibe-editing.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

describe('vibeEditing', () => {
  it('posts to /api/v1/tools/vibe-editing', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 've-001', request_id: 'req-001' })

    await vibeEditing(mockHttp as never, {
      content: [
        { type: 'text', text: '创建一个短视频' },
        { type: 'video_url', video_url: { url: 'https://example.com/clip.mp4' } },
      ],
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/vibe-editing', {
      content: [
        { type: 'text', text: '创建一个短视频' },
        { type: 'video_url', video_url: { url: 'https://example.com/clip.mp4' } },
      ],
    })
  })

  it('passes output config', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 've-002', request_id: 'req-002' })

    await vibeEditing(mockHttp as never, {
      content: [{ type: 'text', text: '片头' }],
      output: { type: 'video', resolution: '1080p', fps: 30 },
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/vibe-editing', expect.objectContaining({
      output: { type: 'video', resolution: '1080p', fps: 30 },
    }))
  })
})

describe('vibeEditingAndWait', () => {
  it('submits task then polls for artifacts', async () => {
    const mockHttp = createMockHttp()
    const taskId = 've-003'
    mockHttp.post.mockResolvedValue({ success: true, task_id: taskId, request_id: 'req-003' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: taskId,
      status: 'completed',
      request_id: 'req-003',
      result: {
        artifacts: [{
          operation: 'synthesize',
          type: 'video',
          url: 'https://example.com/output.mp4',
          duration: 60,
          description: '合成的视频',
        }],
      },
    })

    const result = await vibeEditingAndWait(mockHttp as never, {
      content: [{ type: 'text', text: '创建一个短视频' }],
    }, { interval: 100, timeout: 5000 })

    expect(result.status).toBe('completed')
    expect(result.result?.artifacts).toHaveLength(1)
    expect(result.result?.artifacts[0].url).toBe('https://example.com/output.mp4')
  })
})
