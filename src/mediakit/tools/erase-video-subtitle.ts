import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── Types ── */

/** 字幕擦除模式 */
export type EraseSubtitleMode = 'Subtitle' | 'Text'

/** 指定区域擦除坐标（比例值 0.0 ~ 1.0） */
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

/** 字幕擦除任务请求参数 */
export interface EraseVideoSubtitleParams {
  /** 待处理视频的公网 URL */
  video_url: string
  /** 擦除模式，默认 Subtitle */
  mode?: EraseSubtitleMode
  /** 指定区域擦除（仅精细化版支持），坐标值为相对于视频总宽高的比例 */
  erase_ratio_location?: EraseRatioLocation[]
}

/** 字幕擦除任务完成后的结果 */
export interface EraseVideoSubtitleResult {
  video_url: string
  duration: number
}

/* ── Functions ── */

/**
 * 提交字幕擦除（精细化版）任务。
 *
 * @param http   - HttpClient 实例
 * @param params - 字幕擦除参数
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
 * 提交字幕擦除（精细化版）任务并等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 字幕擦除参数
 * @param pollOptions - 轮询配置
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
 * @param http   - HttpClient 实例
 * @param params - 字幕擦除参数
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
 * 提交字幕擦除（标准版）任务并等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 字幕擦除参数
 * @param pollOptions - 轮询配置
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
