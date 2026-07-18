import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 字幕擦除 ── */

/**
 * 字幕擦除模式
 * - Subtitle: 擦除内嵌硬字幕
 * - Text: 擦除画面中的文本
 */
export type EraseSubtitleMode = 'Subtitle' | 'Text'

/**
 * 指定区域擦除坐标
 *
 * 所有坐标值均为相对于视频宽高的比例（0.0 ~ 1.0），
 * 仅精细化版（erase-video-subtitle-pro）支持。
 */
export interface EraseRatioLocation {
  /** 矩形左上角 X 坐标比例 */
  top_left_x: number
  /** 矩形左上角 Y 坐标比例 */
  top_left_y: number
  /** 矩形右下角 X 坐标比例 */
  bottom_right_x: number
  /** 矩形右下角 Y 坐标比例 */
  bottom_right_y: number
}

/**
 * 字幕擦除任务请求参数
 *
 * 针对视频中的内嵌字幕/文本，实现高质量无痕擦除。
 * 提供标准版和精细化版两种版本：
 * - 标准版：平衡效果和效率
 * - 精细化版：支持指定区域擦除，效果更精细
 *
 * 使用限制：
 * - 输入视频：支持 mp4、flv、ts、avi、mov、wmv、mkv 等主流格式
 * - 文件大小：建议不超过 10 GB
 */
export interface EraseVideoSubtitleParams {
  /** 待处理视频的公网 URL */
  video_url: string
  /** 擦除模式，默认 Subtitle（擦除内嵌字幕） */
  mode?: EraseSubtitleMode
  /**
   * 指定区域擦除（仅精细化版支持）
   * 坐标值为相对于视频总宽高的比例，支持多个矩形区域
   */
  erase_ratio_location?: EraseRatioLocation[]
}

/** 字幕擦除任务完成后的结果 */
export interface EraseVideoSubtitleResult {
  /** 擦除后的视频下载地址（有效期 24 小时） */
  video_url: string
  /** 视频时长（秒） */
  duration: number
}

/* ── 工具函数 ── */

/**
 * 提交字幕擦除（精细化版）任务。
 *
 * 调用 POST /api/v1/tools/erase-video-subtitle-pro。
 * 支持指定区域擦除，适合对字幕位置有精确要求的场景。
 *
 * @param http   - HttpClient 实例
 * @param params - 字幕擦除参数，支持 erase_ratio_location 指定区域
 * @returns 任务提交响应，包含 task_id
 */
export async function eraseVideoSubtitlePro(
  http: HttpClient,
  params: EraseVideoSubtitleParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/erase-video-subtitle-pro',
    params,
  )
  return toDomain(res)
}

/**
 * 提交字幕擦除（精细化版）任务并轮询等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 字幕擦除参数
 * @param pollOptions - 轮询配置
 * @returns 完成后的任务结果，result 包含擦除后视频信息
 */
export async function eraseVideoSubtitleProAndWait(
  http: HttpClient,
  params: EraseVideoSubtitleParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<EraseVideoSubtitleResult>> {
  const { task_id } = await eraseVideoSubtitlePro(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<EraseVideoSubtitleResult>
  >
}

/**
 * 提交字幕擦除（标准版）任务。
 *
 * 调用 POST /api/v1/tools/erase-video-subtitle。
 * 标准版在效果和效率之间取得良好平衡，不支持指定区域擦除。
 *
 * @param http   - HttpClient 实例
 * @param params - 字幕擦除参数
 * @returns 任务提交响应，包含 task_id
 */
export async function eraseVideoSubtitleStandard(
  http: HttpClient,
  params: EraseVideoSubtitleParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/erase-video-subtitle',
    params,
  )
  return toDomain(res)
}

/**
 * 提交字幕擦除（标准版）任务并轮询等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 字幕擦除参数
 * @param pollOptions - 轮询配置
 * @returns 完成后的任务结果，result 包含擦除后视频信息
 */
export async function eraseVideoSubtitleStandardAndWait(
  http: HttpClient,
  params: EraseVideoSubtitleParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<EraseVideoSubtitleResult>> {
  const { task_id } = await eraseVideoSubtitleStandard(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<EraseVideoSubtitleResult>
  >
}
