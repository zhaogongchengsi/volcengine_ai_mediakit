import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 高光智剪-短剧 ── */

export interface TemplateEdit {
  /** 视觉模板名称：热门短剧1~5 */
  template?: string
  /** 短剧名称，≤22 字符 */
  title?: string
  /** 提示语，≤20 字符 */
  hint?: string
}

export interface EditParam {
  /** BasicEdit（基础剪辑）/ TemplateEdit（模板剪辑） */
  mode?: string
  /** 模板剪辑参数 */
  template_edit?: TemplateEdit
}

export interface UserPreferredSegment {
  /** 剧集索引 */
  episode?: number
  /** 起始时间（秒） */
  start_time?: number
  /** 结束时间（秒） */
  end_time?: number
}

export interface HighlightCutsParam {
  /** 是否返回分镜信息，默认 false */
  enable_storyboard?: boolean
  /** 最短时长（秒），默认 30 */
  min_duration?: number
  /** 最长时长（秒），默认 180 */
  max_duration?: number
  /** 最大片段数，默认 6 */
  max_number?: number
  /** Mixed（混剪，默认）/ Sequential（顺剪） */
  cut_mode?: 'Mixed' | 'Sequential'
  /** 高光片段提示词 */
  highlight_segment_prompt?: string
  /** 开场提示词 */
  highlight_start_prompt?: string
  /** 结尾提示词 */
  highlight_ending_prompt?: string
  /** 用户偏好片段列表 */
  user_preferred_segments?: UserPreferredSegment[]
}

export interface OpeningHookParam {
  /** 是否启用开场钩子，默认 true */
  enable_opening_hook?: boolean
  /** 最短总时长（秒），默认 5 */
  min_duration?: number
  /** 最大总时长（秒），默认 15 */
  max_duration?: number
  /** 单片段最短时长（秒），默认 5 */
  min_clip_duration?: number
  /** 最低评分 [1, 5]，默认 3 */
  min_score?: number
  /** 开场钩子提示词 */
  opening_hook_prompt?: string
}

export interface GenerateHighlightsMicrodramaParams {
  /** 短剧原片视频 URL 列表，最多 30 个，累计 ≤45 分钟，最高 1080p */
  video_urls: string[]
  /** 固定 StorylineCuts（故事线混剪模式） */
  mode: string
  /** 是否生成混剪视频，默认 true */
  enable_generate_video?: boolean
  /** 是否返回封面图 URL，默认 false */
  enable_return_poster?: boolean
  /** 剪辑配置 */
  edit_param?: EditParam
  /** 高光智剪配置 */
  highlight_cuts_param?: HighlightCutsParam
  /** 开场钩子配置 */
  opening_hook_param?: OpeningHookParam
  /** 结尾选取模式：ReuseMainEnding（默认）/ SmartSelect */
  video_ending_mode?: 'ReuseMainEnding' | 'SmartSelect'
  /** 是否返回标签，默认 false */
  enable_segment_tag?: boolean
}

export interface MixvideoClip {
  /** HighlightClip / OpeningHook */
  clip_type: string
  /** 评分 [1, 5] */
  score: number
  /** 源视频索引 */
  source_video_index: number
  /** 源视频起始时间（秒） */
  source_start_time: number
  /** 源视频结束时间（秒） */
  source_end_time: number
  /** 混剪视频起始时间（秒） */
  cut_start_time: number
  /** 混剪视频结束时间（秒） */
  cut_end_time: number
  /** 标签列表 */
  tags?: string[]
}

export interface MixvideoInfo {
  /** 混剪视频索引 */
  mixvideo_index: number
  /** 时长（秒） */
  duration: number
  /** 文件大小（字节） */
  size: number
  /** 封面图 URL */
  poster_url?: string
  /** 视频地址 */
  video_url: string
  /** 片段列表 */
  clips: MixvideoClip[]
}

export interface StoryboardInfo {
  /** 源视频索引 */
  source_video_index: number
  /** 起始时间（秒） */
  start_time: number
  /** 结束时间（秒） */
  end_time: number
  /** 评分 [1, 5] */
  score: number
  /** 画面字幕文本 */
  ocr: string
  /** 画面描述 */
  description: string
  /** 标签列表 */
  tags?: string[]
}

export interface GenerateHighlightsMicrodramaResult {
  /** 输入视频总时长（秒） */
  duration: number
  /** 混剪视频地址列表 */
  video_urls: string[]
  /** 混剪视频详情列表 */
  mixvideo_info: MixvideoInfo[]
  /** 分镜信息列表 */
  storyboard_info?: StoryboardInfo[]
}

export async function generateHighlightsMicrodrama(
  http: HttpClient,
  params: GenerateHighlightsMicrodramaParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/generate-highlights-microdrama',
    params,
  )
  return toDomain(res)
}

