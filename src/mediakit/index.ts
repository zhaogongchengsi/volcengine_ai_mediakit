import type {
  DramaRecapVerticalParams,
  DramaRecapVerticalResult,
} from './tools/drama-recap-vertical.js'
import type {
  DramaRecapParams,
  DramaRecapResult,
} from './tools/drama-recap.js'
import type {
  DramaScriptParams,
  DramaScriptResult,
} from './tools/drama-script.js'
import type {
  EnhanceVideoParams,
  EnhanceVideoResult,
} from './tools/enhance-video.js'
import type {
  EraseVideoSubtitleParams,
  EraseVideoSubtitleResult,
} from './tools/erase-video-subtitle.js'
import type { CreateTaskResponse, MediakitConfig, TaskResult, WaitForTaskOptions } from './types.js'
import { HttpClient } from '../http/index.js'
import { getTask, waitForTask } from './base-client.js'
import {
  dramaRecapVertical,
  dramaRecapVerticalAndWait,
} from './tools/drama-recap-vertical.js'
import {
  dramaRecap,
  dramaRecapAndWait,
} from './tools/drama-recap.js'
import {
  dramaScript,
  dramaScriptAndWait,
} from './tools/drama-script.js'
import {
  enhanceVideo,
  enhanceVideoAndWait,
} from './tools/enhance-video.js'
import {
  eraseVideoSubtitlePro,
  eraseVideoSubtitleProAndWait,
  eraseVideoSubtitleStandard,
  eraseVideoSubtitleStandardAndWait,
} from './tools/erase-video-subtitle.js'

export {
  dramaRecap,
  dramaRecapAndWait,
  dramaRecapVertical,
  dramaRecapVerticalAndWait,
  dramaScript,
  dramaScriptAndWait,
  enhanceVideo,
  enhanceVideoAndWait,
  eraseVideoSubtitlePro,
  eraseVideoSubtitleProAndWait,
  eraseVideoSubtitleStandard,
  eraseVideoSubtitleStandardAndWait,
  getTask,
  waitForTask,
}

/* ── Re-exports ── */

export type {
  DramaRecapVerticalParams,
  DramaRecapVerticalResult,
} from './tools/drama-recap-vertical.js'
export type {
  DramaRecapParams,
  DramaRecapResult,
} from './tools/drama-recap.js'
export type {
  DramaScriptParams,
  DramaScriptResult,
} from './tools/drama-script.js'
export type {
  EnhanceVideoParams,
  EnhanceVideoResult,
} from './tools/enhance-video.js'
export type {
  EraseVideoSubtitleParams,
  EraseVideoSubtitleResult,
} from './tools/erase-video-subtitle.js'

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

  /* ── 字幕擦除（精细化版） ── */

  eraseVideoSubtitlePro(
    params: EraseVideoSubtitleParams,
  ): Promise<CreateTaskResponse> {
    return eraseVideoSubtitlePro(this.client, params)
  }

  eraseVideoSubtitleProAndWait(
    params: EraseVideoSubtitleParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<EraseVideoSubtitleResult>> {
    return eraseVideoSubtitleProAndWait(this.client, params, options)
  }

  /* ── 字幕擦除（标准版） ── */

  eraseVideoSubtitleStandard(
    params: EraseVideoSubtitleParams,
  ): Promise<CreateTaskResponse> {
    return eraseVideoSubtitleStandard(this.client, params)
  }

  eraseVideoSubtitleStandardAndWait(
    params: EraseVideoSubtitleParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<EraseVideoSubtitleResult>> {
    return eraseVideoSubtitleStandardAndWait(this.client, params, options)
  }

  /* ── 剧本还原 ── */

  dramaScript(params: DramaScriptParams): Promise<CreateTaskResponse> {
    return dramaScript(this.client, params)
  }

  dramaScriptAndWait(
    params: DramaScriptParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<DramaScriptResult>> {
    return dramaScriptAndWait(this.client, params, options)
  }

  /* ── 解说视频生成 ── */

  dramaRecap(params: DramaRecapParams): Promise<CreateTaskResponse> {
    return dramaRecap(this.client, params)
  }

  dramaRecapAndWait(
    params: DramaRecapParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<DramaRecapResult>> {
    return dramaRecapAndWait(this.client, params, options)
  }

  /* ── 解说视频生成（短剧行业模型） ── */

  dramaRecapVertical(
    params: DramaRecapVerticalParams,
  ): Promise<CreateTaskResponse> {
    return dramaRecapVertical(this.client, params)
  }

  dramaRecapVerticalAndWait(
    params: DramaRecapVerticalParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<DramaRecapVerticalResult>> {
    return dramaRecapVerticalAndWait(this.client, params, options)
  }
}
