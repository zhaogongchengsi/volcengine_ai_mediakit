import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 视频拼接 ── */

export interface ConcatVideoParams {
  /** 待拼接视频 URL 列表，1~100 个，数组顺序即拼接顺序 */
  video_urls: string[]
  /** 转场效果 ID 列表，默认无转场 */
  transitions?: string[]
}

export interface ConcatVideoResult {
  /** 拼接后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频总时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function concatVideo(
  http: HttpClient,
  params: ConcatVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/concat-video',
    params,
  )
  return toDomain(res)
}

export async function concatVideoAndWait(
  http: HttpClient,
  params: ConcatVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<ConcatVideoResult>> {
  const { task_id } = await concatVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<ConcatVideoResult>
  >
}

/* ── 音频拼接 ── */

export interface ConcatAudioParams {
  /** 待拼接音频 URL 列表，1~100 个 */
  audio_urls: string[]
}

export interface ConcatAudioResult {
  /** 拼接后音频地址（M4A），有效期 24 小时 */
  audio_url: string
  /** 输出音频总时长（秒） */
  duration: number
}

export async function concatAudio(
  http: HttpClient,
  params: ConcatAudioParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/concat-audio',
    params,
  )
  return toDomain(res)
}

export async function concatAudioAndWait(
  http: HttpClient,
  params: ConcatAudioParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<ConcatAudioResult>> {
  const { task_id } = await concatAudio(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<ConcatAudioResult>
  >
}

/* ── 视频裁剪 ── */

export interface TrimVideoParams {
  /** 待裁剪视频 URL，建议 ≤10 GB，最高 4K */
  video_url: string
  /** 裁剪开始时间（秒），默认 0 */
  start_time?: number
  /** 裁剪结束时间（秒），默认到视频末尾 */
  end_time?: number
}

export interface TrimVideoResult {
  /** 裁剪后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function trimVideo(
  http: HttpClient,
  params: TrimVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/trim-video',
    params,
  )
  return toDomain(res)
}

export async function trimVideoAndWait(
  http: HttpClient,
  params: TrimVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<TrimVideoResult>> {
  const { task_id } = await trimVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<TrimVideoResult>
  >
}

/* ── 音频裁剪 ── */

export interface TrimAudioParams {
  /** 待裁剪音频 URL，建议 ≤10 GB */
  audio_url: string
  /** 裁剪开始时间（秒），默认 0 */
  start_time?: number
  /** 裁剪结束时间（秒），默认到音频末尾 */
  end_time?: number
}

export interface TrimAudioResult {
  /** 裁剪后音频地址（M4A），有效期 24 小时 */
  audio_url: string
  /** 输出音频时长（秒） */
  duration: number
}

export async function trimAudio(
  http: HttpClient,
  params: TrimAudioParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/trim-audio',
    params,
  )
  return toDomain(res)
}

export async function trimAudioAndWait(
  http: HttpClient,
  params: TrimAudioParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<TrimAudioResult>> {
  const { task_id } = await trimAudio(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<TrimAudioResult>
  >
}

/* ── 视频调速 ── */

export interface AdjustVideoSpeedParams {
  /** 待调速视频 URL，建议 ≤10 GB，最高 4K */
  video_url: string
  /** 播放速度倍数 [0.1, 4.0]，默认 1.0 */
  speed?: number
}

export interface AdjustVideoSpeedResult {
  /** 调速后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function adjustVideoSpeed(
  http: HttpClient,
  params: AdjustVideoSpeedParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/adjust-video-speed',
    params,
  )
  return toDomain(res)
}

export async function adjustVideoSpeedAndWait(
  http: HttpClient,
  params: AdjustVideoSpeedParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<AdjustVideoSpeedResult>> {
  const { task_id } = await adjustVideoSpeed(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<AdjustVideoSpeedResult>
  >
}

/* ── 音频调速 ── */

export interface AdjustAudioSpeedParams {
  /** 待调速音频 URL，建议 ≤10 GB */
  audio_url: string
  /** 播放速度倍数 [0.1, 4.0] */
  speed?: number
}

export interface AdjustAudioSpeedResult {
  /** 调速后音频地址（M4A），有效期 24 小时 */
  audio_url: string
  /** 输出音频时长（秒） */
  duration: number
}

export async function adjustAudioSpeed(
  http: HttpClient,
  params: AdjustAudioSpeedParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/adjust-audio-speed',
    params,
  )
  return toDomain(res)
}

export async function adjustAudioSpeedAndWait(
  http: HttpClient,
  params: AdjustAudioSpeedParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<AdjustAudioSpeedResult>> {
  const { task_id } = await adjustAudioSpeed(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<AdjustAudioSpeedResult>
  >
}

/* ── 音频提取 ── */

export interface ExtractAudioParams {
  /** 待提取音频的视频 URL，建议 ≤10 GB，最高 4K */
  video_url: string
  /** 输出音频格式：mp3 / m4a（默认） */
  format?: 'mp3' | 'm4a'
}

export interface ExtractAudioResult {
  /** 提取的音频地址，有效期 24 小时 */
  audio_url: string
  /** 输出音频时长（秒） */
  duration: number
}

export async function extractAudio(
  http: HttpClient,
  params: ExtractAudioParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/extract-audio',
    params,
  )
  return toDomain(res)
}

export async function extractAudioAndWait(
  http: HttpClient,
  params: ExtractAudioParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<ExtractAudioResult>> {
  const { task_id } = await extractAudio(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<ExtractAudioResult>
  >
}

/* ── 音视频合成 ── */

export interface MuxAudioVideoParams {
  /** 输入视频 URL，建议 ≤10 GB，最高 4K */
  video_url: string
  /** 输入音频 URL，建议 ≤10 GB */
  audio_url: string
  /** 是否保留视频原音轨。true（默认，保留并混音）/ false（替换原音轨） */
  is_audio_reserve?: boolean
  /** 是否对齐音视频时长。false（默认）/ true */
  is_video_audio_sync?: boolean
  /** 时长对齐基准，仅 is_video_audio_sync=true 时生效：video（默认）/ audio */
  sync_mode?: 'video' | 'audio'
  /** 时长对齐方式，仅 is_video_audio_sync=true 时生效：trim（默认）/ speed */
  sync_method?: 'trim' | 'speed'
}

export interface MuxAudioVideoResult {
  /** 合成后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频总时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function muxAudioVideo(
  http: HttpClient,
  params: MuxAudioVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/mux-audio-video',
    params,
  )
  return toDomain(res)
}

export async function muxAudioVideoAndWait(
  http: HttpClient,
  params: MuxAudioVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<MuxAudioVideoResult>> {
  const { task_id } = await muxAudioVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<MuxAudioVideoResult>
  >
}

/* ── 图片转视频 ── */

export interface ImageItem {
  /** 图片 URL */
  image_url: string
  /** 展示时长（秒），默认 3 */
  duration?: number
  /** 镜头内动画：move_up / move_down / move_left / move_right / zoom_in / zoom_out */
  animation_type?: string
  /** 动画开始时间（秒），默认 0 */
  animation_in?: number
  /** 动画结束时间（秒），默认 = duration */
  animation_out?: number
}

export interface ImageToVideoParams {
  /** 图片对象列表，1~100 个 */
  images: ImageItem[]
  /** 图片间转场效果 ID 列表，默认无转场 */
  transitions?: string[]
}

export interface ImageToVideoResult {
  /** 生成的视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频总时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function imageToVideo(
  http: HttpClient,
  params: ImageToVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/image-to-video',
    params,
  )
  return toDomain(res)
}

export async function imageToVideoAndWait(
  http: HttpClient,
  params: ImageToVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<ImageToVideoResult>> {
  const { task_id } = await imageToVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<ImageToVideoResult>
  >
}

/* ── 音频混合 ── */

export interface MixAudioParams {
  /** 待混合音频 URL 列表，1~100 个 */
  audio_urls: string[]
}

export interface MixAudioResult {
  /** 混合后音频地址（MP3），有效期 24 小时 */
  audio_url: string
  /** 输出音频时长（秒），以输入音频中最长为准 */
  duration: number
}

export async function mixAudio(
  http: HttpClient,
  params: MixAudioParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/mix-audio',
    params,
  )
  return toDomain(res)
}

export async function mixAudioAndWait(
  http: HttpClient,
  params: MixAudioParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<MixAudioResult>> {
  const { task_id } = await mixAudio(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<MixAudioResult>
  >
}

/* ── 音频声音淡入淡出 ── */

export interface FadeAudioParams {
  /** 待处理音频 URL，建议 ≤10 GB */
  audio_url: string
  /** 淡入时长（秒），0 或不填表示不执行淡入，默认 1 */
  fade_in_duration?: number
  /** 淡出时长（秒），0 或不填表示不执行淡出，默认 1 */
  fade_out_duration?: number
}

export interface FadeAudioResult {
  /** 处理后音频地址（MP3），有效期 24 小时 */
  audio_url: string
  /** 输出音频时长（秒） */
  duration: number
}

export async function fadeAudio(
  http: HttpClient,
  params: FadeAudioParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/fade-audio',
    params,
  )
  return toDomain(res)
}

export async function fadeAudioAndWait(
  http: HttpClient,
  params: FadeAudioParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<FadeAudioResult>> {
  const { task_id } = await fadeAudio(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<FadeAudioResult>
  >
}
