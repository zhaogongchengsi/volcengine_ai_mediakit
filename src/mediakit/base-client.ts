import type { ApiResponse, HttpClient } from '../http/index.js'
import type { TaskResult, WaitForTaskOptions } from './types.js'

/**
 * 将 HTTP 层返回的 ApiResponse 断言为精确的领域类型。
 * http.get/post 返回的 ApiResponse 字段偏宽松（部分可选），
 * 而领域类型（TaskResult / CreateTaskResponse）字段更严格，
 * 在确认 API 契约后使用此函数安全转换。
 */
export function toDomain<T>(res: ApiResponse<T>): T {
  return res as T
}

/**
 * 查询任务信息。
 *
 * @param http   - HttpClient 实例
 * @param taskId - 任务 ID
 */
export async function getTask(
  http: HttpClient,
  taskId: string,
): Promise<TaskResult> {
  const res = await http.get<TaskResult>(`/api/v1/tasks/${taskId}`)
  return toDomain(res)
}

/**
 * 轮询等待任务完成。
 *
 * 以固定间隔查询任务状态，直到 `completed` 或 `failed`，或超时。
 *
 * @param http    - HttpClient 实例
 * @param taskId  - 任务 ID
 * @param options - 轮询配置
 */
export async function waitForTask(
  http: HttpClient,
  taskId: string,
  options?: WaitForTaskOptions,
): Promise<TaskResult> {
  const interval = options?.interval ?? 3000
  const timeout = options?.timeout ?? 300_000
  const deadline = Date.now() + timeout

  while (Date.now() < deadline) {
    const task = await getTask(http, taskId)

    if (options?.onProgress) {
      options.onProgress(task)
    }

    if (task.status === 'completed' || task.status === 'failed') {
      return task
    }

    await sleep(interval)
  }

  throw new Error(
    `Task "${taskId}" did not complete within ${timeout / 1000}s`,
  )
}

/** 延迟指定毫秒数 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
