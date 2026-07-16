/* ── 通用 API 响应 ── */

/** 火山引擎 API 统一响应外壳 */
export interface ApiResponse<T = unknown> {
  success: boolean
  task_id?: string
  request_id: string
  task_type?: string
  status?: string
  result?: T
  expires_at?: number
  created_at?: number
  finished_at?: number
}
