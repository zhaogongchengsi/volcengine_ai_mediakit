import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── Types ── */

/** AI 解说词配置 */
export interface DramaRecapConfig {
  /** 是否由 AI 自动生成解说词 */
  auto_generate_recap?: boolean
  /** AI 生成解说词的风格描述 */
  style?: string
  /** AI 生成解说词的期望字符数 */
  text_length?: number
  /** 配音语速，范围 [0.5, 2.0]，默认 1.0 */
  text_speed?: number
  /** 句间停顿时长（毫秒），默认 120 */
  pause_time?: number
}

/** AI 配音配置 */
export interface SpeakerConfig {
  /** 配音音色代码 */
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

/** 短剧三要素配置 */
export interface MiniseriesEdit {
  /** 视觉模板名称 */
  template?: string
  /** 剧名 */
  title?: string
  /** 提示语 */
  hint?: string
}

/** 解说视频生成任务请求参数 */
export interface DramaRecapParams {
  /** 剧本还原任务 ID */
  drama_script_task_id: string
  /** 是否擦除原视频字幕，默认 false */
  erase_subtitle?: boolean
  /** 擦除模式 */
  erase_mode?: 'standard'
  /** 自定义解说词（与 AI 生成互斥），不超过 5000 字符 */
  recap_text?: string
  /** 批量生成数量，默认 1 */
  batch_count?: number
  /** AI 解说词配置 */
  drama_recap_config?: DramaRecapConfig
  /** 配音配置 */
  speaker_config?: SpeakerConfig
  /** 字幕样式配置 */
  subtitle_config?: SubtitleConfig
  /** 短剧三要素配置 */
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

/* ── Functions ── */

/**
 * 提交解说视频生成任务。
 *
 * @param http   - HttpClient 实例
 * @param params - 解说视频生成参数
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
 * 提交解说视频生成任务并等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 解说视频生成参数
 * @param pollOptions - 轮询配置
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
