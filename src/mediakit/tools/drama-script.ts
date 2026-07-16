import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── Types ── */

/** 剧本还原任务请求参数 */
export interface DramaScriptParams {
  /** 待分析剧集视频的公网 URL 列表，支持 1 ~ 100 个 */
  video_urls: string[]
  /** 是否返回完整包（含人物聚类图片、场景帧截图等），默认 false */
  return_pkg?: boolean
}

/** 剧本还原任务完成后的结果 */
export interface DramaScriptResult {
  /** 剧本文件下载地址（Gzip 压缩的 JSON），有效期 24 小时 */
  result_url: string
  /** 输入视频总时长（秒） */
  duration: number
  /** 剧本还原任务 ID，可用于后续提交解说视频生成任务 */
  drama_script_task_id: string
}

/* ── Functions ── */

/**
 * 提交剧本还原任务。
 *
 * @param http   - HttpClient 实例
 * @param params - 剧本还原参数
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
 * 提交剧本还原任务并等待完成。
 *
 * @param http        - HttpClient 实例
 * @param params      - 剧本还原参数
 * @param pollOptions - 轮询配置
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
