import type {
  EnhanceVideoParams,
  EnhanceVideoResult,
} from './tools/enhance-video.js'
import type { CreateTaskResponse, MediakitConfig, TaskResult, WaitForTaskOptions } from './types.js'
import { HttpClient } from '../http/index.js'
import { getTask, waitForTask } from './base-client.js'
import {
  enhanceVideo,
  enhanceVideoAndWait,
} from './tools/enhance-video.js'

export { enhanceVideo, enhanceVideoAndWait, getTask, waitForTask }

/* ── Re-exports ── */

export type {
  EnhanceVideoParams,
  EnhanceVideoResult,
} from './tools/enhance-video.js'

export type {
  CreateTaskResponse,
  MediakitConfig,
  TaskResult,
  TaskStatus,
  WaitForTaskOptions,
} from './types.js'

/* ── Mediakit 主类 ── */

/**
 * 火山引擎 AI MediaKit 客户端。
 *
 * 提供对所有工具的便捷访问，每个工具为独立模块，可单独调用或通过实例调用。
 *
 * @example
 * ```ts
 * const client = new Mediakit({ apiKey: 'xxx' })
 *
 * // 提交画质增强任务
 * const { task_id } = await client.enhanceVideo({
 *   video_url: 'https://example.com/video.mp4',
 *   resolution: '1080p',
 * })
 *
 * // 轮询等待结果
 * const result = await client.waitForTask(task_id)
 * ```
 */
export class Mediakit {
  private client: HttpClient

  constructor(config: MediakitConfig) {
    this.client = new HttpClient(config.baseURL)
    this.client.setApiKey(config.apiKey)
  }

  /* ── 任务管理 ── */

  getTask(taskId: string): Promise<TaskResult> {
    return getTask(this.client, taskId)
  }

  waitForTask(
    taskId: string,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult> {
    return waitForTask(this.client, taskId, options)
  }

  /* ── 画质增强 ── */

  enhanceVideo(params: EnhanceVideoParams): Promise<CreateTaskResponse> {
    return enhanceVideo(this.client, params)
  }

  enhanceVideoAndWait(
    params: EnhanceVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<EnhanceVideoResult>> {
    return enhanceVideoAndWait(this.client, params, options)
  }
}
