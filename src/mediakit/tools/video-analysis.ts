import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 场景切分 ── */

export interface SegmentScenesParams {
  /** 待处理视频 URL，视频时长 ≤2 小时 */
  video_url: string
  /** 场景切分敏感度阈值 [0, 100)，越低越敏感（切片越多） */
  segment_threshold?: number
  /** 单个切片最小时长（秒），默认 3 */
  min_duration?: number
  /** 单个切片最大时长（秒），默认 30 */
  max_duration?: number
  /** 是否将淡入/淡出片段作为独立切片输出，默认 false */
  enable_clip_fade?: boolean
}

export interface SceneSegment {
  /** 起始时间（秒） */
  start_time: number
  /** 结束时间（秒） */
  end_time: number
  /** 切片视频地址（MP4），24 小时有效 */
  segment_video_url: string
}

export interface SegmentScenesResult {
  /** 输入视频总时长（秒） */
  duration: number
  /** 切片信息列表 */
  segments: SceneSegment[]
}

export async function segmentScenes(
  http: HttpClient,
  params: SegmentScenesParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/segment-scenes',
    params,
  )
  return toDomain(res)
}

export async function segmentScenesAndWait(
  http: HttpClient,
  params: SegmentScenesParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<SegmentScenesResult>> {
  const { task_id } = await segmentScenes(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<SegmentScenesResult>
  >
}

/* ── 语音转字幕（ASR） ── */

export interface AsrSubtitlesParams {
  /** 待处理视频 URL，与 audio_url 二选一，都有时优先 video_url */
  video_url?: string
  /** 待处理音频 URL，与 video_url 二选一 */
  audio_url?: string
  /** 识别内容类型，留空自动探测：speech（普通说话）/ singing（唱歌） */
  content_type?: 'speech' | 'singing'
  /** 识别语种，留空自动探测：cmn-Hans-CN（简体中文）/ eng-US（英语） */
  language?: 'cmn-Hans-CN' | 'eng-US'
  /** 是否开启说话人识别，默认 false */
  enable_speaker_info?: boolean
  /** 是否返回置信度，默认 false */
  enable_confidence?: boolean
}

export interface SubtitleItem {
  /** 字幕文本 */
  subtitle_text: string
  /** 起始时间（秒） */
  start_time: number
  /** 结束时间（秒） */
  end_time: number
  /** 说话人标识（仅 enable_speaker_info=true 时返回） */
  speaker?: string
  /** 置信度 [0, 1]（仅 enable_confidence=true 时返回） */
  confidence?: number
}

export interface AsrSubtitlesResult {
  /** 输入音视频总时长（秒） */
  duration: number
  /** 字幕片段列表 */
  subtitles: SubtitleItem[]
}

export async function asrSubtitles(
  http: HttpClient,
  params: AsrSubtitlesParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/asr-subtitles',
    params,
  )
  return toDomain(res)
}

export async function asrSubtitlesAndWait(
  http: HttpClient,
  params: AsrSubtitlesParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<AsrSubtitlesResult>> {
  const { task_id } = await asrSubtitles(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<AsrSubtitlesResult>
  >
}

/* ── 视频识别字幕（OCR） ── */

export interface VideoOcrParams {
  /** 待识别视频 URL。时长 ≤10 分钟，分辨率 240p~4K */
  video_url: string
  /** 工作模式：Subtitle（默认，仅识别字幕）/ Detailed（识别字幕+水印+台标+标题等） */
  mode?: 'Subtitle' | 'Detailed'
}

export interface VideoOcrTextLocation {
  /** 左上角 X 坐标（px） */
  top_left_x: number
  /** 左上角 Y 坐标（px） */
  top_left_y: number
  /** 右下角 X 坐标（px） */
  bottom_right_x: number
  /** 右下角 Y 坐标（px） */
  bottom_right_y: number
}

export interface VideoOcrSubtitleItem {
  /** 字幕文本 */
  subtitle_text: string
  /** 起始时间（秒） */
  start_time: number
  /** 结束时间（秒） */
  end_time: number
  /** 文本标签（仅 Detailed 模式）：Subtitle / Others */
  text_label?: string
  /** 文本像素坐标（仅 Detailed 模式） */
  text_location?: VideoOcrTextLocation
}

export interface VideoOcrResult {
  /** 输入视频总时长（秒） */
  duration: number
  /** 字幕片段列表 */
  subtitles: VideoOcrSubtitleItem[]
}

export async function videoOcr(
  http: HttpClient,
  params: VideoOcrParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/video-ocr',
    params,
  )
  return toDomain(res)
}

export async function videoOcrAndWait(
  http: HttpClient,
  params: VideoOcrParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<VideoOcrResult>> {
  const { task_id } = await videoOcr(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<VideoOcrResult>
  >
}

/* ── 剧情故事线分析 ── */

export interface AnalyzeVideoStorylineParams {
  /** 视频 URL 列表，最多 30 个，累计 ≤210 分钟，最高 1080p */
  video_urls: string[]
  /** 是否为每个剧情片段生成关键帧快照，默认 false */
  enable_snapshot?: boolean
}

export interface SourceVideoInfo {
  /** 片源索引，从 0 开始 */
  source_video_index: number
  /** 片源原始 URL */
  source_video_url: string
  /** 视频标题 */
  source_video_title: string
  /** 视频简介 */
  source_video_summary: string
  /** 视频标签列表 */
  source_video_tag: string[]
}

export interface StorylineClip {
  /** 片段唯一索引，从 0 开始 */
  clip_index: number
  /** 来源视频索引 */
  source_video_index: number
  /** 片段标题 */
  clip_title: string
  /** 片段简介 */
  clip_summary: string
  /** 主要对话文本 */
  clip_dialogue: string
  /** 高光打分 [1, 5] */
  clip_score: number
  /** 源视频中的开始时间（秒） */
  clip_start_time: number
  /** 源视频中的结束时间（秒） */
  clip_end_time: number
  /** 关键帧快照 URL（仅 enable_snapshot=true） */
  clip_snapshot_url?: string
}

export interface StorylineHighlight {
  /** 高光故事线索引，从 0 开始 */
  highlight_index: number
  /** 高光故事线标题 */
  highlight_title: string
  /** 高光故事线简介 */
  highlight_summary: string
  /** 组成该故事线的剧情片段索引列表 */
  highlight_clips_index: number[]
}

export interface AnalyzeVideoStorylineResult {
  /** 输入视频总时长（秒） */
  duration: number
  /** 输入源视频分析结果列表 */
  source_video_info: SourceVideoInfo[]
  /** 剧情片段信息数组 */
  storyline_clips: StorylineClip[]
  /** 故事线结果数组 */
  storyline_highlights: StorylineHighlight[]
}

export async function analyzeVideoStoryline(
  http: HttpClient,
  params: AnalyzeVideoStorylineParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/analyze-video-storyline',
    params,
  )
  return toDomain(res)
}

export async function analyzeVideoStorylineAndWait(
  http: HttpClient,
  params: AnalyzeVideoStorylineParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<AnalyzeVideoStorylineResult>> {
  const { task_id } = await analyzeVideoStoryline(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<AnalyzeVideoStorylineResult>
  >
}
