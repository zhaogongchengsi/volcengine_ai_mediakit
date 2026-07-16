import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── Types ── */

/** 画质增强任务请求参数 */
export interface EnhanceVideoParams {
  /** 待处理视频的公网 URL */
  video_url: string
  /** 业务场景（仅 standard 版生效） */
  scene?: 'aigc' | 'short_series' | 'ugc' | 'old_film'
  /** 工具版本，默认 standard */
  tool_version?: 'standard' | 'professional'
  /** 输出分辨率，与 resolution_limit 互斥 */
  resolution?: '720p' | '1080p' | '4k'
  /** 短边像素限制 [64, 2160]，与 resolution 互斥 */
  resolution_limit?: number
  /** 输出帧率，最高 120 */
  fps?: number
}

/** 画质增强任务完成后的结果 */
export interface EnhanceVideoResult {
  duration: number
  fps: number
  resolution: string
  tool_version: string
  video_url: string
}

/* ── Functions ── */

/**
 * 提交画质增强任务。
 *
 * @param http   - HttpClient 实例
 * @param params - 画质增强参数
 */
export async function enhanceVideo(
  http: HttpClient,
  params: EnhanceVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/enhance-video',
    params,
  )
  return toDomain(res)
}

/**
 * 提交画质增强任务并等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 画质增强参数
 * @param pollOptions - 轮询配置
 */
export async function enhanceVideoAndWait(
  http: HttpClient,
  params: EnhanceVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<EnhanceVideoResult>> {
  const { task_id } = await enhanceVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<EnhanceVideoResult>
  >
}
