import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 解说视频生成 ── */

/**
 * AI 解说词配置
 *
 * 控制 AI 自动生成的解说词风格、长度和朗读节奏。
 * 与自定义解说词（recap_text）互斥：使用 auto_generate_recap 时不应同时提供 recap_text。
 */
export interface DramaRecapConfig {
  /** 是否由 AI 自动生成解说词，默认 false（使用自定义文案） */
  auto_generate_recap?: boolean
  /** AI 生成解说词的风格描述，如 "悬疑风格，层层递进，结尾留下巨大悬念" */
  style?: string
  /** AI 生成解说词的期望字符数，不超过 5000 */
  text_length?: number
  /** 配音语速，范围 [0.5, 2.0]，默认 1.0。推荐短视频设为 1.1 ~ 1.2 */
  text_speed?: number
  /** 句间停顿时长（毫秒），默认 120。值越大节奏越舒缓 */
  pause_time?: number
}

/** AI 配音音色配置 */
export interface SpeakerConfig {
  /**
   * 配音音色代码，可选值包括：
   * 男声：Yunfeng（自信激昂）、Yunjian（深沉休闲）、Yunze（沉稳正式）、
   *       Yunye（成熟放松）、Yunxi（活泼阳光）、Yunyi（温柔亲切）、Yunjie（自信干练）
   * 女声：Xiaoxiao（活泼温暖）、Xiaochen（休闲自然）、Xiaohan（温暖甜美）、Xiaomo（清晰放松）
   */
  voice_type?: string
}

/** 解说字幕样式配置 */
export interface SubtitleConfig {
  /** 是否禁用字幕，默认 false */
  disable_subtitle?: boolean
  /** 字号 */
  font_size?: number
  /** 字体颜色，格式 #RRGGBBAA */
  font_color?: string
  /** 描边颜色，格式 #RRGGBBAA */
  border_color?: string
  /** 描边宽度 */
  border_width?: number
  /** 对齐方式 */
  align_type?: number
}

/** 短剧三要素（竖屏视觉包装）配置 */
export interface MiniseriesEdit {
  /** 视觉模板名称，如 "热门短剧2" */
  template?: string
  /** 剧名 */
  title?: string
  /** 提示语，如 "点击下方看完整版" */
  hint?: string
}

/**
 * 解说视频生成任务请求参数
 *
 * 基于剧本还原结果，一键生成带 AI 配音和定制字幕的解说视频。
 * 需要先完成剧本还原（drama-script）获取 drama_script_task_id。
 *
 * 使用限制：
 * - 解说词长度：recap_text 或 text_length 不超过 5000 字符
 * - 批量生成：通过 batch_count 控制，最多一次生成多个版本
 */
export interface DramaRecapParams {
  /** 剧本还原任务 ID（由 drama-script 任务完成后返回） */
  drama_script_task_id: string
  /** 是否擦除原视频字幕，默认 false */
  erase_subtitle?: boolean
  /** 擦除模式，仅支持 standard（标准版） */
  erase_mode?: 'standard'
  /**
   * 自定义解说词，与 AI 自动生成互斥
   * 不超过 5000 字符，使用时建议将 auto_generate_recap 设为 false
   */
  recap_text?: string
  /** 批量生成数量，默认 1。基于同一次剧本还原结果生成多个版本 */
  batch_count?: number
  /** AI 解说词配置（自动生成时使用） */
  drama_recap_config?: DramaRecapConfig
  /** 配音音色配置 */
  speaker_config?: SpeakerConfig
  /** 字幕样式配置 */
  subtitle_config?: SubtitleConfig
  /** 短剧三要素配置（竖屏视频的视觉包装） */
  miniseries_edit?: MiniseriesEdit
}

/** 解说视频生成任务完成后的结果 */
export interface DramaRecapResult {
  /** 解说视频下载地址 */
  video_url: string
  /** 批量生成的视频下载地址列表 */
  video_urls: string[]
  /** 视频时长（秒） */
  duration: number
  /** 总产出数量 */
  total_count: number
  /** 成功数量 */
  success_count: number
  /** 失败数量 */
  failed_count: number
  /** 错误信息 */
  error: Record<string, unknown>
}

/* ── 工具函数 ── */

/**
 * 提交解说视频生成任务。
 *
 * 调用 POST /api/v1/tools/drama-recap。
 * 需要先完成剧本还原，获取 drama_script_task_id。
 *
 * @param http   - HttpClient 实例
 * @param params - 解说视频生成参数，drama_script_task_id 必填
 * @returns 任务提交响应，包含 task_id
 */
export async function dramaRecap(
  http: HttpClient,
  params: DramaRecapParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/drama-recap',
    params,
  )
  return toDomain(res)
}

/**
 * 提交解说视频生成任务并轮询等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 解说视频生成参数
 * @param pollOptions - 轮询配置
 * @returns 完成后的任务结果，result 包含生成的解说视频信息
 */
export async function dramaRecapAndWait(
  http: HttpClient,
  params: DramaRecapParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<DramaRecapResult>> {
  const { task_id } = await dramaRecap(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<DramaRecapResult>
  >
}
