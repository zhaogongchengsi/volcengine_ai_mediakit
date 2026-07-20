import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 视频抽帧 ── */

export interface ExtractFramesParams {
  /** 待处理视频 URL */
  video_url: string
  /** 截图策略：TimeInterval（默认）/ SpecifiedTime / SpecifiedFrames / SceneChange */
  snapshot_type?: 'TimeInterval' | 'SpecifiedTime' | 'SpecifiedFrames' | 'SceneChange'
  /** 时间间隔（秒），默认 1，需 >0.001。仅 TimeInterval 时生效 */
  time_interval?: number
  /** 指定时间点列表（秒），最多 1000 个。仅 SpecifiedTime 时必填 */
  specified_time?: number[]
  /** 指定帧号列表。仅 SpecifiedFrames 时必填 */
  specified_frames?: number[]
  /** 场景变化敏感度阈值 (0, 1)，默认 0.1。仅 SceneChange 时生效 */
  scene_change_threshold?: number
  /** 截图最大数量 [1, 1000]。仅 TimeInterval 和 SceneChange 时生效 */
  snapshot_limit?: number
  /** 输出图片长边最大像素 [0, 4096] */
  scale_long?: number
  /** 输出图片短边最大像素 [0, 4096] */
  scale_short?: number
  /** 是否合成雪碧图，默认 false */
  enable_sprite?: boolean
  /** 雪碧图行数 [1, 100]，默认 10 */
  sprite_rows?: number
  /** 雪碧图列数 [1, 100]，默认 10 */
  sprite_cols?: number
}

export interface Snapshot {
  /** 截图下载地址，有效期 24 小时 */
  image_url: string
}

export interface ExtractFramesResult {
  /** 截图结果列表 */
  snapshots: Snapshot[]
  /** 成功生成的截图总数 */
  snapshot_count: number
}

export async function extractFrames(
  http: HttpClient,
  params: ExtractFramesParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/extract-frames',
    params,
  )
  return toDomain(res)
}

