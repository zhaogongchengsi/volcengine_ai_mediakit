import { describe, expect, it, vi } from 'vitest'
import {
  adjustAudioSpeed,
  adjustAudioSpeedAndWait,
  adjustVideoSpeed,
  adjustVideoSpeedAndWait,
  concatAudio,
  concatAudioAndWait,
  concatVideo,
  concatVideoAndWait,
  extractAudio,
  extractAudioAndWait,
  fadeAudio,
  fadeAudioAndWait,
  imageToVideo,
  mixAudio,
  mixAudioAndWait,
  muxAudioVideo,
  trimAudio,
  trimAudioAndWait,
  trimVideo,
  trimVideoAndWait,
} from '../tools/edit-basic.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

/* ── 视频拼接 ── */

describe('concatVideo', () => {
  it('posts to /api/v1/tools/concat-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'cv-001', request_id: 'req-001' })

    const result = await concatVideo(mockHttp as never, {
      video_urls: ['https://example.com/1.mp4', 'https://example.com/2.mp4'],
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/concat-video', {
      video_urls: ['https://example.com/1.mp4', 'https://example.com/2.mp4'],
    })
    expect(result.task_id).toBe('cv-001')
  })

  it('passes optional transitions', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'cv-002', request_id: 'req-002' })

    await concatVideo(mockHttp as never, {
      video_urls: ['https://example.com/1.mp4'],
      transitions: ['fade', 'slide'],
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/concat-video', expect.objectContaining({
      transitions: ['fade', 'slide'],
    }))
  })
})

describe('concatVideoAndWait', () => {
  it('submits task then polls until completion', async () => {
    const mockHttp = createMockHttp()
    const taskId = 'cv-003'
    mockHttp.post.mockResolvedValue({ success: true, task_id: taskId, request_id: 'req-003' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: taskId,
      status: 'completed',
      request_id: 'req-003',
      result: { video_url: 'https://example.com/merged.mp4', duration: 120, resolution: '1920x1080' },
    })

    const result = await concatVideoAndWait(mockHttp as never, {
      video_urls: ['https://example.com/1.mp4', 'https://example.com/2.mp4'],
    }, { interval: 100, timeout: 5000 })

    expect(mockHttp.post).toHaveBeenCalledTimes(1)
    expect(mockHttp.get).toHaveBeenCalledWith(`/api/v1/tasks/${taskId}`)
    expect(result.status).toBe('completed')
    expect(result.result?.video_url).toBe('https://example.com/merged.mp4')
  })
})

/* ── 音频拼接 ── */

describe('concatAudio', () => {
  it('posts to /api/v1/tools/concat-audio', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ca-001', request_id: 'req-001' })

    await concatAudio(mockHttp as never, { audio_urls: ['https://example.com/a1.m4a', 'https://example.com/a2.m4a'] })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/concat-audio', {
      audio_urls: ['https://example.com/a1.m4a', 'https://example.com/a2.m4a'],
    })
  })
})

describe('concatAudioAndWait', () => {
  it('submits and polls', async () => {
    const mockHttp = createMockHttp()
    const taskId = 'ca-002'
    mockHttp.post.mockResolvedValue({ success: true, task_id: taskId, request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: taskId,
      status: 'completed',
      request_id: 'req-002',
      result: { audio_url: 'https://example.com/merged.m4a', duration: 300 },
    })

    const result = await concatAudioAndWait(mockHttp as never, {
      audio_urls: ['https://example.com/a1.m4a'],
    }, { interval: 100, timeout: 5000 })

    expect(result.status).toBe('completed')
    expect(result.result?.audio_url).toBe('https://example.com/merged.m4a')
  })
})

/* ── 视频裁剪 ── */

describe('trimVideo', () => {
  it('posts to /api/v1/tools/trim-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'tv-001', request_id: 'req-001' })

    await trimVideo(mockHttp as never, { video_url: 'https://example.com/video.mp4', start_time: 10, end_time: 60 })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/trim-video', {
      video_url: 'https://example.com/video.mp4',
      start_time: 10,
      end_time: 60,
    })
  })
})

describe('trimVideoAndWait', () => {
  it('returns trimmed video result', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'tv-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'tv-002',
      status: 'completed',
      request_id: 'req-002',
      result: { video_url: 'https://example.com/trimmed.mp4', duration: 50, resolution: '1920x1080' },
    })

    const result = await trimVideoAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4' })
    expect(result.result?.duration).toBe(50)
  })
})

/* ── 音频裁剪 ── */

describe('trimAudio', () => {
  it('posts to /api/v1/tools/trim-audio', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ta-001', request_id: 'req-001' })

    await trimAudio(mockHttp as never, { audio_url: 'https://example.com/audio.m4a', start_time: 5 })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/trim-audio', {
      audio_url: 'https://example.com/audio.m4a',
      start_time: 5,
    })
  })
})

describe('trimAudioAndWait', () => {
  it('returns trimmed audio result', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ta-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'ta-002',
      status: 'completed',
      request_id: 'req-002',
      result: { audio_url: 'https://example.com/trimmed.m4a', duration: 30 },
    })

    const result = await trimAudioAndWait(mockHttp as never, { audio_url: 'https://example.com/audio.m4a' })
    expect(result.result?.audio_url).toBe('https://example.com/trimmed.m4a')
  })
})

/* ── 视频调速 ── */

