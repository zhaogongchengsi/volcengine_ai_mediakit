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
import type {
  VideoUnderstandParams,
  VideoUnderstandResult,
} from './tools/video-understand.js'
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
import {
  videoUnderstand,
  videoUnderstandAndWait,
} from './tools/video-understand.js'

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
  videoUnderstand,
  videoUnderstandAndWait,
  waitForTask,
}

/* ── 类型重导出 ── */

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
  VideoUnderstandManualOption,
  VideoUnderstandParams,
  VideoUnderstandResult,
  VideoUnderstandTokenUsage,
} from './tools/video-understand.js'

export type {
  CreateTaskResponse,
  MediakitConfig,
  TaskResult,
  TaskStatus,
  WaitForTaskOptions,
} from './types.js'

/* ── Mediakit 客户端类 ── */

/**
 * 火山引擎 AI MediaKit 客户端。
 *
 * 提供对所有多媒体处理工具的便捷访问，每个工具为独立模块，
 * 可单独调用或通过实例调用。所有工具均基于异步任务机制：
 * 1. 调用 xxx() 提交任务 → 获得 task_id
 * 2. 调用 waitForTask() 轮询等待 → 获得最终结果
 * 3. 或使用 xxxAndWait() 一步完成
 *
 * @example
 * ```ts
 * import { Mediakit } from '@zzhqux/volcengine-ai-mediakit'
 *
 * const client = new Mediakit({ apiKey: 'your-api-key' })
 *
 * // 方式一：分步调用
 * const { task_id } = await client.enhanceVideo({
 *   video_url: 'https://example.com/video.mp4',
 *   resolution: '1080p',
 * })
 * const result = await client.waitForTask(task_id)
 * console.log('增强后视频:', result.result?.video_url)
 *
 * // 方式二：一步完成
 * const result = await client.enhanceVideoAndWait({
 *   video_url: 'https://example.com/video.mp4',
 *   resolution: '1080p',
 * })
 * ```
 */
export class Mediakit {
  private client: HttpClient

  constructor(config: MediakitConfig) {
    this.client = new HttpClient(config.baseURL)
    this.client.setApiKey(config.apiKey)
  }

  /* ── 任务管理 ── */

  /**
   * 查询任务信息。
   *
   * @param taskId - 任务 ID
   * @returns 任务当前状态和结果
   */
  getTask(taskId: string): Promise<TaskResult> {
    return getTask(this.client, taskId)
  }

