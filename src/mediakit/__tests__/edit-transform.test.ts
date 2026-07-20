import { describe, expect, it, vi } from 'vitest'
import {
  addImageToVideo,
  addSubtitleToVideo,
  applyVideoFilter,
  cropVideo,
  extractAnimatedImage,
  extractAnimatedImageAndWait,
  flipVideo,
  flipVideoAndWait,
  gaussianBlurVideo,
  rotateVideo,
  stitchVideo,
} from '../tools/edit-transform.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

/* ── 视频画面翻转 ── */

describe('flipVideo', () => {
  it('posts to /api/v1/tools/flip-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'fv-001', request_id: 'req-001' })

    await flipVideo(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      is_flip_vertical: true,
      is_flip_horizontal: true,
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/flip-video', {
      video_url: 'https://example.com/video.mp4',
      is_flip_vertical: true,
      is_flip_horizontal: true,
    })
  })
})

describe('flipVideoAndWait', () => {
  it('returns flipped video result', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'fv-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'fv-002',
      status: 'completed',
      request_id: 'req-002',
      result: { video_url: 'https://example.com/flipped.mp4', duration: 120, resolution: '1920x1080' },
    })

    const result = await flipVideoAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4', is_flip_vertical: true })
    expect(result.result?.video_url).toBe('https://example.com/flipped.mp4')
  })
})

/* ── 视频画面旋转 ── */

describe('rotateVideo', () => {
  it('posts to /api/v1/tools/rotate-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'rv-001', request_id: 'req-001' })

    await rotateVideo(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      rotate_direction: 'rotate_right_90',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/rotate-video', {
      video_url: 'https://example.com/video.mp4',
      rotate_direction: 'rotate_right_90',
    })
  })
})

/* ── 视频画面裁剪 ── */

describe('cropVideo', () => {
  it('posts to /api/v1/tools/crop-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'cv-001', request_id: 'req-001' })

    await cropVideo(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      top_left_x: 0,
      top_left_y: 0,
      bottom_right_x: 960,
      bottom_right_y: 540,
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/crop-video', {
      video_url: 'https://example.com/video.mp4',
      top_left_x: 0,
      top_left_y: 0,
      bottom_right_x: 960,
      bottom_right_y: 540,
    })
  })
})

/* ── 视频画面拼接 ── */

describe('stitchVideo', () => {
  it('posts to /api/v1/tools/stitch-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'sv-001', request_id: 'req-001' })

    await stitchVideo(mockHttp as never, {
      videos: [
        { video_url: 'https://example.com/1.mp4', keep_audio: true },
        { video_url: 'https://example.com/2.mp4' },
      ],
      stitch_direction: 'horizontal',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/stitch-video', {
      videos: [
        { video_url: 'https://example.com/1.mp4', keep_audio: true },
        { video_url: 'https://example.com/2.mp4' },
      ],
      stitch_direction: 'horizontal',
    })
  })
})

/* ── 视频加字幕 ── */

describe('addSubtitleToVideo', () => {
  it('posts to /api/v1/tools/add-subtitle-to-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'astv-001', request_id: 'req-001' })

    await addSubtitleToVideo(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      subtitles: [{ subtitle_text: 'Hello', start_time: 0, end_time: 5 }],
      subtitle_font_size: 60,
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/add-subtitle-to-video', {
      video_url: 'https://example.com/video.mp4',
      subtitles: [{ subtitle_text: 'Hello', start_time: 0, end_time: 5 }],
      subtitle_font_size: 60,
    })
  })
})

/* ── 视频加图片 ── */

describe('addImageToVideo', () => {
  it('posts to /api/v1/tools/add-image-to-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'aitv-001', request_id: 'req-001' })

    await addImageToVideo(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      sub_image_url: 'https://example.com/logo.png',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/add-image-to-video', {
      video_url: 'https://example.com/video.mp4',
      sub_image_url: 'https://example.com/logo.png',
    })
  })
})

/* ── 视频添加滤镜 ── */

describe('applyVideoFilter', () => {
  it('posts to /api/v1/tools/apply-video-filter', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'avf-001', request_id: 'req-001' })

    await applyVideoFilter(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      filter_style: 'sunset',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/apply-video-filter', {
      video_url: 'https://example.com/video.mp4',
      filter_style: 'sunset',
    })
  })
})

/* ── 视频截取动图 ── */

describe('extractAnimatedImage', () => {
  it('posts to /api/v1/tools/extract-animated-image', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'eai-001', request_id: 'req-001' })

    await extractAnimatedImage(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      start_time: 10,
      end_time: 30,
      output_format: 'webp',
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/extract-animated-image', {
      video_url: 'https://example.com/video.mp4',
      start_time: 10,
      end_time: 30,
      output_format: 'webp',
    })
  })
})

describe('extractAnimatedImageAndWait', () => {
  it('returns animated image result', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'eai-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'eai-002',
      status: 'completed',
      request_id: 'req-002',
      result: { image_url: 'https://example.com/anim.gif', duration: 20, resolution: '480x270' },
    })

    const result = await extractAnimatedImageAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4', start_time: 10, end_time: 30 })
    expect(result.result?.image_url).toBe('https://example.com/anim.gif')
  })
})

/* ── 视频高斯模糊 ── */

describe('gaussianBlurVideo', () => {
  it('posts to /api/v1/tools/gaussian-blur-video', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'gbv-001', request_id: 'req-001' })

    await gaussianBlurVideo(mockHttp as never, {
      video_url: 'https://example.com/video.mp4',
      blur_regions: [{
        start_time: 0,
        end_time: 10,
        top_left_x: 100,
        top_left_y: 50,
        bottom_right_x: 500,
        bottom_right_y: 200,
      }],
    })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/gaussian-blur-video', {
      video_url: 'https://example.com/video.mp4',
      blur_regions: [{
        start_time: 0,
        end_time: 10,
        top_left_x: 100,
        top_left_y: 50,
        bottom_right_x: 500,
        bottom_right_y: 200,
      }],
    })
  })
})
