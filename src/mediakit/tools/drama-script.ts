import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 剧本还原 ── */

/**
 * 剧本还原任务请求参数
 *
 * 基于强大的视频理解能力，将真人实拍的短剧转化为结构化剧本文本。
 * 是解说视频生成的必要前置步骤。
 *
 * 使用限制：
 * - 视频数量：1 ~ 100 个
 * - 视频格式：mp4、flv、ts、avi、mov、wmv、mkv 等主流格式
 * - 单视频时长：不超过 120 分钟
 * - 累计总时长：不超过 90 分钟
 * - 分辨率：所有视频宽高必须一致
 * - 内容要求：仅支持真人实拍（不适用于动画、纪录片等）
 * - 字幕要求：视频必须包含清晰的内嵌字幕（硬字幕）
 */
export interface DramaScriptParams {
  /**
   * 待分析剧集视频的公网 URL 列表，支持 1 ~ 100 个
   * 所有视频的宽高分辨率必须保持一致
   */
  video_urls: string[]
  /**
   * 是否返回完整包（含人物聚类图片、场景帧截图等），默认 false
   * 设为 true 时结果文件会更大
   */
  return_pkg?: boolean
}

/** 剧本还原任务完成后的结果 */
export interface DramaScriptResult {
  /** 剧本文件下载地址（Gzip 压缩的 JSON），有效期 24 小时 */
  result_url: string
  /** 输入视频总时长（秒） */
  duration: number
  /**
   * 剧本还原任务 ID
   * 用于后续提交解说视频生成（drama-recap）任务的必填参数
   */
  drama_script_task_id: string
}

/* ── 工具函数 ── */

/**
 * 提交剧本还原任务。
 *
 * 调用 POST /api/v1/tools/drama-script。
 * 剧本还原是解说视频生成的前置步骤，完成后返回 drama_script_task_id。
 *
 * @param http   - HttpClient 实例
 * @param params - 剧本还原参数，video_urls 必填
 * @returns 任务提交响应，包含 task_id
 */
export async function dramaScript(
  http: HttpClient,
  params: DramaScriptParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/drama-script',
    params,
  )
  return toDomain(res)
}

/**
 * 提交剧本还原任务并轮询等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 剧本还原参数
 * @param pollOptions - 轮询配置
 * @returns 完成后的任务结果，result 包含 result_url 和 drama_script_task_id
 */
export async function dramaScriptAndWait(
  http: HttpClient,
  params: DramaScriptParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<DramaScriptResult>> {
  const { task_id } = await dramaScript(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<DramaScriptResult>
  >
}
