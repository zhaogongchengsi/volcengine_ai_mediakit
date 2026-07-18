import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 画质增强 ── */

/**
 * 画质增强任务请求参数
 *
 * 内置智能超分、智能插帧、画面增强、自适应锐化、色彩增强等 30+ 原子算法。
 * 通过内容理解与智能画质决策，自动选择最优增强策略。
 *
 * 使用限制：
 * - 输入视频：支持 mp4、flv、ts、avi、mov、wmv、mkv 等主流格式
 * - 文件大小：建议不超过 10 GB
 * - 输入分辨率：最高支持 2K
 * - 处理耗时（RTF）：标准版 6~10x，专业版 20~30x
 */
export interface EnhanceVideoParams {
  /** 待处理视频的公网 URL */
  video_url: string
  /**
   * 业务场景，仅标准版（tool_version: 'standard'）生效。
   * - aigc: AIGC 生成的低分辨率视频超分
   * - short_series: 短剧人像增强与细节强化
   * - ugc: UGC 短视频压缩损伤修复
   * - old_film: 老片去噪、划痕修复、色偏修正
   */
  scene?: 'aigc' | 'short_series' | 'ugc' | 'old_film'
  /** 工具版本，默认 standard。professional 效果更好但耗时和费用是 standard 的 10~20 倍 */
  tool_version?: 'standard' | 'professional'
  /**
   * 输出分辨率规格，与 resolution_limit 互斥。
   * - 720p: 高清
   * - 1080p: 全高清
   * - 4k: 超高清
   */
  resolution?: '720p' | '1080p' | '4k'
  /**
   * 输出短边像素限制，取值 [64, 2160]，与 resolution 互斥。
   * 系统锁定短边为设定值，宽边等比缩放。
   */
  resolution_limit?: number
  /**
   * 输出帧率，最高 120 fps。
   * 若目标帧率高于原视频，自动触发 AI 智能插帧。
   * 建议输出帧率不超过原始帧率的 4 倍。
   */
  fps?: number
}

/** 画质增强任务完成后的结果 */
export interface EnhanceVideoResult {
  /** 视频时长（秒） */
  duration: number
  /** 输出帧率 */
  fps: number
  /** 输出分辨率（如 "1920x1080"） */
  resolution: string
  /** 使用的工具版本 */
  tool_version: string
  /** 增强后视频的下载地址（有效期 24 小时） */
  video_url: string
}

/* ── 工具函数 ── */

/**
 * 提交画质增强任务。
 *
 * 调用 POST /api/v1/tools/enhance-video 提交异步处理任务。
 *
 * @param http   - HttpClient 实例
 * @param params - 画质增强参数，至少需要提供 video_url
 * @returns 任务提交响应，包含 task_id 用于后续查询
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
 * 提交画质增强任务并轮询等待完成。
 *
 * 先提交任务，然后以固定间隔查询任务状态直到完成或超时。
 * 返回的 TaskResult.result 包含增强后的视频信息。
 *
 * @param http        - HttpClient 实例
 * @param params      - 画质增强参数
 * @param pollOptions - 轮询配置（间隔、超时、回调等）
 * @returns 完成后的任务结果，result 类型为 EnhanceVideoResult
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