  /**
   * 轮询等待任务完成。
   *
   * @param taskId  - 任务 ID
   * @param options - 轮询配置（间隔、超时、回调）
   * @returns 完成后的任务结果
   */
  waitForTask(
    taskId: string,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult> {
    return waitForTask(this.client, taskId, options)
  }

  /* ── 画质增强 ── */

  /**
   * 提交画质增强任务。
   *
   * @param params - 画质增强参数，至少需提供 video_url
   * @returns 任务提交响应
   */
  enhanceVideo(params: EnhanceVideoParams): Promise<CreateTaskResponse> {
    return enhanceVideo(this.client, params)
  }

  /**
   * 提交画质增强任务并等待完成。
   *
   * @param params  - 画质增强参数
   * @param options - 轮询配置
   * @returns 增强后的视频信息
   */
  enhanceVideoAndWait(
    params: EnhanceVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<EnhanceVideoResult>> {
    return enhanceVideoAndWait(this.client, params, options)
  }

  /* ── 字幕擦除（精细化版） ── */

  /**
   * 提交字幕擦除（精细化版）任务。
   * 支持指定区域擦除。
   *
   * @param params - 字幕擦除参数
   * @returns 任务提交响应
   */
  eraseVideoSubtitlePro(
    params: EraseVideoSubtitleParams,
  ): Promise<CreateTaskResponse> {
    return eraseVideoSubtitlePro(this.client, params)
  }

  /**
   * 提交字幕擦除（精细化版）任务并等待完成。
   *
   * @param params  - 字幕擦除参数
   * @param options - 轮询配置
   * @returns 擦除后的视频信息
   */
  eraseVideoSubtitleProAndWait(
    params: EraseVideoSubtitleParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<EraseVideoSubtitleResult>> {
    return eraseVideoSubtitleProAndWait(this.client, params, options)
  }

  /* ── 字幕擦除（标准版） ── */

  /**
   * 提交字幕擦除（标准版）任务。
   * 效果和效率之间取得平衡。
   *
   * @param params - 字幕擦除参数
   * @returns 任务提交响应
   */
  eraseVideoSubtitleStandard(
    params: EraseVideoSubtitleParams,
  ): Promise<CreateTaskResponse> {
    return eraseVideoSubtitleStandard(this.client, params)
  }

  /**
   * 提交字幕擦除（标准版）任务并等待完成。
   *
   * @param params  - 字幕擦除参数
   * @param options - 轮询配置
   * @returns 擦除后的视频信息
   */
  eraseVideoSubtitleStandardAndWait(
    params: EraseVideoSubtitleParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<EraseVideoSubtitleResult>> {
    return eraseVideoSubtitleStandardAndWait(this.client, params, options)
  }

  /* ── 剧本还原 ── */

  /**
   * 提交剧本还原任务。
   * 将真人实拍短剧转化为结构化剧本文本。
   *
   * @param params - 剧本还原参数，video_urls 必填
   * @returns 任务提交响应
   */
  dramaScript(params: DramaScriptParams): Promise<CreateTaskResponse> {
    return dramaScript(this.client, params)
  }

  /**
   * 提交剧本还原任务并等待完成。
   *
   * @param params  - 剧本还原参数
   * @param options - 轮询配置
   * @returns 剧本还原结果，含 result_url 和 drama_script_task_id
   */
  dramaScriptAndWait(
    params: DramaScriptParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<DramaScriptResult>> {
    return dramaScriptAndWait(this.client, params, options)
  }

  /* ── 解说视频生成 ── */

  /**
   * 提交解说视频生成任务。
   * 需要先完成剧本还原，获取 drama_script_task_id。
   *
   * @param params - 解说视频生成参数，drama_script_task_id 必填
   * @returns 任务提交响应
   */
  dramaRecap(params: DramaRecapParams): Promise<CreateTaskResponse> {
    return dramaRecap(this.client, params)
  }

  /**
   * 提交解说视频生成任务并等待完成。
   *
   * @param params  - 解说视频生成参数
   * @param options - 轮询配置
   * @returns 生成的解说视频信息
   */
  dramaRecapAndWait(
    params: DramaRecapParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<DramaRecapResult>> {
    return dramaRecapAndWait(this.client, params, options)
  }

  /* ── 解说视频生成（短剧行业模型） ── */

  /**
   * 提交解说视频生成（短剧行业模型）任务。
   * 一步到位，无需先做剧本还原。
   *
   * @param params - 解说视频生成参数，video_urls 和 mode 必填
   * @returns 任务提交响应
   */
  dramaRecapVertical(
    params: DramaRecapVerticalParams,
  ): Promise<CreateTaskResponse> {
    return dramaRecapVertical(this.client, params)
  }

  /**
   * 提交解说视频生成（短剧行业模型）任务并等待完成。
   *
   * @param params  - 解说视频生成参数
   * @param options - 轮询配置
   * @returns 生成的解说视频信息
   */
  dramaRecapVerticalAndWait(
    params: DramaRecapVerticalParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<DramaRecapVerticalResult>> {
    return dramaRecapVerticalAndWait(this.client, params, options)
  }

  /* ── 视频理解（高光片段提取） ── */

  /**
   * 提交视频理解任务。
   * 基于视觉大模型对视频内容进行深度分析。
   *
   * @param params - 视频理解参数，video_urls 和 prompt 必填
   * @returns 任务提交响应
   */
  videoUnderstand(
    params: VideoUnderstandParams,
  ): Promise<CreateTaskResponse> {
    return videoUnderstand(this.client, params)
  }

  /**
   * 提交视频理解任务并等待完成。
   *
   * @param params  - 视频理解参数
   * @param options - 轮询配置
   * @returns 分析结果列表和 Token 统计
   */
  videoUnderstandAndWait(
    params: VideoUnderstandParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<VideoUnderstandResult>> {
    return videoUnderstandAndWait(this.client, params, options)
  }
}
