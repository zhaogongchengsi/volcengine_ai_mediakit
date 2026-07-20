# @zzhqux/volcengine-ai-mediakit

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

火山引擎 AI MediaKit 的 TypeScript SDK。

AI MediaKit 是火山引擎视频云推出的智能多媒体工具集，提供画质增强、视频理解、视频剪辑（拼接/裁剪/变速/滤镜/字幕/旋转/翻转）、音频处理等原子化媒体处理能力。本 SDK 完整封装了 MediaKit 的 HTTP API，提供类型安全、便捷的调用方式。

## 安装

```bash
npm install @zzhqux/volcengine-ai-mediakit
```

```bash
pnpm add @zzhqux/volcengine-ai-mediakit
```

## 快速开始

### 使用 Mediakit 类（推荐）

```ts
import { Mediakit } from '@zzhqux/volcengine-ai-mediakit'

const client = new Mediakit({
  apiKey: 'your-api-key',
  // baseURL: 'https://mediakit.cn-beijing.volces.com',  // 可选，有默认值
})

// 提交任务
const { task_id } = await client.enhanceVideo({
  video_url: 'https://example.com/video.mp4',
  resolution: '1080p',
})

// 查询任务状态
const task = await client.getTask(task_id)
console.log(task.status) // 'pending' | 'running' | 'completed' | 'failed'

// 轮询等待完成
const result = await client.waitForTask(task_id, {
  interval: 2000,
  timeout: 120_000,
  onProgress: t => console.log(`进度: ${t.status}`),
})

console.log(result.result?.video_url)

// 或一步到位：提交 + 自动轮询
const clip = await client.concatVideoAndWait(
  { video_urls: ['https://.../1.mp4', 'https://.../2.mp4'] },
  { timeout: 120_000 },
)
```

### 更多示例

```ts
// 视频剪辑
await client.trimVideo({ video_url: '...', start_time: 10, end_time: 20 })
await client.flipVideo({ video_url: '...', is_flip_horizontal: true })
await client.rotateVideo({ video_url: '...', rotation_angle: 90 })
await client.cropVideo({ video_url: '...', crop_x: 0, crop_y: 0, crop_width: 720, crop_height: 480 })
await client.addSubtitleToVideo({ video_url: '...', subtitles: [{ subtitle_text: '你好', start_time: 0, end_time: 3 }] })

// 音频处理
await client.separateVoice({ video_url: '...' })
await client.detectVoiceActivity({ audio_url: '...' })
await client.transcodeAudio({ audio_url: '...', container_format: 'MP3' })

// 视频分析
await client.segmentScenes({ video_url: '...' })
await client.asrSubtitles({ video_url: '...' })
await client.videoOcr({ video_url: '...' })

// 视频增强（大模型）
await client.enhanceVideoGenerative({ video_url: '...', resolution: '2k' })

// 绿幕抠图 / 人像抠图 / 人脸打码
await client.matteGreenscreenVideo({ video_url: '...' })
await client.mattePortraitVideo({ video_url: '...' })
await client.faceBlurVideo({ video_url: '...' })

// 智能编辑
await client.vibeEditing({ content: [{ type: 'text', text: '制作一个30秒的Vlog' }] })

// 文字滚屏视频
await client.textToScrollingVideo({ text: '你好世界', image_url: '...' })
```

所有 `fn(params)` 方法都有对应的 `fnAndWait(params, options?)` 版本，一步完成提交 + 等待。

## API 一览

### `new Mediakit(config)`

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `apiKey` | `string` | — | 火山引擎 AI MediaKit API Key（必需） |
| `baseURL` | `string` | `'https://mediakit.cn-beijing.volces.com'` | API 基础地址 |

### 通用方法

| 方法 | 说明 |
|------|------|
| `getTask(taskId)` | 查询任务状态和结果 |
| `waitForTask(taskId, options?)` | 轮询等待任务完成 |

**`waitForTask` 选项：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `interval` | `number` | `3000` | 轮询间隔（毫秒） |
| `timeout` | `number` | `300000` | 超时时间（毫秒，5 分钟） |
| `onProgress` | `(task) => void` | — | 每次轮询的回调 |

### 视频/音频编辑

| 类别 | 方法 | API 端点 |
|------|------|----------|
| **视频拼接** | `concatVideo` | `concat-video` |
| **音频拼接** | `concatAudio` | `concat-audio` |
| **视频裁剪** | `trimVideo` | `trim-video` |
| **音频裁剪** | `trimAudio` | `trim-audio` |
| **视频变速** | `adjustVideoSpeed` | `adjust-video-speed` |
| **音频变速** | `adjustAudioSpeed` | `adjust-audio-speed` |
| **视频提取音频** | `extractAudio` | `extract-audio` |
| **音视频合成** | `muxAudioVideo` | `mux-audio-video` |
| **图片转视频** | `imageToVideo` | `image-to-video` |
| **音频混音** | `mixAudio` | `mix-audio` |
| **音频淡入淡出** | `fadeAudio` | `fade-audio` |
| **视频翻转** | `flipVideo` | `flip-video` |
| **视频旋转** | `rotateVideo` | `rotate-video` |
| **视频裁剪画面** | `cropVideo` | `crop-video` |
| **视频拼接画面** | `stitchVideo` | `stitch-video` |
| **添加字幕** | `addSubtitleToVideo` | `add-subtitle-to-video` |
| **添加图片叠加** | `addImageToVideo` | `add-image-to-video` |
| **视频滤镜** | `applyVideoFilter` | `apply-video-filter` |
| **提取动图** | `extractAnimatedImage` | `extract-animated-image` |
| **视频高斯模糊** | `gaussianBlurVideo` | `gaussian-blur-video` |

