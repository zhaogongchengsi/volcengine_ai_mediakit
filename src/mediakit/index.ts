/* ── 音频工具（audio-tools）型导入 ── */
import type {
  DetectVoiceActivityParams,
  DetectVoiceActivityResult,
  ProbeAudioMetadataParams,
  ProbeAudioMetadataResult,
  SeparateVoiceParams,
  SeparateVoiceResult,
  TranscodeAudioParams,
  TranscodeAudioResult,
} from './tools/audio-tools.js'
import type {
  DramaRecapVerticalParams,
  DramaRecapVerticalResult,
} from './tools/drama-recap-vertical.js'
import type {
  DramaRecapParams,
  DramaRecapResult,
} from './tools/drama-recap.js'
import type {
  DramaScriptParams,
  DramaScriptResult,
} from './tools/drama-script.js'
/* ── 编辑类（edit-basic）型导入 ── */
import type {
  AdjustAudioSpeedParams,
  AdjustAudioSpeedResult,
  AdjustVideoSpeedParams,
  AdjustVideoSpeedResult,
  ConcatAudioParams,
  ConcatAudioResult,
  ConcatVideoParams,
  ConcatVideoResult,
  ExtractAudioParams,
  ExtractAudioResult,
  FadeAudioParams,
  FadeAudioResult,
  ImageToVideoParams,
  ImageToVideoResult,
  MixAudioParams,
  MixAudioResult,
  MuxAudioVideoParams,
  MuxAudioVideoResult,
  TrimAudioParams,
  TrimAudioResult,
  TrimVideoParams,
  TrimVideoResult,
} from './tools/edit-basic.js'
/* ── 变换类（edit-transform）型导入 ── */
import type {
  AddImageToVideoParams,
  AddImageToVideoResult,
  AddSubtitleToVideoParams,
  AddSubtitleToVideoResult,
  ApplyVideoFilterParams,
  ApplyVideoFilterResult,
  CropVideoParams,
  CropVideoResult,
  ExtractAnimatedImageParams,
  ExtractAnimatedImageResult,
  FlipVideoParams,
  FlipVideoResult,
  GaussianBlurVideoParams,
  GaussianBlurVideoResult,
  RotateVideoParams,
  RotateVideoResult,
  StitchVideoParams,
  StitchVideoResult,
} from './tools/edit-transform.js'

import type {
  EnhanceVideoParams,
  EnhanceVideoResult,
} from './tools/enhance-video.js'

import type {
  EraseVideoSubtitleParams,
  EraseVideoSubtitleResult,
} from './tools/erase-video-subtitle.js'

/* ── 文字滚屏视频型导入 ── */
import type {
  TextToScrollingVideoParams,
  TextToScrollingVideoResult,
} from './tools/text-to-scrolling-video.js'

/* ── Vibe Editing 型导入 ── */
import type {
  VibeEditingParams,
  VibeEditingResult,
} from './tools/vibe-editing.js'

/* ── 视频分析（video-analysis）型导入 ── */
import type {
  AnalyzeVideoStorylineParams,
  AnalyzeVideoStorylineResult,
  AsrSubtitlesParams,
  AsrSubtitlesResult,
  SegmentScenesParams,
  SegmentScenesResult,
  VideoOcrParams,
  VideoOcrResult,
} from './tools/video-analysis.js'

/* ── 画质增强（video-enhance）型导入 ── */
import type {
  EnhanceVideoGenerativeParams,
  EnhanceVideoGenerativeResult,
} from './tools/video-enhance.js'

/* ── 高光亮片（video-highlights）型导入 ── */
import type {
  AnalyzeVideoHighlightsParams,
  AnalyzeVideoHighlightsResult,
  GenerateHighlightsMicrodramaParams,
  GenerateHighlightsMicrodramaResult,
  GenerateHighlightsMinigameParams,
  GenerateHighlightsMinigameResult,
  GenerateHighlightsMovieParams,
  GenerateHighlightsMovieResult,
} from './tools/video-highlights.js'

/* ── 绿幕抠图（video-matte-watermark）型导入 ── */
import type {
  MatteGreenscreenVideoParams,
  MatteGreenscreenVideoResult,
} from './tools/video-matte-watermark.js'

/* ── 视频处理（video-processing）型导入 ── */
import type {
  AssessVideoQualityParams,
  AssessVideoQualityResult,
  ExtractFramesParams,
  ExtractFramesResult,
  MartencodeVideoParams,
  MartencodeVideoResult,
  ProbeVideoMetadataParams,
  ProbeVideoMetadataResult,
  RemuxVideoParams,
  RemuxVideoResult,
} from './tools/video-processing.js'

import type {
  VideoUnderstandParams,
  VideoUnderstandResult,
} from './tools/video-understand.js'

