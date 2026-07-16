import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── Types ── */

/** 分析档位 */
export type UnderstandLevel = 'Economy' | 'Balanced' | 'Quality'

/** 手动模式参数 */
export interface VideoUnderstandManualOption {
  /** 最大截图帧数，取值范围 [0, 1000]，默认 0（由 level 档位决定） */
  max_snapshot_number?: number
  /** 是否需要识别音频，默认 false */
  need_audio?: boolean
}

/** 视频理解任务请求参数 */
export interface VideoUnderstandParams {
  /** 待处理的视频 URL 列表，最多 10 个，单个视频不超过 2 小时 */
  video_urls: string[]
  /** 提示词，用于指导大模型对视频内容进行分析的自然语言描述 */
  prompt: string
  /** 分析档位，默认 Economy */
  level?: UnderstandLevel
  /** 优先使用的模型 ID 列表，最多 10 个 */
  prefer_models?: string[]
  /** 优先使用的推理接入点 ID 列表，最多 10 个，优先级高于 prefer_models */
  prefer_endpoints?: string[]
  /** 手动模式相关参数 */
  manual_option?: VideoUnderstandManualOption
  /** 用户请求凭证，用于幂等控制 */
  client_token?: string
  /** 自定义回调参数，任务完成时原样返回 */
  callback_args?: string
  /** 任务结果回调 URL */
  callback_url?: string
  /** 任务提交的目标队列 ID */
  queue_id?: string
}

/** Token 使用量统计 */
export interface VideoUnderstandTokenUsage {
  /** 输入 Token 数量 */
  input_tokens: number
  /** 输出 Token 数量 */
  output_tokens: number
  /** 总 Token 数量 */
  total_tokens: number
}

/** 视频理解任务完成后的结果 */
export interface VideoUnderstandResult {
  /** 输入视频总时长（秒） */
  duration: number
  /** 视频内容分析结果列表，每一项对应 video_urls 中同索引视频的分析结果文本 */
  contents: string[]
  /** 大模型推理过程中的 Token 使用量统计 */
  token_usage: VideoUnderstandTokenUsage
}

/* ── Functions ── */

/**
 * 提交视频理解任务。
 *
 * 基于视觉大模型，对输入的视频 URL 列表进行通用视频内容分析，
 * 输出视频级别的结构化理解结果，适用于内容审核、视频检索、标签生成等场景。
 *
 * @param http   - HttpClient 实例
 * @param params - 视频理解参数
 */
export async function videoUnderstand(
  http: HttpClient,
  params: VideoUnderstandParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/video-understand-router',
    params,
  )
  return toDomain(res)
}

/**
 * 提交视频理解任务并等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 视频理解参数
 * @param pollOptions - 轮询配置
 */
export async function videoUnderstandAndWait(
  http: HttpClient,
  params: VideoUnderstandParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<VideoUnderstandResult>> {
  const { task_id } = await videoUnderstand(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<VideoUnderstandResult>
  >
}
