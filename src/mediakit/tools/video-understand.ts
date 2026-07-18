import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 视频理解（高光片段提取） ── */

/**
 * 分析档位
 * - Economy: 经济档位，速度优先，适合大批量、对详细程度要求较低的内容标注
 * - Balanced: 均衡档位，速度与质量兼顾，适合常规内容审核与检索
 * - Quality: 质量档位，结果优先，适合需要更精细语义理解的场景
 */
export type UnderstandLevel = 'Economy' | 'Balanced' | 'Quality'

/** 手动模式参数（覆盖 level 档位策略） */
export interface VideoUnderstandManualOption {
  /**
   * 最大截图帧数，取值范围 [0, 1000]，默认 0
   * 设为 0 时由 level 档位决定截图数量；显式设置会覆盖档位策略
   */
  max_snapshot_number?: number
  /**
   * 是否需要识别音频，默认 false
   * - true: 强制开启音频分析，系统选用支持音视频多模态的模型
   * - false: 仅分析视频画面
   * 注意：即使为 false，如果 prompt 中包含音频相关关键词，系统可能自动触发音频分析
   */
  need_audio?: boolean
}

/**
 * 视频理解任务请求参数
 *
 * 基于火山方舟视觉大模型，对输入的视频列表进行通用内容分析，
 * 输出视频级别的结构化理解结果，适用于内容审核、视频检索、标签生成等场景。
 *
 * 使用限制：
 * - 视频列表：最多 10 个视频 URL
 * - 视频格式：mp4、flv、ts、avi、mov、wmv、mkv 等主流格式
 * - 单视频时长：不超过 2 小时
 * - 输入协议：支持 HTTP/HTTPS、mediakit://、vod://、tos://
 * - client_token：不超过 64 个 ASCII 可打印字符（幂等控制）
 * - callback_args：不超过 512 字节
 * - prefer_models：最多 10 个模型 ID
 * - prefer_endpoints：最多 10 个推理接入点 ID，优先级高于 prefer_models
 */
export interface VideoUnderstandParams {
  /**
   * 待处理的视频 URL 列表，最多 10 个
   * 单个视频时长不超过 2 小时
   */
  video_urls: string[]
  /**
   * 提示词，用于指导大模型对视频内容进行分析的自然语言描述
   * 最小长度 1，如 "请总结视频中的关键事件，并标注每个事件出现的时间段"
   */
  prompt: string
  /** 分析档位，默认 Economy。控制默认抽帧策略与模型选择 */
  level?: UnderstandLevel
  /** 优先使用的模型 ID（Model ID）列表，最多 10 个 */
  prefer_models?: string[]
  /**
   * 优先使用的推理接入点 ID（Endpoint ID）列表，最多 10 个
   * 优先级高于 prefer_models
   */
  prefer_endpoints?: string[]
  /** 手动模式相关参数，未传时使用 level 档位策略 */
  manual_option?: VideoUnderstandManualOption
  /**
   * 用户请求凭证，用于幂等控制
   * 大小写敏感，不超过 64 个 ASCII 可打印字符
   */
  client_token?: string
  /**
   * 自定义回调参数，任务完成时通过事件回调原样返回
   * 字段长度最大为 512 字节
   */
  callback_args?: string
  /**
   * 任务结果回调 URL
   * 地址必须以 http:// 或 https:// 开头，优先级高于控制台全局回调地址
   */
  callback_url?: string
  /** 任务提交的目标队列 ID，不传则使用系统默认队列 */
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
  /** 输入视频总时长（秒），所有视频时长的总和 */
  duration: number
  /**
   * 视频内容分析结果列表
   * 每一项对应 video_urls 中同索引视频的分析结果文本
   */
  contents: string[]
  /** 大模型推理过程中的 Token 使用量统计 */
  token_usage: VideoUnderstandTokenUsage
}

/* ── 工具函数 ── */

/**
 * 提交视频理解任务。
 *
 * 调用 POST /api/v1/tools/video-understand-router。
 * 基于视觉大模型，对输入的视频 URL 列表进行通用视频内容分析，
 * 输出视频级别的结构化理解结果，适用于内容审核、视频检索、标签生成等场景。
 *
 * @param http   - HttpClient 实例
 * @param params - 视频理解参数，video_urls 和 prompt 必填
 * @returns 任务提交响应，包含 task_id
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
 * 提交视频理解任务并轮询等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 视频理解参数
 * @param pollOptions - 轮询配置
 * @returns 完成后的任务结果，result 包含分析内容列表和 Token 统计
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
