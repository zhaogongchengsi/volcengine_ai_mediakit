export { ApiError, http, HttpClient, setApiKey } from './http/index.js'
export type { ApiResponse, RequestConfig } from './http/index.js'

export {
  dramaRecap,
  dramaRecapAndWait,
  dramaRecapVertical,
  dramaRecapVerticalAndWait,
  dramaScript,
  dramaScriptAndWait,
  enhanceVideo,
  enhanceVideoAndWait,
  eraseVideoSubtitlePro,
  eraseVideoSubtitleProAndWait,
  eraseVideoSubtitleStandard,
  eraseVideoSubtitleStandardAndWait,
  getTask,
  Mediakit,
  videoUnderstand,
  videoUnderstandAndWait,
  waitForTask,
} from './mediakit/index.js'
export type {
  CreateTaskResponse,
  MediakitConfig,
  TaskResult,
  TaskStatus,
  WaitForTaskOptions,
} from './mediakit/index.js'
export type {
  DramaRecapParams,
  DramaRecapResult,
} from './mediakit/index.js'
export type {
  DramaRecapVerticalParams,
  DramaRecapVerticalResult,
} from './mediakit/index.js'
export type {
  DramaScriptParams,
  DramaScriptResult,
} from './mediakit/index.js'
export type {
  EnhanceVideoParams,
  EnhanceVideoResult,
} from './mediakit/index.js'
export type {
  EraseVideoSubtitleParams,
  EraseVideoSubtitleResult,
} from './mediakit/index.js'
export type {
  VideoUnderstandManualOption,
  VideoUnderstandParams,
  VideoUnderstandResult,
  VideoUnderstandTokenUsage,
} from './mediakit/index.js'
