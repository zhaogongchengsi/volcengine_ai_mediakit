import { describe, expect, it, vi } from 'vitest'
import { videoUnderstand, videoUnderstandAndWait } from '../tools/video-understand.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

describe('videoUnderstand', () => {
  it('posts to /api/v1/tools/video-understand-router with params', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({
      success: true,
      task_id: 'vu-task-001',
      request_id: 'req-001',
    })

    const params = {
      video_urls: ['https://example.com/video.mp4'],
      prompt: '请总结视频中的关键事件，并标注每个事件出现的时间段',
    }

    const result = await videoUnderstand(mockHttp as never, params)

    expect(mockHttp.post).toHaveBeenCalledWith(
      '/api/v1/tools/video-understand-router',
      params,
    )
    expect(result).toEqual({
      success: true,
      task_id: 'vu-task-001',
      request_id: 'req-001',
    })
  })

  it('passes all optional parameters', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({
      success: true,
      task_id: 'vu-task-002',
      request_id: 'req-002',
    })

    const params = {
      video_urls: ['https://example.com/video.mp4'],
      prompt: '请提取视频中的高光片段',
      level: 'Balanced' as const,
      prefer_models: ['doubao-seed-2-0-lite-260428'],
      prefer_endpoints: ['ep-m-20260703202744-q8tcb'],
      manual_option: {
        max_snapshot_number: 100,
        need_audio: true,
      },
      client_token: 'unique-token-123',
      callback_args: 'my-callback-data',
      callback_url: 'https://example.com/callback',
      queue_id: 'q00a9731598092652e4a95292434198',
    }

    await videoUnderstand(mockHttp as never, params)

    expect(mockHttp.post).toHaveBeenCalledWith(
      '/api/v1/tools/video-understand-router',
      expect.objectContaining({
        level: 'Balanced',
        prefer_models: ['doubao-seed-2-0-lite-260428'],
        prefer_endpoints: ['ep-m-20260703202744-q8tcb'],
        manual_option: { max_snapshot_number: 100, need_audio: true },
        client_token: 'unique-token-123',
        callback_args: 'my-callback-data',
        callback_url: 'https://example.com/callback',
        queue_id: 'q00a9731598092652e4a95292434198',
      }),
    )
  })

  it('uses Economy level by default', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({
      success: true,
      task_id: 'vu-task-003',
      request_id: 'req-003',
    })

    const params = {
      video_urls: ['https://example.com/video.mp4'],
      prompt: '请总结视频中的关键事件',
    }

    await videoUnderstand(mockHttp as never, params)

    expect(mockHttp.post).toHaveBeenCalledWith(
      '/api/v1/tools/video-understand-router',
      expect.not.objectContaining({ level: expect.anything() }),
    )
  })
})

describe('videoUnderstandAndWait', () => {
  it('submits task then polls until completion', async () => {
    const mockHttp = createMockHttp()
    const taskId = 'vu-task-004'

    mockHttp.post.mockResolvedValue({
      success: true,
      task_id: taskId,
      request_id: 'req-004',
    })

    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: taskId,
      status: 'completed',
      request_id: 'req-004',
      result: {
        duration: 120.5,
        contents: [
          '视频时长 120 秒，主要内容为城市街景拍摄。0-30 秒为日间繁忙街道俯拍，包含车流与行人；30-60 秒切换至夜间霓虹灯特写；60-90 秒为商场内部跟拍镜头；90-120 秒结束于天台俯瞰画面。',
        ],
        token_usage: {
          input_tokens: 850,
          output_tokens: 150,
          total_tokens: 1000,
        },
      },
    })

    const params = {
      video_urls: ['https://example.com/video.mp4'],
      prompt: '请总结视频中的关键事件，并标注每个事件出现的时间段',
    }

    const result = await videoUnderstandAndWait(mockHttp as never, params, {
      interval: 100,
      timeout: 5000,
    })

    expect(mockHttp.post).toHaveBeenCalledTimes(1)
    expect(mockHttp.get).toHaveBeenCalledWith(`/api/v1/tasks/${taskId}`)
    expect(result.status).toBe('completed')
    expect(result.result?.duration).toBe(120.5)
    expect(result.result?.contents).toHaveLength(1)
    expect(result.result?.token_usage.total_tokens).toBe(1000)
  })

  it('handles multiple video URLs result', async () => {
    const mockHttp = createMockHttp()
    const taskId = 'vu-task-005'

    mockHttp.post.mockResolvedValue({
      success: true,
      task_id: taskId,
      request_id: 'req-005',
    })

    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: taskId,
      status: 'completed',
      request_id: 'req-005',
      result: {
        duration: 240,
        contents: [
          '第一个视频分析结果',
          '第二个视频分析结果',
        ],
        token_usage: {
          input_tokens: 1600,
          output_tokens: 300,
          total_tokens: 1900,
        },
      },
    })

    const params = {
      video_urls: [
        'https://example.com/video1.mp4',
        'https://example.com/video2.mp4',
      ],
      prompt: '请提取每个视频中的关键内容',
    }

    const result = await videoUnderstandAndWait(mockHttp as never, params, {
      interval: 100,
      timeout: 5000,
    })

    expect(result.result?.contents).toHaveLength(2)
    expect(result.result?.duration).toBe(240)
  })
})