import type {
  CreateTaskResponse,
  MediakitConfig,
  TaskResult,
  WaitForTaskOptions,
} from './types.js'
import { HttpClient } from '../http/index.js'
import { getTask, waitForTask } from './base-client.js'
/* ── 音频工具（audio-tools）函数导入 ── */
import {
  detectVoiceActivity,
  detectVoiceActivityAndWait,
  probeAudioMetadata,
  probeAudioMetadataAndWait,
  separateVoice,
  separateVoiceAndWait,
  transcodeAudio,
  transcodeAudioAndWait,
} from './tools/audio-tools.js'
import {
  dramaRecapVertical,
  dramaRecapVerticalAndWait,
} from './tools/drama-recap-vertical.js'
import { dramaRecap, dramaRecapAndWait } from './tools/drama-recap.js'
import { dramaScript, dramaScriptAndWait } from './tools/drama-script.js'
/* ── 编辑类（edit-basic）函数导入 ── */
import {
  adjustAudioSpeed,
  adjustAudioSpeedAndWait,
  adjustVideoSpeed,
  adjustVideoSpeedAndWait,
  concatAudio,
  concatAudioAndWait,
  concatVideo,
  concatVideoAndWait,
  extractAudio,
  extractAudioAndWait,
  fadeAudio,
  fadeAudioAndWait,
  imageToVideo,
  imageToVideoAndWait,
  mixAudio,
  mixAudioAndWait,
  muxAudioVideo,
  muxAudioVideoAndWait,
  trimAudio,
  trimAudioAndWait,
  trimVideo,
  trimVideoAndWait,
} from './tools/edit-basic.js'
/* ── 变换类（edit-transform）函数导入 ── */
import {
  addImageToVideo,
  addImageToVideoAndWait,
  addSubtitleToVideo,
  addSubtitleToVideoAndWait,
  applyVideoFilter,
  applyVideoFilterAndWait,
  cropVideo,
  cropVideoAndWait,
  extractAnimatedImage,
  extractAnimatedImageAndWait,
  flipVideo,
  flipVideoAndWait,
  gaussianBlurVideo,
  gaussianBlurVideoAndWait,
  rotateVideo,
  rotateVideoAndWait,
  stitchVideo,
  stitchVideoAndWait,
} from './tools/edit-transform.js'

import { enhanceVideo, enhanceVideoAndWait } from './tools/enhance-video.js'

import {
  eraseVideoSubtitlePro,
  eraseVideoSubtitleProAndWait,
  eraseVideoSubtitleStandard,
  eraseVideoSubtitleStandardAndWait,
} from './tools/erase-video-subtitle.js'

/* ── 文字滚屏视频函数导入 ── */
import {
  textToScrollingVideo,
  textToScrollingVideoAndWait,
} from './tools/text-to-scrolling-video.js'

/* ── Vibe Editing 函数导入 ── */
import { vibeEditing, vibeEditingAndWait } from './tools/vibe-editing.js'

/* ── 视频分析（video-analysis）函数导入 ── */
import {
  analyzeVideoStoryline,
  analyzeVideoStorylineAndWait,
  asrSubtitles,
  asrSubtitlesAndWait,
  segmentScenes,
  segmentScenesAndWait,
  videoOcr,
  videoOcrAndWait,
} from './tools/video-analysis.js'

/* ── 画质增强（video-enhance）函数导入 ── */
import {
  enhanceVideoGenerative,
  enhanceVideoGenerativeAndWait,
} from './tools/video-enhance.js'

/* ── 高光亮片（video-highlights）函数导入 ── */
import {
  analyzeVideoHighlights,
  analyzeVideoHighlightsAndWait,
  generateHighlightsMicrodrama,
  generateHighlightsMicrodramaAndWait,
  generateHighlightsMinigame,
  generateHighlightsMinigameAndWait,
  generateHighlightsMovie,
  generateHighlightsMovieAndWait,
} from './tools/video-highlights.js'

/* ── 绿幕抠图函数导入 ── */
import {
  matteGreenscreenVideo,
  matteGreenscreenVideoAndWait,
} from './tools/video-matte-watermark.js'

/* ── 视频处理（video-processing）函数导入 ── */
import {
  assessVideoQuality,
  assessVideoQualityAndWait,
  extractFrames,
  extractFramesAndWait,
  martencodeVideo,
  martencodeVideoAndWait,
  probeVideoMetadata,
  probeVideoMetadataAndWait,
  remuxVideo,
  remuxVideoAndWait,
} from './tools/video-processing.js'

import {
  videoUnderstand,
  videoUnderstandAndWait,
} from './tools/video-understand.js'