export async function extractFramesAndWait(
  http: HttpClient,
  params: ExtractFramesParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<ExtractFramesResult>> {
  const { task_id } = await extractFrames(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<ExtractFramesResult>
  >
}

/* ── 极智超清 ── */

export interface MartencodeVideoParams {
  /** 待转码视频 URL */
  video_url: string
  /** 输出封装格式：MP4（默认）/ FLV / MPEGTS */
  container_format?: 'MP4' | 'FLV' | 'MPEGTS'
  /** 视频转码参数配置 */
  video: {
    /** 视频编码：h264（默认）/ h265 */
    codec?: 'h264' | 'h265'
    /** 缩放模式：0=跟随片源（默认）/ 1=长短边限制 / 2=宽高限制 */
    scale_type?: number
    /** 填充拉伸策略：0=不上采（默认）/ 1=拉伸上采 / 2=补黑边上采 */
    scale_mode?: number
    /** 目标宽度（px）[0, 4320]。仅 scale_type=2 */
    scale_width?: number
    /** 目标高度（px）[0, 4320]。仅 scale_type=2 */
    scale_height?: number
    /** 目标短边（px）[0, 4320]。仅 scale_type=1 */
    scale_short?: number
    /** 目标长边（px）[0, 4320]。仅 scale_type=1 */
    scale_long?: number
    /** 码率控制模式：crf（默认）/ abr / cbr */
    bitrate_mode?: 'crf' | 'abr' | 'cbr'
    /** CRF 参数 [0, 51]，默认 25。仅 crf 模式 */
    bitrate_crf?: number
    /** 视频码率目标值（Kbps）[10, 50000]，默认 2000 */
    bitrate_kbps?: number
    /** 帧率控制模式：vfr（默认）/ cfr */
    fps_mode?: 'vfr' | 'cfr'
    /** 目标帧率 [1, 240] */
    fps?: number
    /** 是否 HDR 转 SDR，默认 true */
    is_hdr_to_sdr?: boolean
  }
  /** 音频转码参数配置 */
  audio?: {
    /** 音频编码。当前仅支持 aac */
    codec?: string
    /** 采样率（Hz），默认 44100 */
    sample_rate?: number
    /** 码率控制模式：cbr（默认）/ cae */
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

export interface MartencodeVideoResult {
  /** 输出视频地址，有效期 24 小时 */
  video_url: string
  /** 视频时长（秒） */
  duration: number
  /** 转码后分辨率 */
  resolution: string
  /** 视频编码格式 */
  video_codec: string
}

export async function martencodeVideo(
  http: HttpClient,
  params: MartencodeVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/martencode-video',
    params,
  )
  return toDomain(res)
}

export async function martencodeVideoAndWait(
  http: HttpClient,
  params: MartencodeVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<MartencodeVideoResult>> {
  const { task_id } = await martencodeVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<MartencodeVideoResult>
  >
}

/* ── 视频转封装 ── */

export interface RemuxVideoParams {
  /** 待处理视频 URL */
  video_url: string
  /** 目标封装格式：MP4（默认）/ FLV / MPEGTS */
  container_format?: 'MP4' | 'FLV' | 'MPEGTS'
  /** 需保留的元信息标签列表 */
  metadata_keep_tags?: string[]
  /** 需新增的元信息标签列表 */
  metadata_add_tags?: Array<{ key: string, value: string }>
}

export interface RemuxVideoResult {
  /** 输出视频地址，有效期 24 小时 */
  video_url: string
  /** 视频时长（秒） */
  duration: number
}

export async function remuxVideo(
  http: HttpClient,
  params: RemuxVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/remux-video',
    params,
  )
  return toDomain(res)
}

export async function remuxVideoAndWait(
  http: HttpClient,
  params: RemuxVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<RemuxVideoResult>> {
  const { task_id } = await remuxVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<RemuxVideoResult>
  >
}

/* ── 视频画质检测 VQScore ── */

export interface AssessVideoQualityParams {
  /** 待检测视频 URL，最高 4K */
  video_url: string
}

export interface AssessVideoQualityResult {
  /** VQScore 画质评分 [0, 100] */
  vq_score: number
  /** 输入视频时长（秒） */
  duration: number
}

export async function assessVideoQuality(
  http: HttpClient,
  params: AssessVideoQualityParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/assess-video-quality',
    params,
  )
  return toDomain(res)
}

export async function assessVideoQualityAndWait(
  http: HttpClient,
  params: AssessVideoQualityParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<AssessVideoQualityResult>> {
  const { task_id } = await assessVideoQuality(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<AssessVideoQualityResult>
  >
}

/* ── 视频元信息获取 ── */

export interface ProbeVideoMetadataParams {
  /** 待探测视频 URL */
  video_url: string
}

export interface FormatMeta {
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

export interface VideoStreamMeta {
  /** 编码格式 */
  codec: string
  /** 宽度（px） */
  width: number
  /** 高度（px） */
  height: number
  /** 时长（秒） */
  duration: number
  /** 码率（bps） */
  bitrate: number
  /** 帧率 */
  fps: number
  /** 动态范围 */
  dynamic_range: string
}

export interface AudioStreamMeta {
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

export interface ProbeVideoMetadataResult {
  /** 容器层元信息 */
  format_meta: FormatMeta
  /** 主视频流元信息（无视频流时为 null） */
  video_stream_meta: VideoStreamMeta | null
  /** 主音频流元信息（无音频流时为 null） */
  audio_stream_meta: AudioStreamMeta | null
}

export async function probeVideoMetadata(
  http: HttpClient,
  params: ProbeVideoMetadataParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/probe-video-metadata',
    params,
  )
  return toDomain(res)
}

export async function probeVideoMetadataAndWait(
  http: HttpClient,
  params: ProbeVideoMetadataParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<ProbeVideoMetadataResult>> {
  const { task_id } = await probeVideoMetadata(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<ProbeVideoMetadataResult>
  >
}