### 画质增强

| 方法 | 说明 |
|------|------|
| `enhanceVideo` | 画质增强（standard / professional） |
| `enhanceVideoGenerative` | 画质增强（大模型） |

### 视频分析

| 方法 | 说明 |
|------|------|
| `segmentScenes` | 场景分割 |
| `asrSubtitles` | 语音识别（ASR） |
| `videoOcr` | 视频 OCR |
| `analyzeVideoStoryline` | 故事情节分析 |

### 视频处理

| 方法 | 说明 |
|------|------|
| `extractFrames` | 视频抽帧 |
| `martencodeVideo` | 极智超清 |
| `remuxVideo` | 视频重封装 |
| `assessVideoQuality` | VQScore 质量评估 |
| `probeVideoMetadata` | 视频元数据探测 |

### 视频高光

| 方法 | 说明 |
|------|------|
| `generateHighlightsMicrodrama` | 微短剧高光 |
| `generateHighlightsMinigame` | 小游戏高光 |
| `generateHighlightsMovie` | 影视高光 |
| `analyzeVideoHighlights` | 智能高光片段分析 |

### 视频蒙版与水印

| 方法 | 说明 |
|------|------|
| `matteGreenscreenVideo` | 视频绿幕抠图 |
| `mattePortraitVideo` | 视频人像抠图 |
| `addVideoInvisibleWatermark` | 视频暗水印添加 |
| `extractVideoInvisibleWatermark` | 视频暗水印提取 |
| `faceBlurVideo` | 视频人脸打码 |

### 字幕擦除

| 方法 | 说明 |
|------|------|
| `eraseVideoSubtitlePro` | 智能字幕擦除 |
| `eraseVideoSubtitleStandard` | 标准字幕擦除 |

### 视频理解 / 剧情理解

| 方法 | 说明 |
|------|------|
| `videoUnderstand` | 视频理解（高光/分析） |
| `dramaRecap` | 短剧剧情理解 |
| `dramaRecapVertical` | 竖屏短剧剧情理解 |
| `dramaScript` | 短剧脚本理解分析 |

### 音频工具

| 方法 | 说明 |
|------|------|
| `separateVoice` | 人声分离 |
| `detectVoiceActivity` | 语音活动检测（VAD） |
| `transcodeAudio` | 音频转码 |
| `probeAudioMetadata` | 音频元数据探测 |

### 智能/创意工具

| 方法 | 说明 |
|------|------|
| `vibeEditing` | 智能编辑（Vibe Editing） |
| `textToScrollingVideo` | 文字滚屏视频 |

### 独立函数

所有功能也可通过独立函数直接调用（第一个参数传入 `HttpClient`）：

```ts
import { concatVideo, enhanceVideo, HttpClient } from '@zzhqux/volcengine-ai-mediakit'

const http = new HttpClient()
http.setApiKey('your-api-key')

const { task_id } = await enhanceVideo(http, { video_url: '...' })
const { task_id: cid } = await concatVideo(http, { video_urls: ['...'] })
```

### 低层级 HTTP 客户端

```ts
import { http, setApiKey } from '@zzhqux/volcengine-ai-mediakit'

setApiKey('your-api-key')

const res = await http.post('/api/v1/tools/enhance-video', {
  video_url: 'https://...',
  resolution: '1080p',
})
```

## 项目结构

```
src/
├── http/                     # 基础 HTTP 层
│   ├── index.ts              # HttpClient 传输层
│   └── types.ts              # ApiResponse 等 HTTP 类型
├── mediakit/                 # 业务逻辑层
│   ├── index.ts              # Mediakit 主类 + 统一导出
│   ├── types.ts              # 领域类型定义
│   ├── base-client.ts        # getTask / waitForTask
│   └── tools/                # 各工具独立模块
│       ├── audio-tools.ts               # 音频处理
│       ├── drama-recap.ts               # 短剧剧情理解
│       ├── drama-recap-vertical.ts       # 竖屏短剧剧情理解
│       ├── drama-script.ts              # 短剧脚本分析
│       ├── edit-basic.ts                # 视频/音频编辑基础操作
│       ├── edit-transform.ts            # 视频编辑变换操作
│       ├── enhance-video.ts             # 画质增强
│       ├── erase-video-subtitle.ts      # 字幕擦除
│       ├── text-to-scrolling-video.ts   # 文字滚屏视频
│       ├── vibe-editing.ts             # 智能编辑
│       ├── video-analysis.ts            # 视频分析
│       ├── video-enhance.ts             # 画质增强（大模型）
│       ├── video-highlights.ts          # 视频高光
│       ├── video-matte-watermark.ts     # 绿幕抠图/暗水印/人脸打码
│       ├── video-processing.ts          # 视频处理（抽帧/超清/重封装）
│       └── video-understand.ts          # 视频理解
└── index.ts                  # 包入口
```

## License

[MIT](./LICENSE) License © [zhaogongchengsi](https://github.com/zhaogongchengsi)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@zzhqux/volcengine-ai-mediakit?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@zzhqux/volcengine-ai-mediakit
[npm-downloads-src]: https://img.shields.io/npm/dm/@zzhqux/volcengine-ai-mediakit?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@zzhqux/volcengine-ai-mediakit
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@zzhqux/volcengine-ai-mediakit?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@zzhqux/volcengine-ai-mediakit
[license-src]: https://img.shields.io/github/license/zhaogongchengsi/volcengine_ai_mediakit.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/zhaogongchengsi/volcengine_ai_mediakit/blob/main/LICENSE
