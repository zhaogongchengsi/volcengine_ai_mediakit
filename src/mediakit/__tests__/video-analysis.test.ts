import { describe, expect, it, vi } from 'vitest'
import {
  analyzeVideoStoryline,
  analyzeVideoStorylineAndWait,
  asrSubtitles,
  asrSubtitlesAndWait,
  segmentScenes,
  segmentScenesAndWait,
  videoOcr,
  videoOcrAndWait,
} from '../tools/video-analysis.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

/* ── 场景切分 ── */

describe('segmentScenes', () => {
  it('posts to /api/v1/tools/segment-scenes', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ss-001', request_id: 'req-001' })

    await segmentScenes(mockHttp as never, { video_url: 'https://example.com/video.mp4' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/segment-scenes', {
      video_url: 'https://example.com/video.mp4',
    })
  })
})

describe('segmentScenesAndWait', () => {
  it('returns scene segments', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ss-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'ss-002',
      status: 'completed',
      request_id: 'req-002',
      result: {
        duration: 300,
        segments: [{ start_time: 0, end_time: 30, segment_video_url: 'https://example.com/seg1.mp4' }],
      },
    })

    const result = await segmentScenesAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4' })
    expect(result.result?.segments).toHaveLength(1)
  })
})

/* ── 语音转字幕 ── */

describe('asrSubtitles', () => {
  it('posts to /api/v1/tools/asr-subtitles', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'asr-001', request_id: 'req-001' })

    await asrSubtitles(mockHttp as never, { video_url: 'https://example.com/video.mp4' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/asr-subtitles', {
      video_url: 'https://example.com/video.mp4',
    })
  })
})

describe('asrSubtitlesAndWait', () => {
  it('returns subtitle items', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'asr-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'asr-002',
      status: 'completed',
      request_id: 'req-002',
      result: {
        duration: 60,
        subtitles: [{ subtitle_text: '你好', start_time: 0, end_time: 3 }],
      },
    })

    const result = await asrSubtitlesAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4' })
    expect(result.result?.subtitles[0].subtitle_text).toBe('你好')
  })
})

/* ── 视频识别字幕（OCR） ── */

describe('videoOcr', () => {
  it('posts to /api/v1/tools/video-ocr', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ocr-001', request_id: 'req-001' })

    await videoOcr(mockHttp as never, { video_url: 'https://example.com/video.mp4', mode: 'Detailed' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/video-ocr', {
      video_url: 'https://example.com/video.mp4',
      mode: 'Detailed',
    })
  })
})

describe('videoOcrAndWait', () => {
  it('returns ocr subtitles', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ocr-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'ocr-002',
      status: 'completed',
      request_id: 'req-002',
      result: {
        duration: 120,
        subtitles: [{ subtitle_text: '字幕文本', start_time: 0, end_time: 5 }],
      },
    })

    const result = await videoOcrAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4' })
    expect(result.result?.subtitles).toHaveLength(1)
  })
})

/* ── 剧情故事线分析 ── */

describe('analyzeVideoStoryline', () => {
  it('posts to /api/v1/tools/analyze-video-storyline', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'avs-001', request_id: 'req-001' })

    await analyzeVideoStoryline(mockHttp as never, {
      video_urls: ['https://example.com/ep1.mp4', 'https://example.com/ep2.mp4'],
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/analyze-video-storyline', {
      video_urls: ['https://example.com/ep1.mp4', 'https://example.com/ep2.mp4'],
    })
  })
})

describe('analyzeVideoStorylineAndWait', () => {
  it('returns storyline analysis', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'avs-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'avs-002',
      status: 'completed',
      request_id: 'req-002',
      result: {
        duration: 3600,
        source_video_info: [{ source_video_index: 0, source_video_url: 'https://example.com/ep1.mp4', source_video_title: '第一集', source_video_summary: '剧情简介', source_video_tag: ['标签'] }],
        storyline_clips: [{ clip_index: 0, source_video_index: 0, clip_title: '开场', clip_summary: '介绍', clip_dialogue: '对话', clip_score: 4, clip_start_time: 0, clip_end_time: 60 }],
        storyline_highlights: [{ highlight_index: 0, highlight_title: '主线', highlight_summary: '摘要', highlight_clips_index: [0] }],
      },
    })

    const result = await analyzeVideoStorylineAndWait(mockHttp as never, {
      video_urls: ['https://example.com/ep1.mp4'],
    })
    expect(result.result?.storyline_clips).toHaveLength(1)
    expect(result.result?.storyline_highlights).toHaveLength(1)
  })
})
