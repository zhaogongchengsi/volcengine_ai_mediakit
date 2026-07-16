# @zzhqux/volcengine-ai-mediakit

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

火山引擎 AI MediaKit 的 TypeScript SDK。

AI MediaKit 是火山引擎视频云推出的智能多媒体工具集，提供画质增强、视频理解、视频剪辑、音频处理等原子化媒体处理能力。本 SDK 封装了 MediaKit 的 HTTP API，提供类型安全、便捷的调用方式。

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

// 提交画质增强任务
const { task_id } = await client.enhanceVideo({
  video_url: 'https://example.com/video.mp4',
  resolution: '1080p', // 输出分辨率
  scene: 'aigc', // 业务场景（可选）
})

// 查询任务状态
const task = await client.getTask(task_id)
console.log(task.status) // 'pending' | 'running' | 'completed' | 'failed'

// 轮询等待任务完成
const result = await client.waitForTask(task_id, {
  interval: 2000, // 每 2 秒查一次
  timeout: 120_000, // 最多等 2 分钟
  onProgress: t => console.log(`进度: ${t.status}`),
})

console.log(result.result?.video_url)

// 或者一步到位：提交 + 等待
const result2 = await client.enhanceVideoAndWait(
  { video_url: '...', resolution: '1080p' },
  { timeout: 120_000 },
)
```

### 直接调用独立函数

```ts
import { enhanceVideo, getTask, HttpClient } from '@zzhqux/volcengine-ai-mediakit'

const http = new HttpClient()
http.setApiKey('your-api-key')

// 直接调用工具函数
const { task_id } = await enhanceVideo(http, { video_url: '...' })
const task = await getTask(http, task_id)
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

## API

### `new Mediakit(config)`

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `apiKey` | `string` | — | 火山引擎 AI MediaKit API Key（必需） |
| `baseURL` | `string` | `'https://mediakit.cn-beijing.volces.com'` | API 基础地址 |

### 实例方法

| 方法 | 返回 | 说明 |
|------|------|------|
| `getTask(taskId)` | `Promise\<TaskResult\>` | 查询任务状态和结果 |
| `waitForTask(taskId, options?)` | `Promise\<TaskResult\>` | 轮询等待任务完成 |
| `enhanceVideo(params)` | `Promise\<CreateTaskResponse\>` | 提交画质增强任务 |
| `enhanceVideoAndWait(params, options?)` | `Promise\<TaskResult\<EnhanceVideoResult\>\>` | 提交画质增强任务并等待完成 |

### `waitForTask` 选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `interval` | `number` | `3000` | 轮询间隔（毫秒） |
| `timeout` | `number` | `300000` | 超时时间（毫秒，5 分钟） |
| `onProgress` | `(task) => void` | — | 每次轮询的回调 |

### 画质增强参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `video_url` | `string` | 待处理视频的公网 URL |
| `scene` | `'aigc' \| 'short_series' \| 'ugc' \| 'old_film'` | 业务场景（仅 standard 版生效） |
| `tool_version` | `'standard' \| 'professional'` | 工具版本，默认 `standard` |
| `resolution` | `'720p' \| '1080p' \| '4k'` | 输出分辨率（与 `resolution_limit` 互斥） |
| `resolution_limit` | `number` | 短边像素限制 [64, 2160]（与 `resolution` 互斥） |
| `fps` | `number` | 输出帧率，最高 120 |

### 独立函数

除类实例方法外，所有功能均可通过独立函数直接调用：

```ts
import {
  enhanceVideo,
  enhanceVideoAndWait,
  getTask,
  HttpClient,
  waitForTask,
} from '@zzhqux/volcengine-ai-mediakit'

const http = new HttpClient()
http.setApiKey('xxx')

enhanceVideo(http, params)
enhanceVideoAndWait(http, params)
getTask(http, taskId)
waitForTask(http, taskId, options)
```

## 项目结构

```
src/
├── http/                 # 基础 HTTP 层
│   ├── index.ts          # HttpClient 传输层
│   └── types.ts          # ApiResponse 等 HTTP 类型
├── mediakit/             # 业务逻辑层
│   ├── index.ts          # Mediakit 主类 + 统一导出
│   ├── types.ts          # 领域类型定义
│   ├── base-client.ts    # getTask / waitForTask
│   └── tools/            # 各工具独立模块
│       └── enhance-video.ts  # 画质增强
└── index.ts              # 包入口
```

## License

[MIT](./LICENSE) License © [zhaogongchengsi](https://github.com/zhaogongchengsi)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@zzhqux/volcengine-ai-mediakit?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmx.dev/package/@zzhqux/@zzhqux/@zzhqux/volcengine-ai-mediakit
[npm-downloads-src]: https://img.shields.io/npm/dm/@zzhqux/@zzhqux/@zzhqux/volcengine-ai-mediakit?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmx.dev/package/@zzhqux/@zzhqux/@zzhqux/volcengine-ai-mediakit
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@zzhqux/@zzhqux/@zzhqux/volcengine-ai-mediakit?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@zzhqux/@zzhqux/@zzhqux/volcengine-ai-mediakit
[license-src]: https://img.shields.io/github/license/zhaogongchengsi/@zzhqux/@zzhqux/@zzhqux/volcengine-ai-mediakit.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/zhaogongchengsi/@zzhqux/@zzhqux/@zzhqux/volcengine-ai-mediakit/blob/main/LICENSE
