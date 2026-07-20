import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 智能剪辑 Vibe Editing ── */

export interface VibeEditingContentItem {
  /** 内容类型：text / image_url / video_url / audio_url / subtitle_url */
  type: string
  /** 文本指令（仅 type=text） */
  text?: string
  /** 图片素材 URL 对象 */
  image_url?: { url: string }
  /** 视频素材 URL 对象 */
  video_url?: { url: string }
  /** 音频素材 URL 对象 */
  audio_url?: { url: string }
  /** 字幕素材 URL 对象 */
  subtitle_url?: { url: string }
}

export interface VibeEditingOutputMeta {
  /** AIGC 标识 JSON 字符串 */
  aigc?: string
}

export interface VibeEditingOutput {
  /** 输出类型：video（默认）/ audio */
  type?: 'video' | 'audio'
  /** 视频分辨率 */
  resolution?: string
  /** 封装格式：mp4（视频）/ mp3（音频） */
  format?: string
  /** 视频帧率 [15, 60]，默认 25 */
  fps?: number
  /** 输出元信息 */
  meta?: VibeEditingOutputMeta
}

export interface VibeEditingParams {
  /** 输入内容列表，支持多模态混排，至少 1 项 */
  content: VibeEditingContentItem[]
  /** 输出配置 */
  output?: VibeEditingOutput
}

export interface VibeEditingArtifact {
  /** 合成操作类型，当前固定 synthesize */
  operation: string
  /** 产物类型：video / audio */
  type: string
  /** 产物下载 URL，有效期 24 小时 */
  url: string
  /** 产物时长（秒） */
  duration: number
  /** 产物描述 */
  description: string
}

export interface VibeEditingResult {
  /** 输出产物列表 */
  artifacts: VibeEditingArtifact[]
}

export async function vibeEditing(
  http: HttpClient,
  params: VibeEditingParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/vibe-editing',
    params,
  )
  return toDomain(res)
}

export async function vibeEditingAndWait(
  http: HttpClient,
  params: VibeEditingParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<VibeEditingResult>> {
  const { task_id } = await vibeEditing(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<VibeEditingResult>
  >
}