export {
  addImageToVideo,
  addImageToVideoAndWait,
  addSubtitleToVideo,
  addSubtitleToVideoAndWait,
  adjustAudioSpeed,
  adjustAudioSpeedAndWait,
  adjustVideoSpeed,
  adjustVideoSpeedAndWait,
  analyzeVideoHighlights,
  analyzeVideoHighlightsAndWait,
  analyzeVideoStoryline,
  analyzeVideoStorylineAndWait,
  applyVideoFilter,
  applyVideoFilterAndWait,
  asrSubtitles,
  asrSubtitlesAndWait,

  assessVideoQuality,
  assessVideoQualityAndWait,
  concatAudio,
  concatAudioAndWait,
  /* 编辑类 */
  concatVideo,
  concatVideoAndWait,
  cropVideo,
  cropVideoAndWait,
  detectVoiceActivity,
  detectVoiceActivityAndWait,
  /* 已有导出 */
  dramaRecap,
  dramaRecapAndWait,
  dramaRecapVertical,
  dramaRecapVerticalAndWait,
  dramaScript,
  dramaScriptAndWait,
  enhanceVideo,
  enhanceVideoAndWait,
  /* 画质增强（大模型） */
  enhanceVideoGenerative,
  enhanceVideoGenerativeAndWait,
  eraseVideoSubtitlePro,
  eraseVideoSubtitleProAndWait,

  eraseVideoSubtitleStandard,
  eraseVideoSubtitleStandardAndWait,
  extractAnimatedImage,
  extractAnimatedImageAndWait,
  extractAudio,
  extractAudioAndWait,
  /* 视频处理 */
  extractFrames,
  extractFramesAndWait,
  fadeAudio,
  fadeAudioAndWait,
  /* 变换类 */
  flipVideo,
  flipVideoAndWait,
  gaussianBlurVideo,
  gaussianBlurVideoAndWait,
  /* 高光滑块 */
  generateHighlightsMicrodrama,
  generateHighlightsMicrodramaAndWait,
  generateHighlightsMinigame,
  generateHighlightsMinigameAndWait,

  generateHighlightsMovie,
  generateHighlightsMovieAndWait,
  getTask,
  imageToVideo,
  imageToVideoAndWait,
  martencodeVideo,
  martencodeVideoAndWait,
  /* 绿幕抠图 */
  matteGreenscreenVideo,

  matteGreenscreenVideoAndWait,
  mixAudio,

  mixAudioAndWait,
  muxAudioVideo,
  muxAudioVideoAndWait,
  probeAudioMetadata,
  probeAudioMetadataAndWait,
  probeVideoMetadata,
  probeVideoMetadataAndWait,
  remuxVideo,

  remuxVideoAndWait,
  rotateVideo,

  rotateVideoAndWait,
  /* 视频分析 */
  segmentScenes,
  segmentScenesAndWait,
  /* 音频工具 */
  separateVoice,
  separateVoiceAndWait,
  stitchVideo,
  stitchVideoAndWait,
  /* 文字滚屏视频 */
  textToScrollingVideo,
  textToScrollingVideoAndWait,
  transcodeAudio,

  transcodeAudioAndWait,
  trimAudio,

  trimAudioAndWait,
  trimVideo,

  trimVideoAndWait,
  /* Vibe Editing */
  vibeEditing,
  vibeEditingAndWait,
  videoOcr,
  videoOcrAndWait,
  videoUnderstand,
  videoUnderstandAndWait,
  waitForTask,
}

/* ── 类型重导出 ── */

/* ── 音频工具类型导出 ── */
export type {
  DetectVoiceActivityParams,
  DetectVoiceActivityResult,
  ProbeAudioMetadataParams,
  ProbeAudioMetadataResult,
  SeparateVoiceParams,
  SeparateVoiceResult,
  TranscodeAudioParams,
  TranscodeAudioResult,
} from './tools/audio-tools.js'
export type {
  DramaRecapVerticalParams,
  DramaRecapVerticalResult,
} from './tools/drama-recap-vertical.js'
export type {
  DramaRecapParams,
  DramaRecapResult,
} from './tools/drama-recap.js'
export type {
  DramaScriptParams,
  DramaScriptResult,
} from './tools/drama-script.js'
/* ── 编辑类类型导出 ── */
export type {
  AdjustAudioSpeedParams,
  AdjustAudioSpeedResult,
  AdjustVideoSpeedParams,
  AdjustVideoSpeedResult,
  ConcatAudioParams,
  ConcatAudioResult,
  ConcatVideoParams,
  ConcatVideoResult,
  ExtractAudioParams,
  ExtractAudioResult,
  FadeAudioParams,
  FadeAudioResult,
  ImageToVideoParams,
  ImageToVideoResult,
  MixAudioParams,
  MixAudioResult,
  MuxAudioVideoParams,
  MuxAudioVideoResult,
  TrimAudioParams,
  TrimAudioResult,
  TrimVideoParams,
  TrimVideoResult,
} from './tools/edit-basic.js'
/* ── 变换类类型导出 ── */
export type {
  AddImageToVideoParams,
  AddImageToVideoResult,
  AddSubtitleToVideoParams,
  AddSubtitleToVideoResult,
  ApplyVideoFilterParams,
  ApplyVideoFilterResult,
  CropVideoParams,
  CropVideoResult,
  ExtractAnimatedImageParams,
  ExtractAnimatedImageResult,
  FlipVideoParams,
  FlipVideoResult,
  GaussianBlurVideoParams,
  GaussianBlurVideoResult,
  RotateVideoParams,
  RotateVideoResult,
  StitchVideoParams,
  StitchVideoResult,
} from './tools/edit-transform.js'

export type {
  EnhanceVideoParams,
  EnhanceVideoResult,
} from './tools/enhance-video.js'

export type {
  EraseVideoSubtitleParams,
  EraseVideoSubtitleResult,
} from './tools/erase-video-subtitle.js'

/* ── 文字滚屏视频类型导出 ── */
export type {
  TextToScrollingVideoParams,
  TextToScrollingVideoResult,
} from './tools/text-to-scrolling-video.js'

/* ── Vibe Editing 类型导出 ── */
export type {
  VibeEditingParams,
  VibeEditingResult,
} from './tools/vibe-editing.js'

