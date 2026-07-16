import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── Types ── */

/** 解说模式 */
export type DramaRecapVerticalMode = 'text' | 'narrate'

/** 精彩片段前置策略 */
export type OpeningHookMode = 'auto' | 'force' | 'disable'

/** 旁白解说配置 */
export interface NarrateOptions {
  /** 解说浓度，范围 [0, 1]，建议 0.3 ~ 0.5 */
  narrate_ratio?: number
  /** 是否添加背景音乐，默认 true */
  enable_narrate_bgm?: boolean
}

/** 文字解说样式配置 */
export interface TextOptions {
  /** 字体 */
  font_type?: string
  /** 字号 */
  font_size?: number
  /** 字体颜色，格式 #RRGGBBAA */
  font_color?: string
  /** 描边宽度 */
  border_width?: number
  /** 描边颜色，格式 #RRGGBBAA */
  border_color?: string
  /** 阴影颜色 */
  shadow_color?: string
  /** 是否加粗 */
  is_bold?: boolean
  /** 是否斜体 */
  is_italic?: boolean
}

/** 模板编辑配置 */
export interface TemplateEdit {
  /** 视觉模板名称 */
  template?: string
  /** 剧名 */
  title?: string
  /** 提示语 */
  hint?: string
}

/** 剪辑参数 */
export interface EditParam {
  /** 编辑模式 */
  mode?: string
  /** 模板编辑配置 */
  template_edit?: TemplateEdit
}

/** 解说视频生成（短剧行业模型）任务请求参数 */
export interface DramaRecapVerticalParams {
  /** 待处理视频的公网 URL 列表，支持 1 ~ 30 个 */
  video_urls: string[]
  /** 解说模式：text（文字解说）或 narrate（旁白解说） */
  mode: DramaRecapVerticalMode
  /** 期望生成的视频数量上限，默认 3，范围 [1, 100] */
  max_count?: number
  /** 单个视频最小时长（秒），默认 30 */
  min_duration?: number
  /** 单个视频最大时长（秒），默认 180 */
  max_duration?: number
  /** 精彩片段前置策略，默认 auto */
  opening_hook?: OpeningHookMode
  /** 旁白解说配置（mode 为 narrate 时生效） */
  narrate_options?: NarrateOptions
  /** 自定义背景音乐 URL */
  narrate_bgm_url?: string
  /** 文字解说样式配置（mode 为 text 时生效） */
  text_options?: TextOptions
  /** 剪辑参数（短剧三要素等） */
  edit_param?: EditParam
}

/** 单个输出视频信息 */
export interface VideoInfo {
  duration: number
  size: number
  poster_url: string
  video_url: string
}

/** 解说视频生成（短剧行业模型）任务完成后的结果 */
export interface DramaRecapVerticalResult {
  /** 输入视频总时长（秒） */
  input_duration: number
  /** 输出视频总时长（秒） */
  output_duration: number
  /** 解说模式 */
  mode: string
  /** 生成的视频下载地址列表 */
  video_urls: string[]
  /** 生成的视频详细信息列表 */
  video_infos: VideoInfo[]
}

/* ── Functions ── */

/**
 * 提交解说视频生成（短剧行业模型）任务。
 *
 * @param http   - HttpClient 实例
 * @param params - 解说视频生成参数
 */
export async function dramaRecapVertical(
  http: HttpClient,
  params: DramaRecapVerticalParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/drama-recap-vertical',
    params,
  )
  return toDomain(res)
}

/**
 * 提交解说视频生成（短剧行业模型）任务并等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 解说视频生成参数
 * @param pollOptions - 轮询配置
 */
export async function dramaRecapVerticalAndWait(
  http: HttpClient,
  params: DramaRecapVerticalParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<DramaRecapVerticalResult>> {
  const { task_id } = await dramaRecapVertical(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<DramaRecapVerticalResult>
  >
}