export async function generateHighlightsMicrodramaAndWait(
  http: HttpClient,
  params: GenerateHighlightsMicrodramaParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<GenerateHighlightsMicrodramaResult>> {
  const { task_id } = await generateHighlightsMicrodrama(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<GenerateHighlightsMicrodramaResult>
  >
}

/* ── 高光智剪-小游戏 ── */

export interface MinigameInfo {
  /** 游戏名称 */
  name?: string
  /** 玩法描述 */
  play_definition?: string
  /** 高光定义 */
  highlight_definition?: string
}

export interface GenerateHighlightsMinigameParams {
  /** 小游戏视频 URL 列表，当前仅支持单个视频，时长 ≤10 分钟 */
  video_urls: string[]
  /** 固定 HighlightExtract */
  mode: string
  /** 小游戏描述信息 */
  minigame_info?: MinigameInfo
  /** 是否生成混剪视频，默认 true */
  enable_generate_video?: boolean
}

export interface MinigameMixvideoInfo {
  /** 混剪视频索引 */
  mixvideo_index: number
  /** 视频地址 */
  video_url: string
  /** 片段列表 */
  clips: MixvideoClip[]
}

export interface GenerateHighlightsMinigameResult {
  /** 输入视频总时长（秒） */
  duration: number
  /** 混剪视频地址列表 */
  video_urls?: string[]
  /** 混剪视频信息列表 */
  mixvideo_info: MinigameMixvideoInfo[]
}

export async function generateHighlightsMinigame(
  http: HttpClient,
  params: GenerateHighlightsMinigameParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/generate-highlights-minigame',
    params,
  )
  return toDomain(res)
}

export async function generateHighlightsMinigameAndWait(
  http: HttpClient,
  params: GenerateHighlightsMinigameParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<GenerateHighlightsMinigameResult>> {
  const { task_id } = await generateHighlightsMinigame(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<GenerateHighlightsMinigameResult>
  >
}

/* ── 高光智剪-影视拆条 ── */

export interface MovieHighlightCutsParam {
  /** 单段最短时长（秒），默认 90，范围 [1, 600] */
  min_duration?: number
  /** 单段最大时长（秒），默认 180，范围 [1, 600] */
  max_duration?: number
  /** 是否输出详细分镜信息，默认 false */
  enable_detailed_info?: boolean
}

export interface MovieOpeningHookParam {
  /** 是否启用高光前置，默认 true */
  is_enabled?: boolean
  /** 最短总时长（秒），范围 [0, 60]，默认 5 */
  min_duration?: number
  /** 最大总时长（秒），范围 [0, 60]，默认 15 */
  max_duration?: number
  /** 单片段最短时长（秒），范围 [0, 60]，默认 5 */
  min_clip_duration?: number
  /** 最低评分 [0, 5]，默认 4 */
  min_score?: number
}

export interface GenerateHighlightsMovieParams {
  /** 影视视频源 URL。仅支持单个视频，时长 ≤180 分钟，最高 1080p */
  video_url: string
  /** 是否生成拆条视频文件，默认 true */
  enable_generate_video?: boolean
  /** 拆条片段配置 */
  highlight_cuts_param?: MovieHighlightCutsParam
  /** 高光前置开场配置 */
  opening_hook_param?: MovieOpeningHookParam
}

export interface MovieClip {
  /** OpeningHook / HighlightClip */
  type: string
  /** 评分 [1, 5] */
  score: number
  /** 原始视频起始时间（秒） */
  source_start_time: number
  /** 原始视频结束时间（秒） */
  source_end_time: number
  /** 拆条视频起始时间（秒） */
  cut_start_time: number
  /** 拆条视频结束时间（秒） */
  cut_end_time: number
}

export interface ResultCutInfo {
  /** 片段标题 */
  title: string
  /** 实际时长（秒） */
  duration: number
  /** 文件大小（字节） */
  size: number
  /** 视频下载 URL */
  video_url: string
  /** 原始片段信息列表（仅 enable_detailed_info=true） */
  clips?: MovieClip[]
}

export interface GenerateHighlightsMovieResult {
  /** 输入视频总时长（秒） */
  input_duration: number
  /** 拆条视频地址列表 */
  video_urls: string[]
  /** 拆条片段详情列表 */
  result_cuts_info: ResultCutInfo[]
}

export async function generateHighlightsMovie(
  http: HttpClient,
  params: GenerateHighlightsMovieParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/generate-highlights-movie',
    params,
  )
  return toDomain(res)
}

export async function generateHighlightsMovieAndWait(
  http: HttpClient,
  params: GenerateHighlightsMovieParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<GenerateHighlightsMovieResult>> {
  const { task_id } = await generateHighlightsMovie(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<GenerateHighlightsMovieResult>
  >
}

/* ── 高光片段提取 ── */

export interface AnalyzeVideoHighlightsParams {
  /** 视频 URL 列表 */
  video_urls: string[]
  /** 分析模型：Miniseries（短剧）/ Game（小游戏） */
  model: 'Miniseries' | 'Game'
  /** 高光提取模式。Miniseries 须为 StorylineCuts；Game 须为 HighlightExtract */
  mode: string
  /** 仅 model=Game 时可选 */
  minigame_info?: MinigameInfo
}

export interface HighlightInfo {
  /** 源视频索引 */
  source_video_index: number
  /** 起始时间（秒） */
  start_time: number
  /** 结束时间（秒） */
  end_time: number
  /** 评分 [1, 5] */
  score: number
  /** 画面字幕文本 */
  ocr: string
  /** 画面描述 */
  description: string
}

export interface AnalyzeVideoHighlightsResult {
  /** 输入视频总时长（秒） */
  duration: number
  /** 高光片段列表 */
  highlight_info: HighlightInfo[]
}

export async function analyzeVideoHighlights(
  http: HttpClient,
  params: AnalyzeVideoHighlightsParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/analyze-video-highlights',
    params,
  )
  return toDomain(res)
}

export async function analyzeVideoHighlightsAndWait(
  http: HttpClient,
  params: AnalyzeVideoHighlightsParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<AnalyzeVideoHighlightsResult>> {
  const { task_id } = await analyzeVideoHighlights(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<AnalyzeVideoHighlightsResult>
  >
}
