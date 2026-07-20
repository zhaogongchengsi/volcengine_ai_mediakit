import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 人声背景音分离 ── */

export interface SeparateVoiceParams {
  /** 待处理视频 URL。与 audio_url 二选一 */
  video_url?: string
  /** 待处理音频 URL。与 video_url 二选一 */
  audio_url?: string
  /** 输出音频格式：aac（默认）/ mp3 / wav / m4a / flac */
  output_format?: 'aac' | 'mp3' | 'wav' | 'm4a' | 'flac'
}

export interface SeparateVoiceResult {
  /** 分离出的人声音轨地址 */
  voice_audio_url: string
  /** 分离出的背景音音轨地址 */
  background_audio_url: string
  /** 输入音视频总时长（秒） */
  duration: number
}

export async function separateVoice(
  http: HttpClient,
  params: SeparateVoiceParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/separate-voice',
    params,
  )
  return toDomain(res)
}

export async function separateVoiceAndWait(
  http: HttpClient,
  params: SeparateVoiceParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<SeparateVoiceResult>> {
  const { task_id } = await separateVoice(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<SeparateVoiceResult>
  >
}

/* ── 语音端点识别 ── */

export interface DetectVoiceActivityParams {
  /** 待处理视频 URL。与 audio_url 必须且只能提供一个 */
  video_url?: string
  /** 待处理音频 URL。与 video_url 必须且只能提供一个 */
  audio_url?: string
}

export interface VoiceSegment {
  /** 片段开始时间（秒） */
  start_time: number
  /** 片段结束时间（秒） */
  end_time: number
}

export interface DetectVoiceActivityResult {
  /** 有效人声片段列表 */
  voice_segments: VoiceSegment[]
  /** 检测到的人声片段数量 */
  segment_count: number
  /** 输入媒体文件总时长（秒） */
  duration: number
}

export async function detectVoiceActivity(
  http: HttpClient,
  params: DetectVoiceActivityParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/detect-voice-activity',
    params,
  )
  return toDomain(res)
}

export async function detectVoiceActivityAndWait(
  http: HttpClient,
  params: DetectVoiceActivityParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<DetectVoiceActivityResult>> {
  const { task_id } = await detectVoiceActivity(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<DetectVoiceActivityResult>
  >
}

/* ── 音频转码 ── */

export interface TranscodeAudioParams {
  /** 待转码音频 URL */
  audio_url: string
  /** 目标封装格式：MP3（默认）/ M4A / OGG */
  container_format?: 'MP3' | 'M4A' | 'OGG'
  /** 音频参数配置 */
  audio?: {
    /** 采样率（Hz），默认 48000 */
    sample_rate?: number
    /** 码率控制模式：cbr（默认）/ cae（仅 M4A） */
    bitrate_mode?: 'cbr' | 'cae'
    /** 音频码率（Kbps）[10, 500]，默认 128 */
    bitrate_kbps?: number
    /** 声道数：1=单声道 / 2=双声道（默认） */
    channels?: number
    /** 音量均衡算法。设为 2Pass 启用 */
    volume_method?: string
    /** 目标综合响度（LUFS）[-70, -5]，默认 -12 */
    volume_integrated_loudness?: number
    /** 真实峰值（dBTP）[-9, 0]，默认 0 */
    volume_true_peak?: number
    /** 响度范围（LU）[1, 20]，默认 7 */
    volume_loudness_range?: number
  }
  /** 需保留的元信息标签列表 */
  metadata_keep_tags?: string[]
  /** 需新增的元信息标签列表 */
  metadata_add_tags?: Array<{ key: string, value: string }>
}

export interface TranscodeAudioResult {
  /** 输出音频地址，有效期 24 小时 */
  audio_url: string
  /** 音频时长（秒） */
  duration: number
}

export async function transcodeAudio(
  http: HttpClient,
  params: TranscodeAudioParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/transcode-audio',
    params,
  )
  return toDomain(res)
}

export async function transcodeAudioAndWait(
  http: HttpClient,
  params: TranscodeAudioParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<TranscodeAudioResult>> {
  const { task_id } = await transcodeAudio(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<TranscodeAudioResult>
  >
}

/* ── 音频元信息获取 ── */

export interface ProbeAudioMetadataParams {
  /** 待探测音频 URL */
  audio_url: string
}

export interface AudioFormatMeta {
  /** 文件 MD5 值 */
  md5: string
  /** 容器格式 */
  container: string
  /** 容器码率（bps） */
  bitrate: number
  /** 时长（秒） */
  duration: number
  /** 文件大小（Byte） */
  size: number
}

export interface ProbeAudioStreamMeta {
  /** 编码格式 */
  codec: string
  /** 时长（秒） */
  duration: number
  /** 采样率（Hz） */
  sample_rate: number
  /** 码率（bps） */
  bitrate: number
  /** 声道数 */
  channels: number
}

export interface ProbeAudioMetadataResult {
  /** 容器层元信息 */
  format_meta: AudioFormatMeta
  /** 主音频流元信息（无音频流时为 null） */
  audio_stream_meta: ProbeAudioStreamMeta | null
}

export async function probeAudioMetadata(
  http: HttpClient,
  params: ProbeAudioMetadataParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/probe-audio-metadata',
    params,
  )
  return toDomain(res)
}

export async function probeAudioMetadataAndWait(
  http: HttpClient,
  params: ProbeAudioMetadataParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<ProbeAudioMetadataResult>> {
  const { task_id } = await probeAudioMetadata(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<ProbeAudioMetadataResult>
  >
}
