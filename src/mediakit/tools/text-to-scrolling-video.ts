import type { HttpClient } from '../../http/index.js'
import type { CreateTaskResponse, TaskResult, WaitForTaskOptions } from '../types.js'
import { toDomain, waitForTask } from '../base-client.js'

/* ── 文字生成滚屏视频 ── */

export interface TextToScrollingVideoParams {
  /** 滚屏文本内容。支持 \n 强制换行 */
  text: string
  /** 背景图片 URL，建议宽高比 9:16 */
  image_url: string
  /** 背景音乐 URL，将无缝循环播放至视频结束 */
  audio_url?: string
  /** 输出竖版分辨率（固定 9:16）：360p / 480p / 720p（默认）/ 1080p */
  resolution?: '360p' | '480p' | '720p' | '1080p'
  /** 字体：sy_black（默认）/ pm_zhengdao / ali_puhui / zhanku_kuaile */
  font_type?: string
  /** 文本颜色 RGBA（#RRGGBBAA），默认 #1F1F1FFF */
  font_color?: string
  /** 单页文字滚过屏幕的时长（秒）[0.5, 60]，默认 3 */
  single_roll_duration?: number
  /** 开始时文字静止停留时长（秒）[0, 60]，默认 2 */
  start_hold_duration?: number
  /** 结束时文字静止停留时长（秒）[0, 60]，默认 2 */
  end_hold_duration?: number
}

export interface TextToScrollingVideoResult {
  /** 滚屏视频地址（MP4），有效期 24 小时 */
  video_url: string
  /** 输出视频时长（秒） */
  duration: number
  /** 输出视频分辨率 */
  resolution: string
}

export async function textToScrollingVideo(
  http: HttpClient,
  params: TextToScrollingVideoParams,
): Promise<CreateTaskResponse> {
  const res = await http.post<CreateTaskResponse>(
    '/api/v1/tools/text-to-scrolling-video',
    params,
  )
  return toDomain(res)
}

export async function textToScrollingVideoAndWait(
  http: HttpClient,
  params: TextToScrollingVideoParams,
  pollOptions?: WaitForTaskOptions,
): Promise<TaskResult<TextToScrollingVideoResult>> {
  const { task_id } = await textToScrollingVideo(http, params)
  return waitForTask(http, task_id, pollOptions) as Promise<
    TaskResult<TextToScrollingVideoResult>
  >
}
