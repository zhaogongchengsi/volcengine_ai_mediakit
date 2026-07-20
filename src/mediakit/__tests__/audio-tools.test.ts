import { describe, expect, it, vi } from 'vitest'
import {
  detectVoiceActivity,
  detectVoiceActivityAndWait,
  probeAudioMetadata,
  probeAudioMetadataAndWait,
  separateVoice,
  separateVoiceAndWait,
  transcodeAudio,
} from '../tools/audio-tools.js'

function createMockHttp() {
  return {
    get: vi.fn(),
    post: vi.fn(),
  }
}

/* ── 人声背景音分离 ── */

describe('separateVoice', () => {
  it('posts to /api/v1/tools/separate-voice with video_url', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'sv-001', request_id: 'req-001' })

    await separateVoice(mockHttp as never, { video_url: 'https://example.com/video.mp4' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/separate-voice', {
      video_url: 'https://example.com/video.mp4',
    })
  })

  it('posts with audio_url and format', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'sv-002', request_id: 'req-002' })

    await separateVoice(mockHttp as never, { audio_url: 'https://example.com/audio.m4a', output_format: 'wav' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/separate-voice', {
      audio_url: 'https://example.com/audio.m4a',
      output_format: 'wav',
    })
  })
})

describe('separateVoiceAndWait', () => {
  it('returns separated tracks', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'sv-003', request_id: 'req-003' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'sv-003',
      status: 'completed',
      request_id: 'req-003',
      result: {
        voice_audio_url: 'https://example.com/voice.mp3',
        background_audio_url: 'https://example.com/bg.mp3',
        duration: 120,
      },
    })

    const result = await separateVoiceAndWait(mockHttp as never, { video_url: 'https://example.com/video.mp4' })
    expect(result.result?.voice_audio_url).toBe('https://example.com/voice.mp3')
    expect(result.result?.background_audio_url).toBe('https://example.com/bg.mp3')
  })
})

/* ── 语音端点识别 ── */

describe('detectVoiceActivity', () => {
  it('posts to /api/v1/tools/detect-voice-activity', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'dva-001', request_id: 'req-001' })

    await detectVoiceActivity(mockHttp as never, { audio_url: 'https://example.com/audio.m4a' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/detect-voice-activity', {
      audio_url: 'https://example.com/audio.m4a',
    })
  })
})

describe('detectVoiceActivityAndWait', () => {
  it('returns voice segments', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'dva-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'dva-002',
      status: 'completed',
      request_id: 'req-002',
      result: {
        voice_segments: [{ start_time: 0, end_time: 5 }, { start_time: 10, end_time: 15 }],
        segment_count: 2,
        duration: 60,
      },
    })

    const result = await detectVoiceActivityAndWait(mockHttp as never, { audio_url: 'https://example.com/audio.m4a' })
    expect(result.result?.segment_count).toBe(2)
  })
})

/* ── 音频转码 ── */

describe('transcodeAudio', () => {
  it('posts to /api/v1/tools/transcode-audio', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'ta-001', request_id: 'req-001' })

    await transcodeAudio(mockHttp as never, { audio_url: 'https://example.com/audio.wav', container_format: 'MP3' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/transcode-audio', {
      audio_url: 'https://example.com/audio.wav',
      container_format: 'MP3',
    })
  })
})

/* ── 音频元信息获取 ── */

describe('probeAudioMetadata', () => {
  it('posts to /api/v1/tools/probe-audio-metadata', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'pam-001', request_id: 'req-001' })

    await probeAudioMetadata(mockHttp as never, { audio_url: 'https://example.com/audio.m4a' })

    expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/tools/probe-audio-metadata', {
      audio_url: 'https://example.com/audio.m4a',
    })
  })
})

describe('probeAudioMetadataAndWait', () => {
  it('returns audio metadata', async () => {
    const mockHttp = createMockHttp()
    mockHttp.post.mockResolvedValue({ success: true, task_id: 'pam-002', request_id: 'req-002' })
    mockHttp.get.mockResolvedValue({
      success: true,
      task_id: 'pam-002',
      status: 'completed',
      request_id: 'req-002',
      result: {
        format_meta: { md5: 'abc123', container: 'm4a', bitrate: 256000, duration: 180, size: 5000000 },
        audio_stream_meta: { codec: 'aac', duration: 180, sample_rate: 48000, bitrate: 128000, channels: 2 },
      },
    })

    const result = await probeAudioMetadataAndWait(mockHttp as never, { audio_url: 'https://example.com/audio.m4a' })
    expect(result.result?.format_meta.container).toBe('m4a')
    expect(result.result?.audio_stream_meta?.sample_rate).toBe(48000)
  })
})
