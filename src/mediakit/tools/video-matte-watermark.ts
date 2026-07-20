import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 视频绿幕抠图 ── */

export interface MatteGreenscreenVideoParams {
  /** 待抠图视频 URL */
  video_url: string
  /** 输出格式：WEBM（默认）/ MOV */
  format?: 'WEBM' | 'MOV'
}

export interface MatteGreenscreenVideoResult {
  /** 抠图后视频地址 */
  video_url: string
  /** 输出视频时长（秒） */
  duration: number
}

export async function matteGreenscreenVideo(
  http: HttpClient,
  params: MatteGreenscreenVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/matte-greenscreen-video',
    params,
  )
  return toDomain(res)
}

export async function matteGreenscreenVideoAndWait(
  http: HttpClient,
  params: MatteGreenscreenVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<MatteGreenscreenVideoResult>> {
  const { task_id } = await matteGreenscreenVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<MatteGreenscreenVideoResult>
  >
}

/* ── 视频人像抠图 ── */

export interface MattePortraitVideoParams {
  /** 待抠图视频 URL，建议 ≤10 GB */
  video_url: string
  /** 输出格式：WEBM（默认）/ MOV */
  format?: 'WEBM' | 'MOV'
}

export interface MattePortraitVideoResult {
  /** 抠像后视频地址 */
  video_url: string
  /** 输出视频时长（秒） */
  duration: number
}

export async function mattePortraitVideo(
  http: HttpClient,
  params: MattePortraitVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/matte-portrait-video',
    params,
  )
  return toDomain(res)
}

export async function mattePortraitVideoAndWait(
  http: HttpClient,
  params: MattePortraitVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<MattePortraitVideoResult>> {
  const { task_id } = await mattePortraitVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<MattePortraitVideoResult>
  >
}

/* ── 视频暗水印添加 ── */

export interface AddVideoInvisibleWatermarkParams {
  /** 待添加暗水印的视频 URL，最高 4K */
  video_url: string
  /** 待嵌入的隐藏数字信息，纯数字字符串，范围 1 至 9223372036854775807 */
  watermark_content: string
  /** 暗水印强度：normal（默认）/ high */
  watermark_level?: 'normal' | 'high'
}

export interface AddVideoInvisibleWatermarkResult {
  /** 已嵌入暗水印的视频地址 */
  video_url: string
  /** 输入视频总时长（秒） */
  duration: number
  /** 输入视频分辨率 */
  resolution: string
}

export async function addVideoInvisibleWatermark(
  http: HttpClient,
  params: AddVideoInvisibleWatermarkParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/add-video-invisible-watermark',
    params,
  )
  return toDomain(res)
}

export async function addVideoInvisibleWatermarkAndWait(
  http: HttpClient,
  params: AddVideoInvisibleWatermarkParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<AddVideoInvisibleWatermarkResult>> {
  const { task_id } = await addVideoInvisibleWatermark(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<AddVideoInvisibleWatermarkResult>
  >
}

/* ── 视频暗水印提取 ── */

export interface ExtractVideoInvisibleWatermarkParams {
  /** 待提取暗水印的视频 URL，最高 4K */
  video_url: string
}

export interface WatermarkContent {
  /** 暗水印数字信息字符串 */
  watermark_content: string
}

export interface ExtractVideoInvisibleWatermarkResult {
  /** 提取到的暗水印信息列表 */
  watermark_contents: WatermarkContent[]
  /** 输出视频总时长（秒） */
  duration: number
}

export async function extractVideoInvisibleWatermark(
  http: HttpClient,
  params: ExtractVideoInvisibleWatermarkParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/extract-video-invisible-watermark',
    params,
  )
  return toDomain(res)
}

export async function extractVideoInvisibleWatermarkAndWait(
  http: HttpClient,
  params: ExtractVideoInvisibleWatermarkParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<ExtractVideoInvisibleWatermarkResult>> {
  const { task_id } = await extractVideoInvisibleWatermark(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<ExtractVideoInvisibleWatermarkResult>
  >
}

/* ── 视频人脸打码 ── */

export interface FaceBlurVideoParams {
  /** 待打码视频 URL，最高 4K（推荐 1080P），时长 ≤10 分钟 */
  video_url: string
  /** 人脸检测置信度阈值 [0.1, 1.0]，默认 0.35 */
  face_confidence?: number
  /** 打码方式：mosaic（默认）/ blur */
  mask_mode?: 'mosaic' | 'blur'
  /** 打码强度：low / medium（默认）/ high */
  mask_strength?: 'low' | 'medium' | 'high'
  /** 人脸框扩展比例 (0.0, 1.0]，默认 0.2 */
  face_box_expand?: number
}

export interface FaceBlurVideoResult {
  /** 已打码视频地址 */
  video_url: string
  /** 输出视频总时长（秒） */
  duration: number
}

export async function faceBlurVideo(
  http: HttpClient,
  params: FaceBlurVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/face-blur-video',
    params,
  )
  return toDomain(res)
}

export async function faceBlurVideoAndWait(
  http: HttpClient,
  params: FaceBlurVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<FaceBlurVideoResult>> {
  const { task_id } = await faceBlurVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<FaceBlurVideoResult>
  >
}
