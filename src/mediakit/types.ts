/* ── 异步任务 ── */

/** 提交异步任务的成功响应 */
export interface CreateTaskResponse {
  success: boolean
  task_id: string
  request_id: string
}

/** 任务状态 */
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed'

/** 查询任务信息的响应 */
export interface TaskResult<T = unknown> {
  success: boolean
  task_id: string
  task_type?: string
  status: TaskStatus
  result?: T
  expires_at?: number
  created_at?: number
  finished_at?: number
  request_id: string
}

/* ── 轮询等待 ── */

export interface WaitForTaskOptions {
  /** 轮询间隔（毫秒），默认 3000 */
  interval?: number
  /** 超时时间（毫秒），默认 300000（5 分钟） */
  timeout?: number
  /** 每次轮询的回调，可用于显示进度 */
  onProgress?: (task: TaskResult) => void
}

/* ── 客户端配置 ── */

export interface MediakitConfig {
  /** 火山引擎 AI MediaKit API Key */
  apiKey: string
  /** API 基础地址，默认 https://mediakit.cn-beijing.volces.com */
  baseURL?: string
}
