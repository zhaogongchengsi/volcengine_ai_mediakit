import { describe, expect, it, vi } from 'vitest'
import {
  analyzeVideoHighlights,
  analyzeVideoHighlightsAndWait,
  generateHighlightsMicrodrama,
  generateHighlightsMicrodramaAndWait,
  generateHighlightsMinigame,
  generateHighlightsMovie,
  generateHighlightsMovieAndWait,
} from '../tools/video-highlights.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

/* ── 高光智剪-短剧 ── */

describe('generateHighlightsMicrodrama', () => {
  it('posts to /api/v1/tools/generate-highlights-microdrama', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ghm-001', request_id: 'req-001' })

    await generateHighlightsMicrodrama(mockHttp as never, {
      video_urls: ['https://example.com/ep1.mp4'],
      mode: 'StorylineCuts',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/generate-highlights-microdrama', {
      video_urls: ['https://example.com/ep1.mp4'],
      mode: 'StorylineCuts',
    })
  })
})

describe('generateHighlightsMicrodramaAndWait', () => {
  it('returns highlight videos', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ghm-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'ghm-002',
      status: 'completed',
      request_id: 'req-002',
      result: {
        duration: 1800,
        video_urls: ['https://example.com/highlight.mp4'],
        mixvideo_info: [{ mixvideo_index: 0, duration: 60, size: 5000000, video_url: 'https://example.com/highlight.mp4', clips: [] }],
      },
    })

    const result = await generateHighlightsMicrodramaAndWait(mockHttp as never, {
      video_urls: ['https://example.com/ep1.mp4'],
      mode: 'StorylineCuts',
    })
    expect(result.result?.video_urls).toHaveLength(1)
  })
})

/* ── 高光智剪-小游戏 ── */

describe('generateHighlightsMinigame', () => {
  it('posts to /api/v1/tools/generate-highlights-minigame', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ghmg-001', request_id: 'req-001' })

    await generateHighlightsMinigame(mockHttp as never, {
      video_urls: ['https://example.com/game.mp4'],
      mode: 'HighlightExtract',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/generate-highlights-minigame', {
      video_urls: ['https://example.com/game.mp4'],
      mode: 'HighlightExtract',
    })
  })
})

/* ── 高光智剪-影视拆条 ── */

describe('generateHighlightsMovie', () => {
  it('posts to /api/v1/tools/generate-highlights-movie', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ghm-003', request_id: 'req-003' })

    await generateHighlightsMovie(mockHttp as never, {
      video_url: 'https://example.com/movie.mp4',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/generate-highlights-movie', {
      video_url: 'https://example.com/movie.mp4',
    })
  })
})

describe('generateHighlightsMovieAndWait', () => {
  it('returns movie cuts', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ghm-004', request_id: 'req-004' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'ghm-004',
      status: 'completed',
      request_id: 'req-004',
      result: {
        input_duration: 5400,
        video_urls: ['https://example.com/cut1.mp4', 'https://example.com/cut2.mp4'],
        result_cuts_info: [
          { title: '片段1', duration: 120, size: 10000000, video_url: 'https://example.com/cut1.mp4' },
        ],
      },
    })

    const result = await generateHighlightsMovieAndWait(mockHttp as never, { video_url: 'https://example.com/movie.mp4' })
    expect(result.result?.video_urls).toHaveLength(2)
  })
})

/* ── 高光片段提取（仅分析） ── */

describe('analyzeVideoHighlights', () => {
  it('posts to /api/v1/tools/analyze-video-highlights', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'avh-001', request_id: 'req-001' })

    await analyzeVideoHighlights(mockHttp as never, {
      video_urls: ['https://example.com/video.mp4'],
      model: 'Miniseries',
      mode: 'StorylineCuts',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/analyze-video-highlights', {
      video_urls: ['https://example.com/video.mp4'],
      model: 'Miniseries',
      mode: 'StorylineCuts',
    })
  })
})

describe('analyzeVideoHighlightsAndWait', () => {
  it('returns highlight info', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'avh-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'avh-002',
      status: 'completed',
      request_id: 'req-002',
      result: {
        duration: 3600,
        highlight_info: [{ source_video_index: 0, start_time: 0, end_time: 60, score: 4, ocr: '对话', description: '精彩片段' }],
      },
    })

    const result = await analyzeVideoHighlightsAndWait(mockHttp as never, {
      video_urls: ['https://example.com/video.mp4'],
      model: 'Miniseries',
      mode: 'StorylineCuts',
    })
    expect(result.result?.highlight_info).toHaveLength(1)
  })
})
