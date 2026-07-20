import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 画质增强（大模型） ── */

/**
 * 画质增强（大模型）任务请求参数
 *
 * 基于生成式大模型对视频进行高画质增强，支持最高 2K 分辨率输出。
 *
 * 使用限制：
 * - 输入最高 1080p，短边 [360,1080]，长边 [360,1920]
 * - 仅支持 SDR
 * - 格式：mp4、flv、ts、avi、mov、wmv、mkv
 */
export interface EnhanceVideoGenerativeParams {
  /** 待增强视频 URL。支持 https://、mediakit://、vod://、tos:// */
  video_url: string
  /** 目标分辨率。720p（默认）/ 1080p / 2k */
  resolution?: '720p' | '1080p' | '2k'
  /** 目标码率档位。low / medium（默认，推荐）/ high */
  bitrate_level?: 'low' | 'medium' | 'high'
  /** 目标帧率，范围 [15, 120]。建议不超过原片 4 倍 */
  fps?: number
}

/** 画质增强（大模型）任务完成后的结果 */
export interface EnhanceVideoGenerativeResult {
  /** 增强后视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频总时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
  /** 输出视频帧率 */
  fps: number
}

/**
 * 提交画质增强（大模型）任务。
 *
 * 调用 POST /api/v1/tools/enhance-video-generative。
 *
 * @param http   - HttpClient 实例
 * @param params - 画质增强参数
 * @returns 任务提交响应，包含 task_id
 */
export async function enhanceVideoGenerative(
  http: HttpClient,
  params: EnhanceVideoGenerativeParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/enhance-video-generative',
    params,
  )
  return toDomain(res)
}

/**
 * 提交画质增强（大模型）任务并轮询等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 画质增强参数
 * @param pollOptions - 轮询配置
 * @returns 完成后的任务结果
 */
export async function enhanceVideoGenerativeAndWait(
  http: HttpClient,
  params: EnhanceVideoGenerativeParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<EnhanceVideoGenerativeResult>> {
  const { task_id } = await enhanceVideoGenerative(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<EnhanceVideoGenerativeResult>
  >
}