/* ── 视频分析类型导出 ── */
export type {
  AnalyzeVideoStorylineParams,
  AnalyzeVideoStorylineResult,
  AsrSubtitlesParams,
  AsrSubtitlesResult,
  SegmentScenesParams,
  SegmentScenesResult,
  VideoOcrParams,
  VideoOcrResult,
} from './tools/video-analysis.js'

/* ── 画质增强（大模型）类型导出 ── */
export type {
  EnhanceVideoGenerativeParams,
  EnhanceVideoGenerativeResult,
} from './tools/video-enhance.js'

/* ── 高光亮片类型导出 ── */
export type {
  AnalyzeVideoHighlightsParams,
  AnalyzeVideoHighlightsResult,
  GenerateHighlightsMicrodramaParams,
  GenerateHighlightsMicrodramaResult,
  GenerateHighlightsMinigameParams,
  GenerateHighlightsMinigameResult,
  GenerateHighlightsMovieParams,
  GenerateHighlightsMovieResult,
} from './tools/video-highlights.js'

/* ── 绿幕抠图类型导出 ── */
export type {
  MatteGreenscreenVideoParams,
  MatteGreenscreenVideoResult,
} from './tools/video-matte-watermark.js'

/* ── 视频处理类型导出 ── */
export type {
  AssessVideoQualityParams,
  AssessVideoQualityResult,
  ExtractFramesParams,
  ExtractFramesResult,
  MartencodeVideoParams,
  MartencodeVideoResult,
  ProbeVideoMetadataParams,
  ProbeVideoMetadataResult,
  RemuxVideoParams,
  RemuxVideoResult,
} from './tools/video-processing.js'

export type {
  VideoUnderstandManualOption,
  VideoUnderstandParams,
  VideoUnderstandResult,
  VideoUnderstandTokenUsage,
} from './tools/video-understand.js'

export type {
  CreateTaskResponse,
  MediakitConfig,
  TaskResult,
  TaskStatus,
  WaitForTaskOptions,
} from './types.js'

/* ── Mediakit 客户端类 ── */

/**
 * 火山引擎 AI MediaKit 客户端。
 *
 * 提供对所有多媒体处理工具的便捷访问，每个工具为独立模块，
 * 可单独调用或通过实例调用。所有工具均基于异步任务机制：
 * 1. 调用 xxx() 提交任务 → 获得 task_id
 * 2. 调用 waitForTask() 轮询等待 → 获得最终结果
 * 3. 或使用 xxxAndWait() 一步完成
 *
 * @example
 * ```ts
 * import { Mediakit } from '@zzhqux/volcengine-ai-mediakit'
 *
 * const client = new Mediakit({ apiKey: 'your-api-key' })
 *
 * // 方式一：分步调用
 * const { task_id } = await client.enhanceVideo({
 *   video_url: 'https://example.com/video.mp4',
 *   resolution: '1080p',
 * })
 * const result = await client.waitForTask(task_id)
 * console.log('增强后视频:', result.result?.video_url)
 *
 * // 方式二：一步完成
 * const result = await client.enhanceVideoAndWait({
 *   video_url: 'https://example.com/video.mp4',
 *   resolution: '1080p',
 * })
 * ```
 */
export class Mediakit {
  private client: HttpClient

  constructor(config: MediakitConfig) {
    this.client = new HttpClient(config.baseURL)
    this.client.setApiKey(config.apiKey)
  }

  /* ── 任务管理 ── */

  /**
   * 查询任务信息。
   *
   * @param taskId - 任务 ID
   * @returns 任务当前状态和结果
   */
  getTask(taskId: string): Promise<TaskResult> {
    return getTask(this.client, taskId)
  }

