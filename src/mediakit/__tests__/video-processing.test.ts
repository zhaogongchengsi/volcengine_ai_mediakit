import { describe, expect, it, vi } from 'vitest'
import {
  assessVideoQuality,
  assessVideoQualityAndWait,
  extractFrames,
  extractFramesAndWait,
  martencodeVideo,
  martencodeVideoAndWait,
  probeVideoMetadata,
  probeVideoMetadataAndWait,
  remuxVideo,
} from '../tools/video-processing.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

/* ── 视频抽帧 ── */

describe('extractFrames', () => {
  it('posts to /api/v1/tools/extract-frames', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ef-001', request_id: 'req-001' })

    await extractFrames(mockHttp as never, { video_url: 'https://example.com/video.mp4' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/extract-frames', {
      video_url: 'https://example.com/video.mp4',
    })
  })

  it('passes snapshot options', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ef-002', request_id: 'req-002' })

    await extractFrames(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      snapshot_type: 'SpecifiedTime',
      specified_time: [10, 30, 60],
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/extract-frames', expect.objectContaining({
      snapshot_type: 'SpecifiedTime',
      specified_time: [10, 30, 60],
    }))
  })
})

describe('extractFramesAndWait', () => {
  it('returns snapshots', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ef-003', request_id: 'req-003' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'ef-003',
      status: 'completed',
      request_id: 'req-003',
      result: { snapshots: [{ image_url: 'https://example.com/frame001.jpg' }], snapshot_count: 1 },
    })

    const result = await extractFramesAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4' })
    expect(result.result?.snapshot_count).toBe(1)
  })
})

/* ── 极智超清 ── */

describe('martencodeVideo', () => {
  it('posts to /api/v1/tools/martencode-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'mv-001', request_id: 'req-001' })

    await martencodeVideo(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      video: { codec: 'h265' },
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/martencode-video', {
      video_url: 'https://example.com/video.mp4',
      video: { codec: 'h265' },
    })
  })
})

describe('martencodeVideoAndWait', () => {
  it('returns transcoded video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'mv-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'mv-002',
      status: 'completed',
      request_id: 'req-002',
      result: { video_url: 'https://example.com/martencoded.mp4', duration: 120, resolution: '1920x1080', video_codec: 'h265' },
    })

    const result = await martencodeVideoAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4', video: {} })
    expect(result.result?.video_codec).toBe('h265')
  })
})

/* ── 视频转封装 ── */

describe('remuxVideo', () => {
  it('posts to /api/v1/tools/remux-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'rv-001', request_id: 'req-001' })

    await remuxVideo(mockHttp as never, { video_url: 'https://example.com/video.mp4', container_format: 'FLV' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/remux-video', {
      video_url: 'https://example.com/video.mp4',
      container_format: 'FLV',
    })
  })
})

/* ── 视频画质检测 VQScore ── */

describe('assessVideoQuality', () => {
  it('posts to /api/v1/tools/assess-video-quality', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'avq-001', request_id: 'req-001' })

    await assessVideoQuality(mockHttp as never, { video_url: 'https://example.com/video.mp4' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/assess-video-quality', {
      video_url: 'https://example.com/video.mp4',
    })
  })
})

describe('assessVideoQualityAndWait', () => {
  it('returns vq score', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'avq-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'avq-002',
      status: 'completed',
      request_id: 'req-002',
      result: { vq_score: 85, duration: 120 },
    })

    const result = await assessVideoQualityAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4' })
    expect(result.result?.vq_score).toBe(85)
  })
})

/* ── 视频元信息获取 ── */

describe('probeVideoMetadata', () => {
  it('posts to /api/v1/tools/probe-video-metadata', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'pvm-001', request_id: 'req-001' })

    await probeVideoMetadata(mockHttp as never, { video_url: 'https://example.com/video.mp4' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/probe-video-metadata', {
      video_url: 'https://example.com/video.mp4',
    })
  })
})

describe('probeVideoMetadataAndWait', () => {
  it('returns video metadata', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'pvm-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'pvm-002',
      status: 'completed',
      request_id: 'req-002',
      result: {
        format_meta: { md5: 'abc', container: 'mp4', bitrate: 5000000, duration: 180, size: 100000000 },
        video_stream_meta: { codec: 'h264', width: 1920, height: 1080, duration: 180, bitrate: 4000000, fps: 30, dynamic_range: 'SDR' },
        audio_stream_meta: { codec: 'aac', duration: 180, sample_rate: 48000, bitrate: 128000, channels: 2 },
      },
    })

    const result = await probeVideoMetadataAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4' })
    expect(result.result?.format_meta.container).toBe('mp4')
    expect(result.result?.video_stream_meta?.width).toBe(1920)
    expect(result.result?.audio_stream_meta?.channels).toBe(2)
  })
})
