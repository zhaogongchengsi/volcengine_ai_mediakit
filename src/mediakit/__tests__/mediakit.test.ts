import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Mediakit } from '../index.js'

const mockClient = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  setApiKey: vi.fn(),
  getApiKey: vi.fn(),
}))

vi.mock('../../http/index.js', () => {
  const HttpClient = vi.fn().mockImplementation(class {
    constructor() {
      return mockClient
    }
  } as any)
  return { HttpClient, __mockClient: mockClient }
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('mediakit', () => {
  describe('constructor', () => {
    it('sets apiKey on the underlying client', () => {
      void new Mediakit({ apiKey: 'test-key' })

      expect(mockClient.setApiKey).toHaveBeenCalledWith('test-key')
    })

    it('creates client with custom baseURL', async () => {
      const { HttpClient } = await import('../../http/index.js')
      void new Mediakit({ apiKey: 'test-key', baseURL: 'https://custom.example.com' })

      expect(HttpClient).toHaveBeenCalledWith('https://custom.example.com')
    })
  })

  describe('enhanceVideo', () => {
    it('delegates to enhanceVideo module function', async () => {
      mockClient.post.mockResolvedValue({
        success: true,
        task_id: 'ev-001',
        request_id: 'req-001',
      })

      const client = new Mediakit({ apiKey: 'test-key' })
      const result = await client.enhanceVideo({
        video_url: 'https://example.com/video.mp4',
      })

      expect(mockClient.post).toHaveBeenCalledWith(
        '/api/v1/tools/enhance-video',
        { video_url: 'https://example.com/video.mp4' },
      )
      expect(result.task_id).toBe('ev-001')
    })
  })

  describe('getTask', () => {
    it('delegates to getTask function', async () => {
      mockClient.get.mockResolvedValue({
        success: true,
        task_id: 'task-001',
        status: 'completed',
        request_id: 'req-001',
      })

      const client = new Mediakit({ apiKey: 'test-key' })
      const result = await client.getTask('task-001')

      expect(mockClient.get).toHaveBeenCalledWith('/api/v1/tasks/task-001')
      expect(result.status).toBe('completed')
    })
  })

  describe('waitForTask', () => {
    it('polls until task completes', async () => {
      const pendingTask = {
        success: true,
        task_id: 'task-001',
        status: 'pending',
        request_id: 'req-001',
      }
      const completedTask = {
        success: true,
        task_id: 'task-001',
        status: 'completed',
        request_id: 'req-001',
      }

      mockClient.get
        .mockResolvedValueOnce(pendingTask)
        .mockResolvedValueOnce(completedTask)

      vi.useFakeTimers()
      const pollPromise = (
        new Mediakit({ apiKey: 'test-key' })
      ).waitForTask('task-001', { interval: 100, timeout: 10_000 })

      await vi.advanceTimersByTimeAsync(200)
      const result = await pollPromise
      vi.useRealTimers()

      expect(result.status).toBe('completed')
    })
  })

  describe('enhanceVideoAndWait', () => {
    it('submits task then polls for result', async () => {
      mockClient.post.mockResolvedValue({
        success: true,
        task_id: 'ev-002',
        request_id: 'req-002',
      })
      mockClient.get.mockResolvedValue({
        success: true,
        task_id: 'ev-002',
        status: 'completed',
        request_id: 'req-002',
        result: { video_url: 'https://enhanced.mp4' },
      })

      const client = new Mediakit({ apiKey: 'test-key' })
      const result = await client.enhanceVideoAndWait(
        { video_url: 'https://example.com/video.mp4' },
        { interval: 100, timeout: 5000 },
      )

      expect(mockClient.post).toHaveBeenCalledTimes(1)
      expect(mockClient.get).toHaveBeenCalledWith('/api/v1/tasks/ev-002')
      expect(result.result?.video_url).toBe('https://enhanced.mp4')
    })
  })

  /* ── edit-basic 类方法 ── */

  describe('concatVideo', () => {
    it('delegates to concatVideo module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'cv-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      const result = await client.concatVideo({ video_urls: ['https://example.com/1.mp4'] })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/concat-video', { video_urls: ['https://example.com/1.mp4'] })
      expect(result.task_id).toBe('cv-001')
    })
  })

  describe('trimVideo', () => {
    it('delegates to trimVideo module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'tv-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.trimVideo({ video_url: 'https://example.com/v.mp4', start_time: 10 })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/trim-video', { video_url: 'https://example.com/v.mp4', start_time: 10 })
    })
  })

  describe('imageToVideo', () => {
    it('delegates to imageToVideo module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'itv-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.imageToVideo({ images: [{ image_url: 'https://example.com/img.jpg' }] })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/image-to-video', { images: [{ image_url: 'https://example.com/img.jpg' }] })
    })
  })

  /* ── edit-transform 类方法 ── */

  describe('flipVideo', () => {
    it('delegates to flipVideo module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'fv-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.flipVideo({ video_url: 'https://example.com/v.mp4', is_flip_horizontal: true })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/flip-video', { video_url: 'https://example.com/v.mp4', is_flip_horizontal: true })
    })
  })

  describe('addSubtitleToVideo', () => {
    it('delegates to addSubtitleToVideo module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'astv-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.addSubtitleToVideo({ video_url: 'https://example.com/v.mp4', subtitles: [{ subtitle_text: 'Hola', start_time: 0, end_time: 3 }] })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/add-subtitle-to-video', expect.objectContaining({ video_url: 'https://example.com/v.mp4' }))
    })
  })

  /* ── video-analysis 类方法 ── */

  describe('segmentScenes', () => {
    it('delegates to segmentScenes module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'ss-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.segmentScenes({ video_url: 'https://example.com/v.mp4' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/segment-scenes', { video_url: 'https://example.com/v.mp4' })
    })
  })

  describe('asrSubtitles', () => {
    it('delegates to asrSubtitles module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'asr-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.asrSubtitles({ video_url: 'https://example.com/v.mp4' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/asr-subtitles', { video_url: 'https://example.com/v.mp4' })
    })
  })

  /* ── video-enhance 类方法 ── */

  describe('enhanceVideoGenerative', () => {
    it('delegates to enhanceVideoGenerative module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'evg-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.enhanceVideoGenerative({ video_url: 'https://example.com/v.mp4', resolution: '2k' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/enhance-video-generative', { video_url: 'https://example.com/v.mp4', resolution: '2k' })
    })
  })

  /* ── video-highlights 类方法 ── */

  describe('generateHighlightsMicrodrama', () => {
    it('delegates to module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'md-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.generateHighlightsMicrodrama({ video_urls: ['https://example.com/v.mp4'], mode: 'StorylineCuts' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/generate-highlights-microdrama', expect.anything())
    })
  })

  /* ── video-matte-watermark 类方法 ── */

  describe('matteGreenscreenVideo', () => {
    it('delegates to module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'mgv-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.matteGreenscreenVideo({ video_url: 'https://example.com/v.mp4' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/matte-greenscreen-video', { video_url: 'https://example.com/v.mp4' })
    })
  })

  /* ── video-processing 类方法 ── */

  describe('extractFrames', () => {
    it('delegates to module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'ef-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.extractFrames({ video_url: 'https://example.com/v.mp4' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/extract-frames', { video_url: 'https://example.com/v.mp4' })
    })
  })

  describe('probeVideoMetadata', () => {
    it('delegates to module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'pvm-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.probeVideoMetadata({ video_url: 'https://example.com/v.mp4' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/probe-video-metadata', { video_url: 'https://example.com/v.mp4' })
    })
  })

  /* ── vibe-editing 类方法 ── */

  describe('vibeEditing', () => {
    it('delegates to module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 've-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.vibeEditing({ content: [{ type: 'text', text: 'test' }] })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/vibe-editing', { content: [{ type: 'text', text: 'test' }] })
    })
  })

  /* ── text-to-scrolling-video 类方法 ── */

  describe('textToScrollingVideo', () => {
    it('delegates to module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'ttsv-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.textToScrollingVideo({ text: '滚屏', image_url: 'https://example.com/bg.jpg' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/text-to-scrolling-video', { text: '滚屏', image_url: 'https://example.com/bg.jpg' })
    })
  })

  /* ── audio-tools 类方法 ── */

  describe('separateVoice', () => {
    it('delegates to module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'sv-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.separateVoice({ video_url: 'https://example.com/v.mp4' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/separate-voice', { video_url: 'https://example.com/v.mp4' })
    })
  })

  describe('detectVoiceActivity', () => {
    it('delegates to module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'dva-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.detectVoiceActivity({ audio_url: 'https://example.com/a.m4a' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/detect-voice-activity', { audio_url: 'https://example.com/a.m4a' })
    })
  })

  describe('transcodeAudio', () => {
    it('delegates to module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'ta-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.transcodeAudio({ audio_url: 'https://example.com/a.wav', container_format: 'MP3' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/transcode-audio', { audio_url: 'https://example.com/a.wav', container_format: 'MP3' })
    })
  })

  describe('probeAudioMetadata', () => {
    it('delegates to module', async () => {
      mockClient.post.mockResolvedValue({ success: true, task_id: 'pam-001', request_id: 'req-001' })
      const client = new Mediakit({ apiKey: 'test-key' })
      await client.probeAudioMetadata({ audio_url: 'https://example.com/a.m4a' })
      expect(mockClient.post).toHaveBeenCalledWith('/api/v1/tools/probe-audio-metadata', { audio_url: 'https://example.com/a.m4a' })
    })
  })
})