  /**
   * 轮询等待任务完成。
   *
   * @param taskId  - 任务 ID
   * @param options - 轮询配置（间隔、超时、回调）
   * @returns 完成后的任务结果
   */
  waitForTask(
    taskId: string,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult> {
    return waitForTask(this.client, taskId, options)
  }

  /* ── 画质增强 ── */

  /**
   * 提交画质增强任务。
   *
   * @param params - 画质增强参数，至少需提供 video_url
   * @returns 任务提交响应
   */
  enhanceVideo(params: EnhanceVideoParams): Promise<CreateTaskResponse> {
    return enhanceVideo(this.client, params)
  }

  /**
   * 提交画质增强任务并等待完成。
   *
   * @param params  - 画质增强参数
   * @param options - 轮询配置
   * @returns 增强后的视频信息
   */
  enhanceVideoAndWait(
    params: EnhanceVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<EnhanceVideoResult>> {
    return enhanceVideoAndWait(this.client, params, options)
  }

  /* ── 字幕擦除（精细化版） ── */

  /**
   * 提交字幕擦除（精细化版）任务。
   * 支持指定区域擦除。
   *
   * @param params - 字幕擦除参数
   * @returns 任务提交响应
   */
  eraseVideoSubtitlePro(
    params: EraseVideoSubtitleParams,
  ): Promise<CreateTaskResponse> {
    return eraseVideoSubtitlePro(this.client, params)
  }

  /**
   * 提交字幕擦除（精细化版）任务并等待完成。
   *
   * @param params  - 字幕擦除参数
   * @param options - 轮询配置
   * @returns 擦除后的视频信息
   */
  eraseVideoSubtitleProAndWait(
    params: EraseVideoSubtitleParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<EraseVideoSubtitleResult>> {
    return eraseVideoSubtitleProAndWait(this.client, params, options)
  }

  /* ── 字幕擦除（标准版） ── */

  /**
   * 提交字幕擦除（标准版）任务。
   * 效果和效率之间取得平衡。
   *
   * @param params - 字幕擦除参数
   * @returns 任务提交响应
   */
  eraseVideoSubtitleStandard(
    params: EraseVideoSubtitleParams,
  ): Promise<CreateTaskResponse> {
    return eraseVideoSubtitleStandard(this.client, params)
  }

  /**
   * 提交字幕擦除（标准版）任务并等待完成。
   *
   * @param params  - 字幕擦除参数
   * @param options - 轮询配置
   * @returns 擦除后的视频信息
   */
  eraseVideoSubtitleStandardAndWait(
    params: EraseVideoSubtitleParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<EraseVideoSubtitleResult>> {
    return eraseVideoSubtitleStandardAndWait(this.client, params, options)
  }

  /* ── 剧本还原 ── */

  /**
   * 提交剧本还原任务。
   * 将真人实拍短剧转化为结构化剧本文本。
   *
   * @param params - 剧本还原参数，video_urls 必填
   * @returns 任务提交响应
   */
  dramaScript(params: DramaScriptParams): Promise<CreateTaskResponse> {
    return dramaScript(this.client, params)
  }

  /**
   * 提交剧本还原任务并等待完成。
   *
   * @param params  - 剧本还原参数
   * @param options - 轮询配置
   * @returns 剧本还原结果，含 result_url 和 drama_script_task_id
   */
  dramaScriptAndWait(
    params: DramaScriptParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<DramaScriptResult>> {
    return dramaScriptAndWait(this.client, params, options)
  }

  /* ── 解说视频生成 ── */

  /**
   * 提交解说视频生成任务。
   * 需要先完成剧本还原，获取 drama_script_task_id。
   *
   * @param params - 解说视频生成参数，drama_script_task_id 必填
   * @returns 任务提交响应
   */
  dramaRecap(params: DramaRecapParams): Promise<CreateTaskResponse> {
    return dramaRecap(this.client, params)
  }

  /**
   * 提交解说视频生成任务并等待完成。
   *
   * @param params  - 解说视频生成参数
   * @param options - 轮询配置
   * @returns 生成的解说视频信息
   */
  dramaRecapAndWait(
    params: DramaRecapParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<DramaRecapResult>> {
    return dramaRecapAndWait(this.client, params, options)
  }

  /* ── 解说视频生成（短剧行业模型） ── */

  /**
   * 提交解说视频生成（短剧行业模型）任务。
   * 一步到位，无需先做剧本还原。
   *
   * @param params - 解说视频生成参数，video_urls 和 mode 必填
   * @returns 任务提交响应
   */
  dramaRecapVertical(
    params: DramaRecapVerticalParams,
  ): Promise<CreateTaskResponse> {
    return dramaRecapVertical(this.client, params)
  }

  /**
   * 提交解说视频生成（短剧行业模型）任务并等待完成。
   *
   * @param params  - 解说视频生成参数
   * @param options - 轮询配置
   * @returns 生成的解说视频信息
   */
  dramaRecapVerticalAndWait(
    params: DramaRecapVerticalParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<DramaRecapVerticalResult>> {
    return dramaRecapVerticalAndWait(this.client, params, options)
  }

  /* ── 视频理解（高光片段提取） ── */

  /**
   * 提交视频理解任务。
   * 基于视觉大模型对视频内容进行深度分析。
   *
   * @param params - 视频理解参数，video_urls 和 prompt 必填
   * @returns 任务提交响应
   */
  videoUnderstand(params: VideoUnderstandParams): Promise<CreateTaskResponse> {
    return videoUnderstand(this.client, params)
  }

  /**
   * 提交视频理解任务并等待完成。
   *
   * @param params  - 视频理解参数
   * @param options - 轮询配置
   * @returns 分析结果列表和 Token 统计
   */
  videoUnderstandAndWait(
    params: VideoUnderstandParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<VideoUnderstandResult>> {
    return videoUnderstandAndWait(this.client, params, options)
  }

  /* ══════════════════════════════════════════════════════
     📹 视频编辑类（edit-basic）
     ══════════════════════════════════════════════════════ */

  /* ── 视频拼接 ── */

  concatVideo(params: ConcatVideoParams): Promise<CreateTaskResponse> {
    return concatVideo(this.client, params)
  }

  concatVideoAndWait(
    params: ConcatVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<ConcatVideoResult>> {
    return concatVideoAndWait(this.client, params, options)
  }

  /* ── 音频拼接 ── */

  concatAudio(params: ConcatAudioParams): Promise<CreateTaskResponse> {
    return concatAudio(this.client, params)
  }

  concatAudioAndWait(
    params: ConcatAudioParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<ConcatAudioResult>> {
    return concatAudioAndWait(this.client, params, options)
  }

  /* ── 视频裁剪 ── */

  trimVideo(params: TrimVideoParams): Promise<CreateTaskResponse> {
    return trimVideo(this.client, params)
  }

  trimVideoAndWait(
    params: TrimVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<TrimVideoResult>> {
    return trimVideoAndWait(this.client, params, options)
  }

  /* ── 音频裁剪 ── */

  trimAudio(params: TrimAudioParams): Promise<CreateTaskResponse> {
    return trimAudio(this.client, params)
  }

  trimAudioAndWait(
    params: TrimAudioParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<TrimAudioResult>> {
    return trimAudioAndWait(this.client, params, options)
  }

  /* ── 视频调速 ── */

  adjustVideoSpeed(
    params: AdjustVideoSpeedParams,
  ): Promise<CreateTaskResponse> {
    return adjustVideoSpeed(this.client, params)
  }

  adjustVideoSpeedAndWait(
    params: AdjustVideoSpeedParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<AdjustVideoSpeedResult>> {
    return adjustVideoSpeedAndWait(this.client, params, options)
  }

  /* ── 音频调速 ── */

  adjustAudioSpeed(
    params: AdjustAudioSpeedParams,
  ): Promise<CreateTaskResponse> {
    return adjustAudioSpeed(this.client, params)
  }

  adjustAudioSpeedAndWait(
    params: AdjustAudioSpeedParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<AdjustAudioSpeedResult>> {
    return adjustAudioSpeedAndWait(this.client, params, options)
  }

  /* ── 音频提取 ── */

  extractAudio(params: ExtractAudioParams): Promise<CreateTaskResponse> {
    return extractAudio(this.client, params)
  }

  extractAudioAndWait(
    params: ExtractAudioParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<ExtractAudioResult>> {
    return extractAudioAndWait(this.client, params, options)
  }

  /* ── 音视频合成 ── */

  muxAudioVideo(params: MuxAudioVideoParams): Promise<CreateTaskResponse> {
    return muxAudioVideo(this.client, params)
  }

  muxAudioVideoAndWait(
    params: MuxAudioVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<MuxAudioVideoResult>> {
    return muxAudioVideoAndWait(this.client, params, options)
  }

  /* ── 图片转视频 ── */

  imageToVideo(params: ImageToVideoParams): Promise<CreateTaskResponse> {
    return imageToVideo(this.client, params)
  }

  imageToVideoAndWait(
    params: ImageToVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<ImageToVideoResult>> {
    return imageToVideoAndWait(this.client, params, options)
  }

  /* ── 音频混合 ── */

  mixAudio(params: MixAudioParams): Promise<CreateTaskResponse> {
    return mixAudio(this.client, params)
  }

  mixAudioAndWait(
    params: MixAudioParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<MixAudioResult>> {
    return mixAudioAndWait(this.client, params, options)
  }

  /* ── 音频淡入淡出 ── */

  fadeAudio(params: FadeAudioParams): Promise<CreateTaskResponse> {
    return fadeAudio(this.client, params)
  }

  fadeAudioAndWait(
    params: FadeAudioParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<FadeAudioResult>> {
    return fadeAudioAndWait(this.client, params, options)
  }

  /* ══════════════════════════════════════════════════════
     🎬 视频变换类（edit-transform）
     ══════════════════════════════════════════════════════ */

  /* ── 视频画面翻转 ── */

  flipVideo(params: FlipVideoParams): Promise<CreateTaskResponse> {
    return flipVideo(this.client, params)
  }

  flipVideoAndWait(
    params: FlipVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<FlipVideoResult>> {
    return flipVideoAndWait(this.client, params, options)
  }

  /* ── 视频画面旋转 ── */

  rotateVideo(params: RotateVideoParams): Promise<CreateTaskResponse> {
    return rotateVideo(this.client, params)
  }

  rotateVideoAndWait(
    params: RotateVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<RotateVideoResult>> {
    return rotateVideoAndWait(this.client, params, options)
  }

  /* ── 视频画面裁剪 ── */

  cropVideo(params: CropVideoParams): Promise<CreateTaskResponse> {
    return cropVideo(this.client, params)
  }

  cropVideoAndWait(
    params: CropVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<CropVideoResult>> {
    return cropVideoAndWait(this.client, params, options)
  }

  /* ── 视频画面拼接 ── */

  stitchVideo(params: StitchVideoParams): Promise<CreateTaskResponse> {
    return stitchVideo(this.client, params)
  }

  stitchVideoAndWait(
    params: StitchVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<StitchVideoResult>> {
    return stitchVideoAndWait(this.client, params, options)
  }

  /* ── 视频加字幕 ── */

  addSubtitleToVideo(
    params: AddSubtitleToVideoParams,
  ): Promise<CreateTaskResponse> {
    return addSubtitleToVideo(this.client, params)
  }

  addSubtitleToVideoAndWait(
    params: AddSubtitleToVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<AddSubtitleToVideoResult>> {
    return addSubtitleToVideoAndWait(this.client, params, options)
  }

  /* ── 视频加图片 ── */

  addImageToVideo(params: AddImageToVideoParams): Promise<CreateTaskResponse> {
    return addImageToVideo(this.client, params)
  }

  addImageToVideoAndWait(
    params: AddImageToVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<AddImageToVideoResult>> {
    return addImageToVideoAndWait(this.client, params, options)
  }

  /* ── 视频添加滤镜 ── */

  applyVideoFilter(
    params: ApplyVideoFilterParams,
  ): Promise<CreateTaskResponse> {
    return applyVideoFilter(this.client, params)
  }

  applyVideoFilterAndWait(
    params: ApplyVideoFilterParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<ApplyVideoFilterResult>> {
    return applyVideoFilterAndWait(this.client, params, options)
  }

  /* ── 视频截取动图 ── */

  extractAnimatedImage(
    params: ExtractAnimatedImageParams,
  ): Promise<CreateTaskResponse> {
    return extractAnimatedImage(this.client, params)
  }

  extractAnimatedImageAndWait(
    params: ExtractAnimatedImageParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<ExtractAnimatedImageResult>> {
    return extractAnimatedImageAndWait(this.client, params, options)
  }

  /* ── 视频高斯模糊 ── */

  gaussianBlurVideo(
    params: GaussianBlurVideoParams,
  ): Promise<CreateTaskResponse> {
    return gaussianBlurVideo(this.client, params)
  }

  gaussianBlurVideoAndWait(
    params: GaussianBlurVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<GaussianBlurVideoResult>> {
    return gaussianBlurVideoAndWait(this.client, params, options)
  }

  /* ══════════════════════════════════════════════════════
     🔍 视频分析类（video-analysis）
     ══════════════════════════════════════════════════════ */

  /* ── 场景切分 ── */

  segmentScenes(params: SegmentScenesParams): Promise<CreateTaskResponse> {
    return segmentScenes(this.client, params)
  }

  segmentScenesAndWait(
    params: SegmentScenesParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<SegmentScenesResult>> {
    return segmentScenesAndWait(this.client, params, options)
  }

  /* ── 语音转字幕（ASR） ── */

  asrSubtitles(params: AsrSubtitlesParams): Promise<CreateTaskResponse> {
    return asrSubtitles(this.client, params)
  }

  asrSubtitlesAndWait(
    params: AsrSubtitlesParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<AsrSubtitlesResult>> {
    return asrSubtitlesAndWait(this.client, params, options)
  }

  /* ── 视频识别字幕（OCR） ── */

  videoOcr(params: VideoOcrParams): Promise<CreateTaskResponse> {
    return videoOcr(this.client, params)
  }

  videoOcrAndWait(
    params: VideoOcrParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<VideoOcrResult>> {
    return videoOcrAndWait(this.client, params, options)
  }

  /* ── 剧情故事线分析 ── */

  analyzeVideoStoryline(
    params: AnalyzeVideoStorylineParams,
  ): Promise<CreateTaskResponse> {
    return analyzeVideoStoryline(this.client, params)
  }

  analyzeVideoStorylineAndWait(
    params: AnalyzeVideoStorylineParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<AnalyzeVideoStorylineResult>> {
    return analyzeVideoStorylineAndWait(this.client, params, options)
  }

  /* ══════════════════════════════════════════════════════
     ✨ 画质增强（大模型）
     ══════════════════════════════════════════════════════ */

  enhanceVideoGenerative(
    params: EnhanceVideoGenerativeParams,
  ): Promise<CreateTaskResponse> {
    return enhanceVideoGenerative(this.client, params)
  }

  enhanceVideoGenerativeAndWait(
    params: EnhanceVideoGenerativeParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<EnhanceVideoGenerativeResult>> {
    return enhanceVideoGenerativeAndWait(this.client, params, options)
  }

  /* ══════════════════════════════════════════════════════
     🌟 高光亮片类（video-highlights）
     ══════════════════════════════════════════════════════ */

  /* ── 高光智剪-短剧 ── */

  generateHighlightsMicrodrama(
    params: GenerateHighlightsMicrodramaParams,
  ): Promise<CreateTaskResponse> {
    return generateHighlightsMicrodrama(this.client, params)
  }

  generateHighlightsMicrodramaAndWait(
    params: GenerateHighlightsMicrodramaParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<GenerateHighlightsMicrodramaResult>> {
    return generateHighlightsMicrodramaAndWait(this.client, params, options)
  }

  /* ── 高光智剪-小游戏 ── */

  generateHighlightsMinigame(
    params: GenerateHighlightsMinigameParams,
  ): Promise<CreateTaskResponse> {
    return generateHighlightsMinigame(this.client, params)
  }

  generateHighlightsMinigameAndWait(
    params: GenerateHighlightsMinigameParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<GenerateHighlightsMinigameResult>> {
    return generateHighlightsMinigameAndWait(this.client, params, options)
  }

  /* ── 高光智剪-影视拆条 ── */

  generateHighlightsMovie(
    params: GenerateHighlightsMovieParams,
  ): Promise<CreateTaskResponse> {
    return generateHighlightsMovie(this.client, params)
  }

  generateHighlightsMovieAndWait(
    params: GenerateHighlightsMovieParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<GenerateHighlightsMovieResult>> {
    return generateHighlightsMovieAndWait(this.client, params, options)
  }

  /* ── 高光片段提取（仅分析） ── */

  analyzeVideoHighlights(
    params: AnalyzeVideoHighlightsParams,
  ): Promise<CreateTaskResponse> {
    return analyzeVideoHighlights(this.client, params)
  }

  analyzeVideoHighlightsAndWait(
    params: AnalyzeVideoHighlightsParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<AnalyzeVideoHighlightsResult>> {
    return analyzeVideoHighlightsAndWait(this.client, params, options)
  }

  /* ══════════════════════════════════════════════════════
     🟢 绿幕抠图
     ══════════════════════════════════════════════════════ */

  matteGreenscreenVideo(
    params: MatteGreenscreenVideoParams,
  ): Promise<CreateTaskResponse> {
    return matteGreenscreenVideo(this.client, params)
  }

  matteGreenscreenVideoAndWait(
    params: MatteGreenscreenVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<MatteGreenscreenVideoResult>> {
    return matteGreenscreenVideoAndWait(this.client, params, options)
  }

  /* ══════════════════════════════════════════════════════
     ⚙️ 视频处理类（video-processing）
     ══════════════════════════════════════════════════════ */

  /* ── 视频抽帧 ── */

  extractFrames(params: ExtractFramesParams): Promise<CreateTaskResponse> {
    return extractFrames(this.client, params)
  }

  extractFramesAndWait(
    params: ExtractFramesParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<ExtractFramesResult>> {
    return extractFramesAndWait(this.client, params, options)
  }

  /* ── 极智超清 ── */

  martencodeVideo(params: MartencodeVideoParams): Promise<CreateTaskResponse> {
    return martencodeVideo(this.client, params)
  }

  martencodeVideoAndWait(
    params: MartencodeVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<MartencodeVideoResult>> {
    return martencodeVideoAndWait(this.client, params, options)
  }

  /* ── 视频转封装 ── */

  remuxVideo(params: RemuxVideoParams): Promise<CreateTaskResponse> {
    return remuxVideo(this.client, params)
  }

  remuxVideoAndWait(
    params: RemuxVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<RemuxVideoResult>> {
    return remuxVideoAndWait(this.client, params, options)
  }

  /* ── 视频画质检测 VQScore ── */

  assessVideoQuality(
    params: AssessVideoQualityParams,
  ): Promise<CreateTaskResponse> {
    return assessVideoQuality(this.client, params)
  }

  assessVideoQualityAndWait(
    params: AssessVideoQualityParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<AssessVideoQualityResult>> {
    return assessVideoQualityAndWait(this.client, params, options)
  }

  /* ── 视频元信息获取 ── */

  probeVideoMetadata(
    params: ProbeVideoMetadataParams,
  ): Promise<CreateTaskResponse> {
    return probeVideoMetadata(this.client, params)
  }

  probeVideoMetadataAndWait(
    params: ProbeVideoMetadataParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<ProbeVideoMetadataResult>> {
    return probeVideoMetadataAndWait(this.client, params, options)
  }

  /* ══════════════════════════════════════════════════════
     🎨 Vibe Editing（智能剪辑）
     ══════════════════════════════════════════════════════ */

  vibeEditing(params: VibeEditingParams): Promise<CreateTaskResponse> {
    return vibeEditing(this.client, params)
  }

  vibeEditingAndWait(
    params: VibeEditingParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<VibeEditingResult>> {
    return vibeEditingAndWait(this.client, params, options)
  }

  /* ══════════════════════════════════════════════════════
     📝 文字生成滚屏视频
     ══════════════════════════════════════════════════════ */

  textToScrollingVideo(
    params: TextToScrollingVideoParams,
  ): Promise<CreateTaskResponse> {
    return textToScrollingVideo(this.client, params)
  }

  textToScrollingVideoAndWait(
    params: TextToScrollingVideoParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<TextToScrollingVideoResult>> {
    return textToScrollingVideoAndWait(this.client, params, options)
  }

  /* ══════════════════════════════════════════════════════
     🔊 音频工具类（audio-tools）
     ══════════════════════════════════════════════════════ */

  /* ── 人声背景音分离 ── */

  separateVoice(params: SeparateVoiceParams): Promise<CreateTaskResponse> {
    return separateVoice(this.client, params)
  }

  separateVoiceAndWait(
    params: SeparateVoiceParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<SeparateVoiceResult>> {
    return separateVoiceAndWait(this.client, params, options)
  }

  /* ── 语音端点识别 ── */

  detectVoiceActivity(
    params: DetectVoiceActivityParams,
  ): Promise<CreateTaskResponse> {
    return detectVoiceActivity(this.client, params)
  }

  detectVoiceActivityAndWait(
    params: DetectVoiceActivityParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<DetectVoiceActivityResult>> {
    return detectVoiceActivityAndWait(this.client, params, options)
  }

  /* ── 音频转码 ── */

  transcodeAudio(params: TranscodeAudioParams): Promise<CreateTaskResponse> {
    return transcodeAudio(this.client, params)
  }

  transcodeAudioAndWait(
    params: TranscodeAudioParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<TranscodeAudioResult>> {
    return transcodeAudioAndWait(this.client, params, options)
  }

  /* ── 音频元信息获取 ── */

  probeAudioMetadata(
    params: ProbeAudioMetadataParams,
  ): Promise<CreateTaskResponse> {
    return probeAudioMetadata(this.client, params)
  }

  probeAudioMetadataAndWait(
    params: ProbeAudioMetadataParams,
    options?: WaitForTaskOptions,
  ): Promise<TaskResult<ProbeAudioMetadataResult>> {
    return probeAudioMetadataAndWait(this.client, params, options)
  }
}
