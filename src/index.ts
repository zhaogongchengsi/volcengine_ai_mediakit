export { ApiError, http, HttpClient, setApiKey } from './http/index.js'
export type { ApiResponse, RequestConfig } from './http/index.js'

export { enhanceVideo, enhanceVideoAndWait, getTask, Mediakit, waitForTask } from './mediakit/index.js'
export type {
  CreateTaskResponse,
  MediakitConfig,
  TaskResult,
  TaskStatus,
  WaitForTaskOptions,
} from './mediakit/index.js'
export type {
  EnhanceVideoParams,
  EnhanceVideoResult,
} from './mediakit/index.js'