describe('adjustVideoSpeed', () => {
  it('posts to /api/v1/tools/adjust-video-speed', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'avs-001', request_id: 'req-001' })

    await adjustVideoSpeed(mockHttp as never, { video_url: 'https://example.com/video.mp4', speed: 2 })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/adjust-video-speed', {
      video_url: 'https://example.com/video.mp4',
      speed: 2,
    })
  })
})

describe('adjustVideoSpeedAndWait', () => {
  it('returns sped-up video result', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'avs-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'avs-002',
      status: 'completed',
      request_id: 'req-002',
      result: { video_url: 'https://example.com/sped.mp4', duration: 60, resolution: '1920x1080' },
    })

    const result = await adjustVideoSpeedAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4', speed: 2 })
    expect(result.result?.duration).toBe(60)
  })
})

/* ── 音频调速 ── */

describe('adjustAudioSpeed', () => {
  it('posts to /api/v1/tools/adjust-audio-speed', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'aas-001', request_id: 'req-001' })

    await adjustAudioSpeed(mockHttp as never, { audio_url: 'https://example.com/audio.m4a', speed: 0.5 })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/adjust-audio-speed', {
      audio_url: 'https://example.com/audio.m4a',
      speed: 0.5,
    })
  })
})

describe('adjustAudioSpeedAndWait', () => {
  it('returns adjusted audio result', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'aas-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'aas-002',
      status: 'completed',
      request_id: 'req-002',
      result: { audio_url: 'https://example.com/sped.m4a', duration: 200 },
    })

    const result = await adjustAudioSpeedAndWait(mockHttp as never, { audio_url: 'https://example.com/audio.m4a' })
    expect(result.result?.duration).toBe(200)
  })
})

/* ── 音频提取 ── */

describe('extractAudio', () => {
  it('posts to /api/v1/tools/extract-audio', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ea-001', request_id: 'req-001' })

    await extractAudio(mockHttp as never, { video_url: 'https://example.com/video.mp4', format: 'mp3' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/extract-audio', {
      video_url: 'https://example.com/video.mp4',
      format: 'mp3',
    })
  })
})

describe('extractAudioAndWait', () => {
  it('returns extracted audio', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ea-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'ea-002',
      status: 'completed',
      request_id: 'req-002',
      result: { audio_url: 'https://example.com/audio.mp3', duration: 120 },
    })

    const result = await extractAudioAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4' })
    expect(result.result?.audio_url).toBe('https://example.com/audio.mp3')
  })
})

/* ── 音视频合成 ── */

describe('muxAudioVideo', () => {
  it('posts to /api/v1/tools/mux-audio-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'mav-001', request_id: 'req-001' })

    await muxAudioVideo(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      audio_url: 'https://example.com/audio.m4a',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/mux-audio-video', {
      video_url: 'https://example.com/video.mp4',
      audio_url: 'https://example.com/audio.m4a',
    })
  })

  it('passes optional sync params', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'mav-002', request_id: 'req-002' })

    await muxAudioVideo(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      audio_url: 'https://example.com/audio.m4a',
      is_audio_reserve: false,
      is_video_audio_sync: true,
      sync_mode: 'audio',
      sync_method: 'speed',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/mux-audio-video', expect.objectContaining({
      is_audio_reserve: false,
      is_video_audio_sync: true,
      sync_mode: 'audio',
      sync_method: 'speed',
    }))
  })
})

/* ── 图片转视频 ── */

describe('imageToVideo', () => {
  it('posts to /api/v1/tools/image-to-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'itv-001', request_id: 'req-001' })

    await imageToVideo(mockHttp as never, {
      images: [{ image_url: 'https://example.com/img1.jpg', duration: 3 }],
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/image-to-video', {
      images: [{ image_url: 'https://example.com/img1.jpg', duration: 3 }],
    })
  })
})

/* ── 音频混合 ── */

describe('mixAudio', () => {
  it('posts to /api/v1/tools/mix-audio', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ma-001', request_id: 'req-001' })

    await mixAudio(mockHttp as never, {
      audio_urls: ['https://example.com/a1.mp3', 'https://example.com/a2.mp3'],
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/mix-audio', {
      audio_urls: ['https://example.com/a1.mp3', 'https://example.com/a2.mp3'],
    })
  })
})

describe('mixAudioAndWait', () => {
  it('returns mixed audio result', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ma-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'ma-002',
      status: 'completed',
      request_id: 'req-002',
      result: { audio_url: 'https://example.com/mixed.mp3', duration: 180 },
    })

    const result = await mixAudioAndWait(mockHttp as never, { audio_urls: ['https://example.com/a1.mp3'] })
    expect(result.result?.audio_url).toBe('https://example.com/mixed.mp3')
  })
})

/* ── 音频淡入淡出 ── */

describe('fadeAudio', () => {
  it('posts to /api/v1/tools/fade-audio', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'fa-001', request_id: 'req-001' })

    await fadeAudio(mockHttp as never, {
      audio_url: 'https://example.com/audio.m4a',
      fade_in_duration: 2,
      fade_out_duration: 3,
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/fade-audio', {
      audio_url: 'https://example.com/audio.m4a',
      fade_in_duration: 2,
      fade_out_duration: 3,
    })
  })
})

describe('fadeAudioAndWait', () => {
  it('returns faded audio result', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'fa-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'fa-002',
      status: 'completed',
      request_id: 'req-002',
      result: { audio_url: 'https://example.com/faded.mp3', duration: 120 },
    })

    const result = await fadeAudioAndWait(mockHttp as never, { audio_url: 'https://example.com/audio.m4a' })
    expect(result.result?.duration).toBe(120)
  })
})
