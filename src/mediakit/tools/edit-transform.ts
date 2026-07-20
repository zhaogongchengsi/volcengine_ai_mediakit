import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 视频画面翻转 ── */

export interface FlipVideoParams {
  /** 待翻转视频 URL，建议 ≤10 GB，最高 4K */
  video_url: string
  /** 是否垂直（上下）翻转，默认 false */
  is_flip_vertical?: boolean
  /** 是否水平（左右）翻转，默认 false。两个参数至少一个为 true */
  is_flip_horizontal?: boolean
}

export interface FlipVideoResult {
  /** 翻转后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function flipVideo(
  http: HttpClient,
  params: FlipVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/flip-video',
    params,
  )
  return toDomain(res)
}

export async function flipVideoAndWait(
  http: HttpClient,
  params: FlipVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<FlipVideoResult>> {
  const { task_id } = await flipVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<FlipVideoResult>
  >
}

/* ── 视频画面旋转 ── */

export interface RotateVideoParams {
  /** 待旋转视频 URL，建议 ≤10 GB，最高 4K */
  video_url: string
  /** 旋转方式 */
  rotate_direction: 'rotate_left_90' | 'rotate_right_90' | 'rotate_180'
}

export interface RotateVideoResult {
  /** 旋转后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function rotateVideo(
  http: HttpClient,
  params: RotateVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/rotate-video',
    params,
  )
  return toDomain(res)
}

export async function rotateVideoAndWait(
  http: HttpClient,
  params: RotateVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<RotateVideoResult>> {
  const { task_id } = await rotateVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<RotateVideoResult>
  >
}

/* ── 视频画面裁剪 ── */

export interface CropVideoParams {
  /** 待裁剪视频 URL，建议 ≤10 GB，最高 4K */
  video_url: string
  /** 裁剪矩形左上角 X 坐标（px） */
  top_left_x: number
  /** 裁剪矩形左上角 Y 坐标（px） */
  top_left_y: number
  /** 裁剪矩形右下角 X 坐标（px），必须 > top_left_x，差值 ≥16px */
  bottom_right_x: number
  /** 裁剪矩形右下角 Y 坐标（px），必须 > top_left_y，差值 ≥16px */
  bottom_right_y: number
}

export interface CropVideoResult {
  /** 裁剪后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function cropVideo(
  http: HttpClient,
  params: CropVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/crop-video',
    params,
  )
  return toDomain(res)
}

export async function cropVideoAndWait(
  http: HttpClient,
  params: CropVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<CropVideoResult>> {
  const { task_id } = await cropVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<CropVideoResult>
  >
}

/* ── 视频画面拼接 ── */

export interface StitchVideoItem {
  /** 输入视频 URL */
  video_url: string
  /** 是否保留该视频音频，默认 true */
  keep_audio?: boolean
}

export interface StitchVideoParams {
  /** 待拼接视频对象列表，2~3 个 */
  videos: StitchVideoItem[]
  /** 拼接方式：horizontal（左右拼接）/ vertical（上下拼接） */
  stitch_direction: 'horizontal' | 'vertical'
}

export interface StitchVideoResult {
  /** 拼接后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频时长（秒），与输入视频中最长的一致 */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function stitchVideo(
  http: HttpClient,
  params: StitchVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/stitch-video',
    params,
  )
  return toDomain(res)
}

export async function stitchVideoAndWait(
  http: HttpClient,
  params: StitchVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<StitchVideoResult>> {
  const { task_id } = await stitchVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<StitchVideoResult>
  >
}

/* ── 视频加字幕 ── */

export interface SubtitleContentItem {
  /** 字幕文本 */
  subtitle_text: string
  /** 起始时间（秒） */
  start_time: number
  /** 结束时间（秒） */
  end_time: number
}

export interface AddSubtitleToVideoParams {
  /** 待加字幕视频 URL */
  video_url: string
  /** 字幕文件 URL。与 subtitles 二选一 */
  subtitle_url?: string
  /** 字幕内容列表，与 subtitle_url 二选一 */
  subtitles?: SubtitleContentItem[]
  /** 位置预设：bottom_center（默认）/ top_center / center / lower_third */
  subtitle_pos_preset?: 'bottom_center' | 'top_center' | 'center' | 'lower_third'
  /** 字体大小（px），默认 50 */
  subtitle_font_size?: number
  /** 字体颜色 RGBA（#RRGGBBAA），默认 #FFFFFFFF */
  subtitle_font_color?: string
  /** 字体：sy_black（默认）/ pm_zhengdao / zhanku_kuaile / ali_puhui */
  subtitle_font_type?: string
}

export interface AddSubtitleToVideoResult {
  /** 带字幕视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function addSubtitleToVideo(
  http: HttpClient,
  params: AddSubtitleToVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/add-subtitle-to-video',
    params,
  )
  return toDomain(res)
}

export async function addSubtitleToVideoAndWait(
  http: HttpClient,
  params: AddSubtitleToVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<AddSubtitleToVideoResult>> {
  const { task_id } = await addSubtitleToVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<AddSubtitleToVideoResult>
  >
}

/* ── 视频加图片 ── */

export interface AddImageToVideoParams {
  /** 待加图片视频 URL */
  video_url: string
  /** 待添加图片 URL */
  sub_image_url: string
  /** 图片宽度，支持像素值（如 "100"）或百分比（如 "10%"），默认 "10%" */
  sub_image_width?: string
  /** 图片高度，默认 "5%" */
  sub_image_height?: string
  /** 左上角 X 位置，默认 "85%" */
  sub_image_pos_x?: string
  /** 左上角 Y 位置，默认 "90%" */
  sub_image_pos_y?: string
  /** 开始显示时间（秒） */
  start_time?: number
  /** 结束显示时间（秒） */
  end_time?: number
}

export interface AddImageToVideoResult {
  /** 加图片后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function addImageToVideo(
  http: HttpClient,
  params: AddImageToVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/add-image-to-video',
    params,
  )
  return toDomain(res)
}

export async function addImageToVideoAndWait(
  http: HttpClient,
  params: AddImageToVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<AddImageToVideoResult>> {
  const { task_id } = await addImageToVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<AddImageToVideoResult>
  >
}

/* ── 视频添加滤镜 ── */

export interface ApplyVideoFilterParams {
  /** 待处理视频 URL */
  video_url: string
  /** 滤镜风格：spring（默认）/ sunset / vivid / fair_skin / food */
  filter_style?: 'spring' | 'sunset' | 'vivid' | 'fair_skin' | 'food'
}

export interface ApplyVideoFilterResult {
  /** 处理后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function applyVideoFilter(
  http: HttpClient,
  params: ApplyVideoFilterParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/apply-video-filter',
    params,
  )
  return toDomain(res)
}

export async function applyVideoFilterAndWait(
  http: HttpClient,
  params: ApplyVideoFilterParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<ApplyVideoFilterResult>> {
  const { task_id } = await applyVideoFilter(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<ApplyVideoFilterResult>
  >
}

/* ── 视频截取动图 ── */

export interface ExtractAnimatedImageParams {
  /** 待截取动图的视频 URL，最高 4K */
  video_url: string
  /** 截取开始时间（秒） */
  start_time: number
  /** 截取结束时间（秒），输出动图时长最大 60 秒 */
  end_time: number
  /** 输出格式：gif（默认）/ webp */
  output_format?: 'gif' | 'webp'
}

export interface ExtractAnimatedImageResult {
  /** 动图地址，有效期 24 小时 */
  image_url: string
  /** 动图时长（秒） */
  duration: number
  /** 动图分辨率 */
  resolution: string
}

export async function extractAnimatedImage(
  http: HttpClient,
  params: ExtractAnimatedImageParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/extract-animated-image',
    params,
  )
  return toDomain(res)
}

export async function extractAnimatedImageAndWait(
  http: HttpClient,
  params: ExtractAnimatedImageParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<ExtractAnimatedImageResult>> {
  const { task_id } = await extractAnimatedImage(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<ExtractAnimatedImageResult>
  >
}

/* ── 视频高斯模糊 ── */

export interface BlurRegion {
  /** 模糊开始时间（秒） */
  start_time: number
  /** 模糊结束时间（秒） */
  end_time: number
  /** 模糊矩形左上角 X 坐标（px） */
  top_left_x: number
  /** 模糊矩形左上角 Y 坐标（px） */
  top_left_y: number
  /** 模糊矩形右下角 X 坐标（px） */
  bottom_right_x: number
  /** 模糊矩形右下角 Y 坐标（px） */
  bottom_right_y: number
}

export interface GaussianBlurVideoParams {
  /** 待处理视频 URL，最高 4K */
  video_url: string
  /** 高斯模糊配置数组，最多 3 组 */
  blur_regions: BlurRegion[]
}

export interface GaussianBlurVideoResult {
  /** 处理后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频分辨率 */
  resolution: string
  /** 输出视频时长（秒） */
  duration: number
}

export async function gaussianBlurVideo(
  http: HttpClient,
  params: GaussianBlurVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/gaussian-blur-video',
    params,
  )
  return toDomain(res)
}

export async function gaussianBlurVideoAndWait(
  http: HttpClient,
  params: GaussianBlurVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<GaussianBlurVideoResult>> {
  const { task_id } = await gaussianBlurVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<GaussianBlurVideoResult>
  >
}
