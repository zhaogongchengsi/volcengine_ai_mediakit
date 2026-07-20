# 火山引擎 AI MediaKit 全量任务 API 清单

> 整理时间：2026-07-20
> 数据来源：火山引擎官方文档（[智能处理](https://www.volcengine.com/docs/6448)）
> 覆盖范围：AI MediaKit 多媒体工具集已上线全部工具的 task_type、请求路径、请求参数
> task_type 取值规则：以请求路径最后一段为依据（如 `/api/v1/tools/trim-video` → `trim-video`）

---

## 一、通用约定

### 1.1 服务地址

| 接口类型 | Base URL |
| --- | --- |
| 异步任务接口 | `https://mediakit.cn-beijing.volces.com` |
| 同步任务接口 | `https://mediakit.cn-beijing.volces.com` |
| 视频理解 Chat API | `https://amk-ark.cn-beijing.volces.com` |

### 1.2 鉴权

所有接口需在 Header 携带：

```
Authorization: Bearer {Your_API_Key}
Content-Type: application/json
```

> 视频理解拓展工具的鉴权格式特殊：`Bearer {火山方舟API_Key}/{MediaKit_API_Key}`（两个 Key 用英文斜杠拼接）。

### 1.3 通用请求参数

以下 5 个参数在**所有异步任务接口**（`/api/v1/tools/*`）中均可用，格式一致，后续各工具不再重复列出：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `media_output_destination` | String | 否 | 产物存储位置。`vod://<空间名>` 存至视频点播；`tos://<桶名>` 存至对象存储。设置后结果返回 `vod://` 或 `tos://` 地址，不再返回临时下载链接。首次使用需在控制台授权 |
| `client_token` | String | 否 | 幂等控制凭证，大小写敏感，≤64 个 ASCII 可打印字符 |
| `callback_args` | String | 否 | 自定义回调参数，任务完成时通过事件回调原样返回，≤512 字节 |
| `callback_url` | String | 否 | 接收任务结果回调的 URL，以 `http://` 或 `https://` 开头，优先级高于全局回调地址 |
| `queue_id` | String | 否 | 任务提交的目标队列 ID，用于按项目分账。不传则使用系统默认队列 |

### 1.4 通用响应字段（任务提交）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `success` | Boolean | 任务是否提交成功 |
| `task_id` | String | 任务唯一标识 |
| `request_id` | String | 请求唯一标识，用于排查 |

### 1.5 异步任务查询

```http
GET https://mediakit.cn-beijing.volces.com/api/v1/tasks/{task_id}
```

任务状态 `status`：`running`（处理中）/ `completed`（成功）/ `failed`（失败）。结果默认保留 24 小时。

### 1.6 接口类型说明

| 类型 | 路径特征 | 调用方式 |
| --- | --- | --- |
| 异步任务 | `/api/v1/tools/*` | 提交返回 task_id，轮询查询结果 |
| 同步任务 | `/api/v1/tools-sync/*` | 请求即返回结果，无需轮询 |
| Chat API | `/api/v1/chat/completions` | 同步返回，兼容方舟协议 |

---

## 二、全量 task_type 速查表

> 共统计 **63 个 API 接口**（含子工具），按工具分类排列。标注「推测」的为官方 API 文档页面内容为空，依据命名约定推断。

### 2.1 视频工具（22 个 API）

| # | 工具名称 | task_type | HTTP | 请求路径 | 接口类型 |
| --- | --- | --- | --- | --- | --- |
| 1 | 画质增强（大模型） | `enhance-video-generative` | POST | `/api/v1/tools/enhance-video-generative` | 异步 |
| 2 | 画质增强（标准版/专业版） | `enhance-video` | POST | `/api/v1/tools/enhance-video` | 异步 |
| 3 | 画质增强（极速版） | `enhance-video-fast` | POST | `/api/v1/tools/enhance-video-fast` | 异步 |
| 4 | 字幕擦除（标准版） | `erase-video-subtitle` | POST | `/api/v1/tools/erase-video-subtitle` | 异步 |
| 5 | 字幕擦除（精细化版） | `erase-video-subtitle-pro` | POST | `/api/v1/tools/erase-video-subtitle-pro` | 异步 |
| 6 | 视频理解智能策略 | `video-understand-router` | POST | `/api/v1/tools/video-understand-router` | 异步 |
| 7 | 场景切分 | `segment-scenes` | POST | `/api/v1/tools/segment-scenes` | 异步 |
| 8 | 语音转字幕（ASR） | `asr-subtitles` | POST | `/api/v1/tools/asr-subtitles` | 异步 |
| 9 | 视频识别字幕（OCR） | `video-ocr` | POST | `/api/v1/tools/video-ocr` | 异步 |
| 10 | 高光智剪-短剧 | `generate-highlights-microdrama` | POST | `/api/v1/tools/generate-highlights-microdrama` | 异步 |
| 11 | 高光智剪-小游戏 | `generate-highlights-minigame` | POST | `/api/v1/tools/generate-highlights-minigame` | 异步 |
| 12 | 高光智剪-影视拆条 | `generate-highlights-movie` | POST | `/api/v1/tools/generate-highlights-movie` | 异步 |
| 13 | 高光片段提取 | `analyze-video-highlights` | POST | `/api/v1/tools/analyze-video-highlights` | 异步 |
| 14 | 视频绿幕抠图 | `matte-greenscreen-video` | POST | `/api/v1/tools/matte-greenscreen-video` | 异步 |
| 15 | 视频人像抠图 | `matte-portrait-video` | POST | `/api/v1/tools/matte-portrait-video` | 异步 |
| 16 | 剧情故事线分析 | `analyze-video-storyline` | POST | `/api/v1/tools/analyze-video-storyline` | 异步 |
| 17 | 剧本还原 | `drama-script` | POST | `/api/v1/tools/drama-script` | 异步 |
| 18 | 解说视频生成 | `drama-recap` | POST | `/api/v1/tools/drama-recap` | 异步 |
| 19 | 解说视频生成（短剧行业模型） | `drama-recap-vertical` | POST | `/api/v1/tools/drama-recap-vertical` | 异步 |
| 20 | 视频抽帧 | `extract-frames` | POST | `/api/v1/tools/extract-frames` | 异步 |
| 21a | 视频暗水印添加 | `add-video-invisible-watermark` | POST | `/api/v1/tools/add-video-invisible-watermark` | 异步 |
| 21b | 视频暗水印提取 | `extract-video-invisible-watermark` | POST | `/api/v1/tools/extract-video-invisible-watermark` | 异步 |
| 22 | 视频人脸打码 | `face-blur-video` | POST | `/api/v1/tools/face-blur-video` | 异步 |
| 23 | 视频转码 | `encode-video`（推测） | POST | `/api/v1/tools/encode-video`（推测） | 异步 |
| 24 | 极智超清 | `martencode-video` | POST | `/api/v1/tools/martencode-video` | 异步 |
| 25 | 视频转封装 | `remux-video` | POST | `/api/v1/tools/remux-video` | 异步 |
| 26 | 视频画质检测 VQScore | `assess-video-quality` | POST | `/api/v1/tools/assess-video-quality` | 异步 |
| 27 | 视频元信息获取 | `probe-video-metadata` | POST | `/api/v1/tools/probe-video-metadata` | 异步 |

### 2.2 图像工具（24 个 API，含图像基础编辑 12 个子工具）

| # | 工具名称 | task_type | HTTP | 请求路径 | 接口类型 |
| --- | --- | --- | --- | --- | --- |
| 1 | 图像画质增强 | `enhance-image` | POST | `/api/v1/tools-sync/enhance-image` | 同步 |
| 2 | 图像画质评估 | `evaluate-image-quality` | POST | `/api/v1/tools-sync/evaluate-image-quality` | 同步 |
| 3 | 图像人脸打码 | `face-blur-image` | POST | `/api/v1/tools-sync/face-blur-image` | 同步 |
| 4 | 图像背景移除（智能抠图） | `remove-image-background` | POST | `/api/v1/tools-sync/remove-image-background` | 同步 |
| 5 | 图像擦除修复 | `erase-image` | POST | `/api/v1/tools-sync/erase-image` | 同步 |
| 6 | 图像文字识别（OCR） | `image-ocr` | POST | `/api/v1/tools-sync/image-ocr` | 同步 |
| 7 | 图像智能裁剪 | `smart-crop-image` | POST | `/api/v1/tools-sync/smart-crop-image` | 同步 |
| 8 | 智能扩图 | `expand-image-canvas` | POST | `/api/v1/tools-sync/expand-image-canvas` | 同步 |
| 9 | 集智瘦身 | `slim-image` | POST | `/api/v1/tools-sync/slim-image` | 同步 |
| 10 | 图像翻译 | `translate-image-text` | POST | `/api/v1/tools-sync/translate-image-text` | 同步 |
| 11 | 电商牛皮癣擦除 | `remove-image-elements` | POST | `/api/v1/tools-sync/remove-image-elements` | 同步 |
| 12 | 电商万创（商品场景图生成） | `generate-product-scene-image` | POST | `/api/v1/tools-sync/generate-product-scene-image` | 同步 |
| 13.1 | 图像基础编辑-圆角矩形 | `round-corner-image` | POST | `/api/v1/tools-sync/round-corner-image` | 同步 |
| 13.2 | 图像基础编辑-图像旋转 | `rotate-image` | POST | `/api/v1/tools-sync/rotate-image` | 同步 |
| 13.3 | 图像基础编辑-图像翻转 | `flip-image` | POST | `/api/v1/tools-sync/flip-image` | 同步 |
| 13.4 | 图像基础编辑-图像锐化 | `sharpen-image` | POST | `/api/v1/tools-sync/sharpen-image` | 同步 |
| 13.5 | 图像基础编辑-图像高斯模糊 | `gaussian-blur-image` | POST | `/api/v1/tools-sync/gaussian-blur-image` | 同步 |
| 13.6 | 图像基础编辑-图像打码 | `mosaic-image` | POST | `/api/v1/tools-sync/mosaic-image` | 同步 |
| 13.7 | 图像基础编辑-添加图文水印 | `add-image-watermark` | POST | `/api/v1/tools-sync/add-image-watermark` | 同步 |
| 13.8 | 图像基础编辑-图像调整 | `adjust-image-color` | POST | `/api/v1/tools-sync/adjust-image-color` | 同步 |
| 13.9 | 图像基础编辑-图像缩放 | `scale-image` | POST | `/api/v1/tools-sync/scale-image` | 同步 |
| 13.10 | 图像基础编辑-图像负片 | `invert-image` | POST | `/api/v1/tools-sync/invert-image` | 同步 |
| 13.11 | 图像基础编辑-图像裁剪 | `crop-image` | POST | `/api/v1/tools-sync/crop-image` | 同步 |
| 13.12 | 图像基础编辑-图像压缩 | `compress-image` | POST | `/api/v1/tools-sync/compress-image` | 同步 |

### 2.3 剪辑工具（18 个 API）

| # | 工具名称 | task_type | HTTP | 请求路径 | 接口类型 |
| --- | --- | --- | --- | --- | --- |
| 1 | 智能剪辑 Vibe Editing | `vibe-editing` | POST | `/api/v1/tools/vibe-editing` | 异步 |
| 2 | 视频拼接 | `concat-video` | POST | `/api/v1/tools/concat-video` | 异步 |
| 3 | 音频拼接 | `concat-audio` | POST | `/api/v1/tools/concat-audio` | 异步 |
| 4 | 视频裁剪 | `trim-video` | POST | `/api/v1/tools/trim-video` | 异步 |
| 5 | 音频裁剪 | `trim-audio` | POST | `/api/v1/tools/trim-audio` | 异步 |
| 6 | 视频调速 | `adjust-video-speed` | POST | `/api/v1/tools/adjust-video-speed` | 异步 |
| 7 | 音频调速 | `adjust-audio-speed` | POST | `/api/v1/tools/adjust-audio-speed` | 异步 |
| 8 | 音频提取 | `extract-audio` | POST | `/api/v1/tools/extract-audio` | 异步 |
| 9 | 音视频合成 | `mux-audio-video` | POST | `/api/v1/tools/mux-audio-video` | 异步 |
| 10 | 图片转视频 | `image-to-video` | POST | `/api/v1/tools/image-to-video` | 异步 |
| 11 | 音频混合 | `mix-audio` | POST | `/api/v1/tools/mix-audio` | 异步 |
| 12 | 音频声音淡入淡出 | `fade-audio` | POST | `/api/v1/tools/fade-audio` | 异步 |
| 13 | 调整视频音量 | `adjust-video-volume`（推测） | POST | `/api/v1/tools/adjust-video-volume`（推测） | 异步 |
| 14 | 视频画面翻转 | `flip-video` | POST | `/api/v1/tools/flip-video` | 异步 |
| 15 | 视频画面旋转 | `rotate-video` | POST | `/api/v1/tools/rotate-video` | 异步 |
| 16 | 视频画面裁剪 | `crop-video` | POST | `/api/v1/tools/crop-video` | 异步 |
| 17 | 视频画面拼接 | `stitch-video` | POST | `/api/v1/tools/stitch-video` | 异步 |
| 18 | 视频加字幕 | `add-subtitle-to-video` | POST | `/api/v1/tools/add-subtitle-to-video` | 异步 |
| 19 | 视频加图片 | `add-image-to-video` | POST | `/api/v1/tools/add-image-to-video` | 异步 |
| 20 | 视频添加滤镜 | `apply-video-filter` | POST | `/api/v1/tools/apply-video-filter` | 异步 |
| 21 | 视频截取动图 | `extract-animated-image` | POST | `/api/v1/tools/extract-animated-image` | 异步 |
| 22 | 视频高斯模糊 | `gaussian-blur-video` | POST | `/api/v1/tools/gaussian-blur-video` | 异步 |
| 23 | 文字生成滚屏视频 | `text-to-scrolling-video` | POST | `/api/v1/tools/text-to-scrolling-video` | 异步 |

### 2.4 音频工具（5 个 API）

| # | 工具名称 | task_type | HTTP | 请求路径 | 接口类型 |
| --- | --- | --- | --- | --- | --- |
| 1 | 人声背景音分离 | `separate-voice` | POST | `/api/v1/tools/separate-voice` | 异步 |
| 2 | 语音端点识别 | `detect-voice-activity` | POST | `/api/v1/tools/detect-voice-activity` | 异步 |
| 3 | 音频转码 | `transcode-audio` | POST | `/api/v1/tools/transcode-audio` | 异步 |
| 4 | 音频元信息获取 | `probe-audio-metadata` | POST | `/api/v1/tools/probe-audio-metadata` | 异步 |
| 5 | 音频混合 | `mix-audio` | POST | `/api/v1/tools/mix-audio` | 异步 |

### 2.5 大模型处理工具（1 个 API）

| # | 工具名称 | task_type | HTTP | 请求路径 | 接口类型 |
| --- | --- | --- | --- | --- | --- |
| 1 | 视频理解拓展工具 | 不适用（Chat API） | POST | `/api/v1/chat/completions` | 同步 |

---

## 三、各工具请求参数详解

> 以下仅列出各工具的**业务参数**（独有参数）。通用参数（`media_output_destination`、`client_token`、`callback_args`、`callback_url`、`queue_id`）已统一在第一章说明，不再重复。

---

### 第一部分：视频工具

---

#### 1. 画质增强（大模型）

- **task_type**：`enhance-video-generative`
- **请求路径**：`POST /api/v1/tools/enhance-video-generative`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待增强视频 URL。支持 `https://`、`mediakit://`、`vod://`、`tos://`。格式：mp4、flv、ts、avi、mov、wmv、mkv。输入限制：最高 1080p，短边 [360,1080]，长边 [360,1920]，仅支持 SDR |
| `resolution` | String | 否 | 目标分辨率。`720p`（默认）/ `1080p` / `2k` |
| `bitrate_level` | String | 否 | 目标码率档位。`low` / `medium`（默认，推荐）/ `high` |
| `fps` | Number | 否 | 目标帧率。取值范围 [15, 120]。建议不超过原片 4 倍。未指定则保持原片帧率 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 增强后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频总时长（秒） |
| `resolution` | String | 输出视频分辨率 |
| `fps` | Number | 输出视频帧率 |

---

#### 2. 画质增强（标准版/专业版）

- **task_type**：`enhance-video`
- **请求路径**：`POST /api/v1/tools/enhance-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待增强视频 URL。输入最高 2K，建议 ≤10 GB |
| `tool_version` | String | 否 | `standard`（默认，10+ 算法）/ `professional`（30+ 算法，效果优先） |
| `scene` | String | 否 | 场景预设，**仅 standard 生效**。`common`（默认）/ `ugc` / `short_series` / `aigc` / `old_film` |
| `resolution` | String | 否 | 目标分辨率档位：`240p`/`360p`/`480p`/`540p`/`720p`/`1080p`/`2k`/`4k`。与 `resolution_limit` 互斥 |
| `resolution_limit` | Integer | 否 | 目标短边像素限制，范围 [128, 2160]，等比缩放。与 `resolution` 互斥 |
| `bitrate_level` | String | 否 | 目标码率档位。`low` / `medium`（默认，推荐）/ `high` |
| `fps` | Number | 否 | 目标帧率，范围 [15, 120]，建议不超过原片 4 倍。未指定则保持原片帧率 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 增强后视频地址，有效期 24 小时 |
| `duration` | Number | 输出视频总时长（秒） |
| `resolution` | String | 输出视频分辨率 |
| `fps` | Number | 输出视频帧率 |
| `tool_version` | String | 任务实际使用的工具版本 |

---

#### 3. 字幕擦除（标准版）

- **task_type**：`erase-video-subtitle`
- **请求路径**：`POST /api/v1/tools/erase-video-subtitle`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待擦除字幕的视频 URL。输入最高 2K，输出最高 1080P |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 擦除字幕后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频总时长（秒） |

---

#### 4. 字幕擦除（精细化版）

- **task_type**：`erase-video-subtitle-pro`
- **请求路径**：`POST /api/v1/tools/erase-video-subtitle-pro`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待擦除字幕的视频 URL。输入最高 2K，输出最高 1080P |
| `mode` | String | 否 | 擦除模式。`Subtitle`（默认，仅擦除 OCR 检测为字幕的文本）/ `Text`（擦除所有文本，含人名地名） |
| `output_encode_mode` | String | 否 | 输出编码模式。`Quality`（默认，画质优先）/ `Size`（大小优先） |
| `erase_ratio_location` | Array&lt;Object&gt; | 否 | 手动指定擦除区域，最多 20 个。坐标为相对视频宽高的比例（0.0~1.0） |

**`erase_ratio_location` 元素结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `top_left_x` | Number | 是 | 矩形左上角 X 坐标（比例） |
| `top_left_y` | Number | 是 | 矩形左上角 Y 坐标（比例） |
| `bottom_right_x` | Number | 是 | 矩形右下角 X 坐标（比例） |
| `bottom_right_y` | Number | 是 | 矩形右下角 Y 坐标（比例） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 擦除字幕后视频地址，有效期 24 小时 |
| `duration` | Number | 输出视频总时长（秒） |

---

#### 5. 视频理解智能策略

- **task_type**：`video-understand-router`
- **请求路径**：`POST /api/v1/tools/video-understand-router`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_urls` | Array&lt;String&gt; | 是 | 视频 URL 列表，最多 10 个，单个视频 ≤2 小时 |
| `prompt` | String | 是 | 提示词，自然语言描述分析目标，最小长度 1 |
| `level` | String | 否 | 分析档位。`Economy`（默认，速度优先）/ `Balanced`（均衡）/ `Quality`（质量优先） |
| `prefer_models` | Array&lt;String&gt; | 否 | 优先使用的模型 ID 列表，最多 10 个 |
| `prefer_endpoints` | Array&lt;String&gt; | 否 | 优先使用的推理接入点 ID 列表，最多 10 个，优先级高于 `prefer_models` |
| `manual_option` | Object | 否 | 手动模式参数，未传时使用 level 档位策略 |

**`manual_option` 结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `max_snapshot_number` | Integer | 否 | 最大截图帧数，范围 [0, 1000]，默认 0（由 level 决定） |
| `need_audio` | Boolean | 否 | 是否识别音频，默认 false。true 强制开启音频分析 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `duration` | Number | 输入视频总时长（秒） |
| `contents` | Array&lt;String&gt; | 视频内容分析结果列表，与 video_urls 索引对应 |
| `token_usage` | Object | Token 使用统计 |
| `token_usage.input_tokens` | Integer | 输入 Token 数 |
| `token_usage.output_tokens` | Integer | 输出 Token 数 |
| `token_usage.total_tokens` | Integer | 总 Token 数 |

---

#### 6. 场景切分

- **task_type**：`segment-scenes`
- **请求路径**：`POST /api/v1/tools/segment-scenes`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待处理视频 URL。视频时长 ≤2 小时 |
| `segment_threshold` | Number | 否 | 场景切分敏感度阈值，范围 [0, 100)。越低越敏感（切片越多） |
| `min_duration` | Number | 否 | 单个切片最小时长（秒），默认 3 |
| `max_duration` | Number | 否 | 单个切片最大时长（秒），默认 30 |
| `enable_clip_fade` | Boolean | 否 | 是否将淡入/淡出片段作为独立切片输出，默认 false |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `duration` | Number | 输入视频总时长（秒） |
| `segments` | Array | 切片信息列表 |

**`segments` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `start_time` | Number | 起始时间（秒） |
| `end_time` | Number | 结束时间（秒） |
| `segment_video_url` | String | 切片视频地址（MP4），24 小时有效 |

---

#### 7. 语音转字幕（ASR）

- **task_type**：`asr-subtitles`
- **请求路径**：`POST /api/v1/tools/asr-subtitles`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 条件必选 | 待处理视频 URL。时长 ≤3 小时。与 `audio_url` 二选一，都有时优先 `video_url` |
| `audio_url` | String | 条件必选 | 待处理音频 URL。时长 ≤3 小时。与 `video_url` 二选一 |
| `content_type` | String | 否 | 识别内容类型，留空自动探测。`speech`（普通说话）/ `singing`（唱歌） |
| `language` | String | 否 | 识别语种，留空自动探测。`cmn-Hans-CN`（简体中文）/ `eng-US`（英语） |
| `enable_speaker_info` | Boolean | 否 | 是否开启说话人识别，默认 false |
| `enable_confidence` | Boolean | 否 | 是否返回置信度，默认 false |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `duration` | Number | 输入音视频总时长（秒） |
| `subtitles` | Array | 字幕片段列表 |

**`subtitles` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `subtitle_text` | String | 字幕文本 |
| `start_time` | Number | 起始时间（秒） |
| `end_time` | Number | 结束时间（秒） |
| `speaker` | String | 说话人标识（仅 `enable_speaker_info=true` 时返回） |
| `confidence` | Number | 置信度 [0, 1]（仅 `enable_confidence=true` 时返回） |

---

#### 8. 视频识别字幕（OCR）

- **task_type**：`video-ocr`
- **请求路径**：`POST /api/v1/tools/video-ocr`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待识别视频 URL。时长 ≤10 分钟，分辨率 240p~4K |
| `mode` | String | 否 | 工作模式。`Subtitle`（默认，仅识别字幕）/ `Detailed`（识别字幕+水印+台标+标题等） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `duration` | Number | 输入视频总时长（秒） |
| `subtitles` | Array | 字幕片段列表 |

**`subtitles` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `subtitle_text` | String | 字幕文本 |
| `start_time` | Number | 起始时间（秒） |
| `end_time` | Number | 结束时间（秒） |
| `text_label` | String | 文本标签（仅 Detailed 模式）：`Subtitle` / `Others` |
| `text_location` | Object | 文本像素坐标（仅 Detailed 模式） |

**`text_location` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `top_left_x` | Integer | 左上角 X 坐标（px） |
| `top_left_y` | Integer | 左上角 Y 坐标（px） |
| `bottom_right_x` | Integer | 右下角 X 坐标（px） |
| `bottom_right_y` | Integer | 右下角 Y 坐标（px） |

---

#### 9. 高光智剪-短剧

- **task_type**：`generate-highlights-microdrama`
- **请求路径**：`POST /api/v1/tools/generate-highlights-microdrama`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_urls` | Array | 是 | 短剧原片视频 URL 列表，最多 30 个，累计 ≤45 分钟，最高 1080p。须含中文字幕+中文对话音频 |
| `mode` | String | 是 | 固定 `StorylineCuts`（故事线混剪模式） |
| `enable_generate_video` | Boolean | 否 | 是否生成混剪视频，默认 true |
| `enable_return_poster` | Boolean | 否 | 是否返回封面图 URL，默认 false |
| `edit_param` | Object | 否 | 剪辑配置 |
| `highlight_cuts_param` | Object | 否 | 高光智剪配置 |
| `opening_hook_param` | Object | 否 | 开场钩子配置 |
| `video_ending_mode` | String | 否 | 结尾选取模式。`ReuseMainEnding`（默认，复用正片结尾）/ `SmartSelect`（智能选取） |
| `enable_segment_tag` | Boolean | 否 | 是否返回标签，默认 false |

**`edit_param` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mode` | String | `BasicEdit`（基础剪辑）/ `TemplateEdit`（模板剪辑） |
| `template_edit` | Object | 模板剪辑参数：`template`（热门短剧1~5）、`title`（≤22 字符）、`hint`（≤20 字符） |

**`highlight_cuts_param` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable_storyboard` | Boolean | 是否返回分镜信息，默认 false |
| `min_duration` | Number | 最短时长（秒），默认 30 |
| `max_duration` | Number | 最长时长（秒），默认 180 |
| `max_number` | Integer | 最大片段数，默认 6 |
| `cut_mode` | String | `Mixed`（混剪，默认）/ `Sequential`（顺剪） |
| `highlight_segment_prompt` | String | 高光片段提示词 |
| `highlight_start_prompt` | String | 开场提示词 |
| `highlight_ending_prompt` | String | 结尾提示词 |
| `user_preferred_segments` | Array | 用户偏好片段列表（含 `episode`、`start_time`、`end_time`） |

**`opening_hook_param` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enable_opening_hook` | Boolean | 是否启用开场钩子，默认 true |
| `min_duration` | Number | 最短总时长（秒），默认 5 |
| `max_duration` | Number | 最大总时长（秒），默认 15 |
| `min_clip_duration` | Number | 单片段最短时长（秒），默认 5 |
| `min_score` | Number | 最低评分 [1, 5]，默认 3 |
| `opening_hook_prompt` | String | 开场钩子提示词 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `duration` | Number | 输入视频总时长（秒） |
| `video_urls` | Array | 混剪视频地址列表 |
| `mixvideo_info` | Array | 混剪视频详情列表 |
| `storyboard_info` | Array | 分镜信息列表（仅 `enable_storyboard=true`） |

**`mixvideo_info` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mixvideo_index` | Integer | 混剪视频索引 |
| `duration` | Number | 时长（秒） |
| `size` | Integer | 文件大小（字节） |
| `poster_url` | String | 封面图 URL（仅 `enable_return_poster=true`） |
| `video_url` | String | 视频地址 |
| `clips` | Array | 片段列表 |

**`clips` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `clip_type` | String | `HighlightClip` / `OpeningHook` |
| `score` | Number | 评分 [1, 5] |
| `source_video_index` | Integer | 源视频索引 |
| `source_start_time` | Number | 源视频起始时间（秒） |
| `source_end_time` | Number | 源视频结束时间（秒） |
| `cut_start_time` | Number | 混剪视频起始时间（秒） |
| `cut_end_time` | Number | 混剪视频结束时间（秒） |
| `tags` | Array | 标签列表（仅 `enable_segment_tag=true`） |

**`storyboard_info` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `source_video_index` | Integer | 源视频索引 |
| `start_time` | Number | 起始时间（秒） |
| `end_time` | Number | 结束时间（秒） |
| `score` | Number | 评分 [1, 5] |
| `ocr` | String | 画面字幕文本 |
| `description` | String | 画面描述 |
| `tags` | Array | 标签列表（仅 `enable_segment_tag=true`） |

---

#### 10. 高光智剪-小游戏

- **task_type**：`generate-highlights-minigame`
- **请求路径**：`POST /api/v1/tools/generate-highlights-minigame`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_urls` | Array | 是 | 小游戏视频 URL 列表，当前仅支持单个视频，时长 ≤10 分钟，最高 1080p |
| `mode` | String | 是 | 固定 `HighlightExtract` |
| `minigame_info` | Object | 否 | 小游戏描述信息 |
| `enable_generate_video` | Boolean | 否 | 是否生成混剪视频，默认 true |

**`minigame_info` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | String | 游戏名称 |
| `play_definition` | String | 玩法描述 |
| `highlight_definition` | String | 高光定义 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `duration` | Number | 输入视频总时长（秒） |
| `video_urls` | Array | 混剪视频地址列表（`enable_generate_video=false` 时不返回） |
| `mixvideo_info` | Array | 混剪视频信息列表 |

**`mixvideo_info` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mixvideo_index` | Integer | 混剪视频索引 |
| `video_url` | String | 视频地址 |
| `clips` | Array | 片段列表（`clip_type` 固定 `HighlightClip`，`source_video_index` 固定 0，其余字段同短剧） |

---

#### 11. 高光智剪-影视拆条

- **task_type**：`generate-highlights-movie`
- **请求路径**：`POST /api/v1/tools/generate-highlights-movie`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 影视视频源 URL。仅支持单个视频，时长 ≤180 分钟，最高 1080p。须含视频流+音频流 |
| `enable_generate_video` | Boolean | 否 | 是否生成拆条视频文件，默认 true |
| `highlight_cuts_param` | Object | 否 | 拆条片段配置 |
| `opening_hook_param` | Object | 否 | 高光前置开场配置 |

**`highlight_cuts_param` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `min_duration` | Number | 单段最短时长（秒），默认 90，范围 [1, 600] |
| `max_duration` | Number | 单段最大时长（秒），默认 180，范围 [1, 600] |
| `enable_detailed_info` | Boolean | 是否输出详细分镜信息，默认 false |

**`opening_hook_param` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `is_enabled` | Boolean | 是否启用高光前置，默认 true |
| `min_duration` | Number | 最短总时长（秒），范围 [0, 60]，默认 5 |
| `max_duration` | Number | 最大总时长（秒），范围 [0, 60]，默认 15 |
| `min_clip_duration` | Number | 单片段最短时长（秒），范围 [0, 60]，默认 5 |
| `min_score` | Number | 最低评分 [0, 5]，默认 4 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `input_duration` | Number | 输入视频总时长（秒） |
| `video_urls` | Array | 拆条视频地址列表 |
| `result_cuts_info` | Array | 拆条片段详情列表 |

**`result_cuts_info` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | String | 片段标题 |
| `duration` | Number | 实际时长（秒） |
| `size` | Integer | 文件大小（字节） |
| `video_url` | String | 视频下载 URL |
| `clips` | Array | 原始片段信息列表（仅 `enable_detailed_info=true`） |

**`clips` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | String | `OpeningHook` / `HighlightClip` |
| `score` | Number | 评分 [1, 5] |
| `source_start_time` | Number | 原始视频起始时间（秒） |
| `source_end_time` | Number | 原始视频结束时间（秒） |
| `cut_start_time` | Number | 拆条视频起始时间（秒） |
| `cut_end_time` | Number | 拆条视频结束时间（秒） |

---

#### 12. 高光片段提取

- **task_type**：`analyze-video-highlights`
- **请求路径**：`POST /api/v1/tools/analyze-video-highlights`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_urls` | Array | 是 | 视频 URL 列表。短剧模式：最多 30 个，累计 ≤45 分钟；小游戏模式：仅单个视频，≤10 分钟。最高 1080p |
| `model` | String | 是 | 分析模型。`Miniseries`（短剧）/ `Game`（小游戏） |
| `mode` | String | 是 | 高光提取模式。`model=Miniseries` 时须为 `StorylineCuts`；`model=Game` 时须为 `HighlightExtract` |
| `minigame_info` | Object | 否 | 仅 `model=Game` 时可选，结构同高光智剪-小游戏 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `duration` | Number | 输入视频总时长（秒） |
| `highlight_info` | Array | 高光片段列表 |

**`highlight_info` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `source_video_index` | Integer | 源视频索引 |
| `start_time` | Number | 起始时间（秒） |
| `end_time` | Number | 结束时间（秒） |
| `score` | Number | 评分 [1, 5] |
| `ocr` | String | 画面字幕文本 |
| `description` | String | 画面描述 |

---

#### 13. 视频绿幕抠图

- **task_type**：`matte-greenscreen-video`
- **请求路径**：`POST /api/v1/tools/matte-greenscreen-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待抠图视频 URL |
| `format` | String | 否 | 输出格式。`WEBM`（默认）/ `MOV`。均支持 Alpha 透明通道 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 抠图后视频地址 |
| `duration` | Number | 输出视频时长（秒） |

---

#### 14. 视频人像抠图

- **task_type**：`matte-portrait-video`
- **请求路径**：`POST /api/v1/tools/matte-portrait-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待抠图视频 URL，建议 ≤10 GB |
| `format` | String | 否 | 输出格式。`WEBM`（默认，兼容性好体积小）/ `MOV`（PNG 编码，无损 Alpha，体积大） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 抠像后视频地址 |
| `duration` | Number | 输出视频时长（秒） |

---

#### 15. 剧情故事线分析

- **task_type**：`analyze-video-storyline`
- **请求路径**：`POST /api/v1/tools/analyze-video-storyline`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_urls` | Array | 是 | 视频 URL 列表，最多 30 个，累计 ≤210 分钟（3.5 小时），单视频建议 ≤150 分钟，最高 1080p |
| `enable_snapshot` | Boolean | 否 | 是否为每个剧情片段生成关键帧快照，默认 false |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `duration` | Number | 输入视频总时长（秒） |
| `source_video_info` | Array | 输入源视频分析结果列表 |
| `storyline_clips` | Array | 剧情片段信息数组 |
| `storyline_highlights` | Array | 故事线结果数组 |

**`source_video_info` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `source_video_index` | Integer | 片源索引，从 0 开始 |
| `source_video_url` | String | 片源原始 URL |
| `source_video_title` | String | 视频标题 |
| `source_video_summary` | String | 视频简介 |
| `source_video_tag` | Array | 视频标签列表 |

**`storyline_clips` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `clip_index` | Integer | 片段唯一索引，从 0 开始 |
| `source_video_index` | Integer | 来源视频索引 |
| `clip_title` | String | 片段标题 |
| `clip_summary` | String | 片段简介 |
| `clip_dialogue` | String | 主要对话文本 |
| `clip_score` | Number | 高光打分 [1, 5] |
| `clip_start_time` | Number | 源视频中的开始时间（秒） |
| `clip_end_time` | Number | 源视频中的结束时间（秒） |
| `clip_snapshot_url` | String | 关键帧快照 URL（仅 `enable_snapshot=true`） |

**`storyline_highlights` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `highlight_index` | Integer | 高光故事线索引，从 0 开始 |
| `highlight_title` | String | 高光故事线标题 |
| `highlight_summary` | String | 高光故事线简介 |
| `highlight_clips_index` | Array | 组成该故事线的剧情片段索引列表 |

---

#### 16. 剧本还原

- **task_type**：`drama-script`
- **请求路径**：`POST /api/v1/tools/drama-script`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_urls` | Array | 是 | 短剧视频 URL 列表，1~100 个，累计 ≤300 分钟，单文件 ≤120 分钟，须含内嵌字幕，多视频分辨率须一致。不支持 HLS/M3U8 |
| `return_pkg` | String | 否 | 输出封装格式。`false`（默认，仅返回 .json.gz）/ `true`（返回 .tar.gz 压缩包，含人物图片、场景截图等） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `result_url` | String | 剧本文件下载地址，有效期 24 小时 |
| `duration` | Number | 输入视频总时长（秒） |
| `drama_script_task_id` | String | 剧本还原任务 ID（以 v 开头），可用于解说视频生成 |

- **剧本 JSON 文件主要结构**（`result_url` 下载内容解压后）：

| 字段路径 | 类型 | 说明 |
| --- | --- | --- |
| `Plot` | String | 整体剧情概述 |
| `Scenes` | Array | 场景分镜列表 |
| `Scenes[].Id` | Integer | 场景序号 |
| `Scenes[].Title` | String | 场景标题 |
| `Scenes[].Start` / `.End` | Integer | 包含的 Segment 索引范围 |
| `Scenes[].Desc` | String | 场景视觉环境描述 |
| `Scenes[].Plot` | String | 场景剧情发展 |
| `Scenes[].StartTime` / `.EndTime` | Integer | 全局时间线（毫秒） |
| `Scenes[].Segments` | Array | 更细粒度切片列表 |
| `Scenes[].Segments[].StartInVideo` / `.EndInVideo` | Integer | 原始视频时间（毫秒） |
| `Scenes[].Segments[].Start` / `.End` | Integer | 全局时间轴（毫秒） |
| `Scenes[].Segments[].AudioDesc` | String | 环境音效描述 |
| `Scenes[].Segments[].Camera` | Object | 运镜参数（Angle/Height/Direction/LensFocalLength/ShotSize/Movement） |
| `Scenes[].Segments[].Visual` | Object | 视觉风格参数（BackgroundBlur/ColorTone/Style/Lighting） |
| `People` | Array | 出场人物信息列表 |
| `People[].Id` | String | 人物唯一标识 |
| `People[].Name` | String | 人物姓名 |
| `People[].Looks` | String | 人物视觉特征描述 |
| `Dialogues` | Array | 对白列表 |
| `Dialogues[].Id` | Integer | 对白序号 |
| `Dialogues[].Start` / `.End` | String | 全局时间码（HH:mm:ss.SSS） |
| `Dialogues[].StartInMillis` / `.EndInMillis` | Integer | 全局时间（毫秒） |
| `Dialogues[].StartInVideoMillis` / `.EndInVideoMillis` | Integer | 原始视频时间（毫秒） |
| `Dialogues[].Content` | String | 对白内容 |
| `Dialogues[].PeopleId` | String | 说话人角色 ID |
| `Dialogues[].VoiceDesc` | String | 说话人声音特征描述 |
| `Videos` | Array | 输入源视频元数据列表 |
| `Videos[].SpeechAudioFile` | String | 分离出的人声音频文件名 |
| `Videos[].BackgroundAudioFile` | String | 分离出的背景音音频文件名 |

---

#### 17. 解说视频生成

- **task_type**：`drama-recap`
- **请求路径**：`POST /api/v1/tools/drama-recap`
- **前置条件**：需先完成剧本还原任务，获取 `drama_script_task_id`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `drama_script_task_id` | String | 是 | 已成功完成的剧本还原任务的 task_id（以 v 开头） |
| `recap_text` | String | 否 | 自定义解说词文本，最多 5000 字符。当 `auto_generate_recap=false`（默认）时必填 |
| `batch_count` | Integer | 否 | 批量生成数量，默认 1，最大 100 |
| `erase_subtitle` | Boolean | 否 | 是否擦除原视频字幕，默认 false |
| `erase_mode` | String | 否 | 字幕擦除模式，仅 `erase_subtitle=true` 时生效。`standard`（默认） |
| `speaker_config` | Object | 否 | AI 配音配置 |
| `drama_recap_config` | Object | 否 | 解说词配置 |
| `subtitle_config` | Object | 否 | 解说字幕配置 |
| `miniseries_edit` | Object | 否 | （仅竖屏）短剧三要素配置 |

**`speaker_config` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `voice_type` | String | 配音音色。`Yunxi`（默认）/ `Yunjian` / `Yunfeng` / `Yunyi` / `Yunjie` / `Yunze` / `Yunye` / `Xiaoxiao` / `Xiaochen` / `Xiaohan` / `Xiaomo` |

**`drama_recap_config` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `auto_generate_recap` | Boolean | 是否 AI 自动生成解说词，默认 false。true 时不可传 `recap_text` |
| `style` | String | AI 生成解说词风格指令（如"悬疑"、"搞笑"） |
| `text_speed` | Number | 语速 [0.5, 2.0]，默认 1.0 |
| `text_length` | Integer | 期望解说词长度（字符），最大 5000 |
| `pause_time` | Integer | 句间停顿（毫秒），默认 120，范围 [1, 1000] |
| `prefer_speed` | Boolean | 是否优先保障生成速度，默认 false |
| `enable_repeat_match` | Boolean | 是否允许解说词匹配重复画面，默认 false |

**`subtitle_config` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `disable_subtitle` | Boolean | 是否不添加解说字幕，默认 false |
| `font_type` | String | 字体。`sy_black`（默认）/ `ali_puhui` / `pm_zhengdao` |
| `font_size` | Integer | 字体大小（px） |
| `font_color` | String | 字体颜色 RGBA，默认 `#FFFFFFFF` |
| `top_left_x` / `top_left_y` | Integer | 字幕区域左上角坐标（px） |
| `bottom_right_x` / `bottom_right_y` | Integer | 字幕区域右下角坐标（px） |
| `alpha` | Number | 透明度 [0, 1]，默认 1 |
| `align_type` | Integer | 对齐方式。横排：0=左/1=居中（默认）/2=右；竖排：1=居中/3=上/4=下 |
| `border_color` | String | 描边颜色 RGBA，默认 `#00000000` |
| `border_width` | Integer | 描边宽度（px） |
| `typesetting` | Integer | 排列方向。0=横排（默认）/ 1=竖排 |
| `line_max_width` | Number | 自动换行宽度比例 [0, 1]，默认 1 |
| `background_color` | String | 背景颜色 RGBA，默认 `#00000000` |
| `background_border_size` | Number | 背景边框大小，默认 0 |

**`miniseries_edit` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `template` | String | 视觉模板：热门短剧1~5 |
| `title` | String | 短剧名称，≤15 字 |
| `hint` | String | 短剧提示语，≤20 字 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 解说视频地址（`batch_count=1` 时） |
| `video_urls` | Array | 批量生成时所有视频地址列表 |
| `duration` | Number | 所有输出视频总时长（秒） |
| `total_count` | Integer | 批量生成总任务数 |
| `success_count` | Integer | 成功生成数量 |
| `failed_count` | Integer | 失败数量 |

---

#### 18. 解说视频生成（短剧行业模型）

- **task_type**：`drama-recap-vertical`
- **请求路径**：`POST /api/v1/tools/drama-recap-vertical`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_urls` | Array | 是 | 短剧原片 URL 列表，1~30 个，累计 ≤120 分钟，仅支持 1080p 且分辨率一致，须含视频流+音频流+中文对话 |
| `mode` | String | 否 | 解说模式。`text`（默认，文字解说）/ `narrate`（旁白解说） |
| `narrate_bgm_url` | String | 否 | 旁白模式背景音乐 URL，仅 `mode=narrate` 且 `enable_narrate_bgm=true` 时生效 |
| `max_count` | Integer | 否 | 生成数量上限，默认 3，范围 [1, 100] |
| `min_duration` | Number | 否 | 单视频时长下限（秒），默认 30，范围 [1, 7200] |
| `max_duration` | Number | 否 | 单视频时长上限（秒），默认 180，范围 [1, 7200] |
| `opening_hook` | String | 否 | 精彩片段前置策略。`auto`（默认）/ `force` / `disable` |
| `enable_return_poster` | Boolean | 否 | 是否返回封面图 URL，默认 false |
| `narrate_options` | Object | 否 | 旁白解说参数，仅 `mode=narrate` 时生效 |
| `text_options` | Object | 否 | 文字解说样式，仅 `mode=text` 时生效 |
| `edit_param` | Object | 否 | 成片剪辑参数 |

**`narrate_options` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `narrate_ratio` | Number | 解说浓度 [0, 1]，默认 0.3，建议 ≤0.5 |
| `enable_narrate_bgm` | Boolean | 是否添加背景音乐，默认 true |
| `erase_subtitle_mode` | String | 原片字幕擦除模式。`mosaic`（默认，打码）/ `standard`（标准版擦除） |

**`text_options` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `font_type` | String | 字体。`SY_Bold`（默认）/ `SY_Black` |
| `font_size` | Integer | 字号（px），不传时自动计算 |
| `font_color` | String | 颜色 `#RRGGBBAA`，默认 `#FFFFF290` |
| `align_type` | String | 对齐。`left`（默认）/ `middle` / `right` |
| `is_bold` | Boolean | 是否加粗，默认 false |
| `is_italic` | Boolean | 是否斜体，默认 true |
| `is_underline` | Boolean | 是否下划线，默认 false |
| `shadow_color` | String | 阴影颜色，默认 `#00000080` |
| `border_width` | Integer | 描边宽度（px），默认 2 |
| `border_color` | String | 描边颜色，默认 `#00000080` |
| `inner_padding` | Integer | 内边距（px），默认 1 |

**`edit_param` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mode` | String | `BasicEdit`（默认，基础剪辑）/ `TemplateEdit`（模板剪辑） |
| `template_edit` | Object | 模板剪辑参数 |

**`template_edit` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `template` | String | 视觉模板：热门短剧1（默认）~5 |
| `title` | String | 短剧名称，≤22 字 |
| `hint` | String | 短剧提示语，≤20 字 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `input_duration` | Number | 输入视频总时长（秒） |
| `output_duration` | Number | 输出所有解说视频总时长（秒） |
| `mode` | String | 解说视频模式（`Narrate` / `Text`） |
| `video_urls` | Array | 所有解说视频地址列表 |
| `video_infos` | Array | 每个解说视频详情列表 |

**`video_infos` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `duration` | Number | 该视频时长（秒） |
| `size` | Integer | 文件大小（字节） |
| `poster_url` | String | 封面图 URL（未生成时为空字符串） |
| `video_url` | String | 视频地址 |

---

#### 19. 视频抽帧

- **task_type**：`extract-frames`
- **请求路径**：`POST /api/v1/tools/extract-frames`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待处理视频 URL |
| `snapshot_type` | String | 否 | 截图策略。`TimeInterval`（默认）/ `SpecifiedTime` / `SpecifiedFrames` / `SceneChange` |
| `time_interval` | Number | 否 | 时间间隔（秒），默认 1，需 >0.001。仅 `TimeInterval` 时生效 |
| `specified_time` | Array&lt;Number&gt; | 否 | 指定时间点列表（秒），最多 1000 个。仅 `SpecifiedTime` 时必填 |
| `specified_frames` | Array&lt;Integer&gt; | 否 | 指定帧号列表，仅支持 0（首帧）和 -1（尾帧）。仅 `SpecifiedFrames` 时必填 |
| `scene_change_threshold` | Number | 否 | 场景变化敏感度阈值 (0, 1)，默认 0.1。仅 `SceneChange` 时生效 |
| `snapshot_limit` | Integer | 否 | 截图最大数量 [1, 1000]。仅 `TimeInterval` 和 `SceneChange` 时生效 |
| `scale_long` | Integer | 否 | 输出图片长边最大像素 [0, 4096] |
| `scale_short` | Integer | 否 | 输出图片短边最大像素 [0, 4096] |
| `enable_sprite` | Boolean | 否 | 是否合成雪碧图，默认 false |
| `sprite_rows` | Integer | 否 | 雪碧图行数 [1, 100]，默认 10 |
| `sprite_cols` | Integer | 否 | 雪碧图列数 [1, 100]，默认 10 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `snapshots` | Array | 截图结果列表 |
| `snapshots[].image_url` | String | 截图下载地址，有效期 24 小时 |
| `snapshot_count` | Integer | 成功生成的截图总数 |

---

#### 20. 视频暗水印添加

- **task_type**：`add-video-invisible-watermark`
- **请求路径**：`POST /api/v1/tools/add-video-invisible-watermark`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待添加暗水印的视频 URL，最高 4K |
| `watermark_content` | String | 是 | 待嵌入的隐藏数字信息，纯数字字符串，范围 1 至 9223372036854775807（64 位正整数），不允许前导零 |
| `watermark_level` | String | 否 | 暗水印强度。`normal`（默认）/ `high` |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 已嵌入暗水印的视频地址 |
| `duration` | Number | 输入视频总时长（秒） |
| `resolution` | String | 输入视频分辨率 |

---

#### 21. 视频暗水印提取

- **task_type**：`extract-video-invisible-watermark`
- **请求路径**：`POST /api/v1/tools/extract-video-invisible-watermark`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待提取暗水印的视频 URL，最高 4K |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `watermark_contents` | Array&lt;Object&gt; | 提取到的暗水印信息列表，未提取到则为空 |
| `watermark_contents[].watermark_content` | String | 暗水印数字信息字符串 |
| `duration` | Number | 输出视频总时长（秒） |

---

#### 22. 视频人脸打码

- **task_type**：`face-blur-video`
- **请求路径**：`POST /api/v1/tools/face-blur-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待打码视频 URL，最高 4K（推荐 1080P），时长 ≤10 分钟，帧率 25~60 |
| `face_confidence` | Number | 否 | 人脸检测置信度阈值 [0.1, 1.0]，默认 0.35 |
| `mask_mode` | String | 否 | 打码方式。`mosaic`（默认，马赛克）/ `blur`（高斯模糊） |
| `mask_strength` | String | 否 | 打码强度。`low` / `medium`（默认）/ `high` |
| `face_box_expand` | Number | 否 | 人脸框扩展比例 (0.0, 1.0]，默认 0.2 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 已打码视频地址 |
| `duration` | Number | 输出视频总时长（秒） |

---

#### 23. 视频转码

- **task_type**：`encode-video`（推测）
- **请求路径**：`POST /api/v1/tools/encode-video`（推测）
- **状态**：⚠️ 官方 API 文档页面（[2488141](https://docs.volcengine.com/docs/6448/2488141)）内容为空，参数信息未公开。参数结构可参考**极智超清**（`martencode-video`），支持视频编码格式转换、分辨率调整、码率控制等功能。

---

#### 24. 极智超清

- **task_type**：`martencode-video`
- **请求路径**：`POST /api/v1/tools/martencode-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待转码视频 URL |
| `container_format` | String | 是 | 输出封装格式。`MP4`（默认）/ `FLV` / `MPEGTS` |
| `video` | Object | 是 | 视频转码参数配置 |
| `audio` | Object | 否 | 音频转码参数配置。不传时音频采用默认参数（编码 aac，其余跟随源文件） |
| `metadata_keep_tags` | Array&lt;String&gt; | 否 | 需保留的元信息标签列表。对 MPEGTS 无效 |
| `metadata_add_tags` | Array&lt;Object&gt; | 否 | 需新增的元信息标签列表。对 MPEGTS 无效 |

**`video` 结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `codec` | String | 是 | 视频编码。`h264`（默认）/ `h265` |
| `scale_type` | Integer | 否 | 缩放模式。0=跟随片源（默认，最高 8K）/ 1=长短边限制（最高 4K）/ 2=宽高限制（最高 4K） |
| `scale_mode` | Integer | 否 | 填充拉伸策略（scale_type=1 或 2 时生效）。0=不上采（默认）/ 1=拉伸上采 / 2=补黑边上采 |
| `scale_width` | Integer | 否 | 目标宽度（px）[0, 4320]。仅 scale_type=2 |
| `scale_height` | Integer | 否 | 目标高度（px）[0, 4320]。仅 scale_type=2 |
| `scale_short` | Integer | 否 | 目标短边（px）[0, 4320]。仅 scale_type=1 |
| `scale_long` | Integer | 否 | 目标长边（px）[0, 4320]。仅 scale_type=1 |
| `bitrate_mode` | String | 是 | 码率控制模式。`crf`（默认，恒定画质）/ `abr`（平均码率）/ `cbr`（恒定码率） |
| `bitrate_crf` | Number | 否 | CRF 参数 [0, 51]，默认 25。仅 crf 模式 |
| `bitrate_kbps` | Integer | 是 | 视频码率目标值（Kbps）[10, 50000]，默认 2000 |
| `fps_mode` | String | 否 | 帧率控制模式。`vfr`（默认，动态）/ `cfr`（恒定） |
| `fps` | Integer | 否 | 目标帧率 [1, 240]。不设置则遵循原视频 |
| `is_hdr_to_sdr` | Boolean | 否 | 是否 HDR 转 SDR，默认 true |

**`audio` 结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `codec` | String | 是 | 音频编码。当前仅支持 `aac` |
| `sample_rate` | Integer | 是 | 采样率（Hz），默认 44100 |
| `bitrate_mode` | String | 是 | 码率控制模式。`cbr`（默认）/ `cae`（自适应，仅 aac） |
| `bitrate_kbps` | Integer | 否 | 音频码率（Kbps）[10, 500]，默认 128 |
| `channels` | Integer | 否 | 声道数。1=单声道 / 2=双声道（默认） |
| `volume_method` | String | 否 | 音量均衡算法。设为 `2Pass` 启用 |
| `volume_integrated_loudness` | Number | 否 | 目标综合响度（LUFS）[-70, -5]，默认 -12 |
| `volume_true_peak` | Number | 否 | 真实峰值（dBTP）[-9, 0]，默认 0 |
| `volume_loudness_range` | Number | 否 | 响度范围（LU）[1, 20]，默认 7 |

**`metadata_add_tags` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | String | 标签键名 |
| `value` | String | 标签值 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 输出视频地址，有效期 24 小时 |
| `duration` | Number | 视频时长（秒） |
| `resolution` | String | 转码后分辨率 |
| `video_codec` | String | 视频编码格式 |

---

#### 25. 视频转封装

- **task_type**：`remux-video`
- **请求路径**：`POST /api/v1/tools/remux-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待处理视频 URL |
| `container_format` | String | 是 | 目标封装格式。`MP4`（默认）/ `FLV` / `MPEGTS` |
| `metadata_keep_tags` | Array&lt;String&gt; | 否 | 需保留的元信息标签列表。对 MPEGTS 无效 |
| `metadata_add_tags` | Array&lt;Object&gt; | 否 | 需新增的元信息标签列表。对 MPEGTS 无效 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 输出视频地址，有效期 24 小时 |
| `duration` | Number | 视频时长（秒） |

---

#### 26. 视频画质检测 VQScore

- **task_type**：`assess-video-quality`
- **请求路径**：`POST /api/v1/tools/assess-video-quality`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待检测视频 URL，最高 4K |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `vq_score` | Number | VQScore 画质评分 [0, 100]。[0,60)较差 / [60,70)良好 / [70,100]清晰 |
| `duration` | Number | 输入视频时长（秒） |

---

#### 27. 视频元信息获取

- **task_type**：`probe-video-metadata`
- **请求路径**：`POST /api/v1/tools/probe-video-metadata`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待探测视频 URL |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `format_meta` | Object | 容器层元信息 |
| `video_stream_meta` | Object | 主视频流元信息（无视频流时为 null） |
| `audio_stream_meta` | Object | 主音频流元信息（无音频流时为 null） |

**`format_meta` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `md5` | String | 文件 MD5 值 |
| `container` | String | 容器格式（如 MP4） |
| `bitrate` | Number | 容器码率（bps） |
| `duration` | Number | 时长（秒） |
| `size` | Number | 文件大小（Byte） |

**`video_stream_meta` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `codec` | String | 编码格式（如 h264） |
| `width` | Number | 宽度（px） |
| `height` | Number | 高度（px） |
| `duration` | Number | 时长（秒） |
| `bitrate` | Number | 码率（bps） |
| `fps` | Number | 帧率 |
| `dynamic_range` | String | 动态范围（HDR/SDR） |

**`audio_stream_meta` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `codec` | String | 编码格式（如 aac） |
| `duration` | Number | 时长（秒） |
| `sample_rate` | Number | 采样率（Hz） |
| `bitrate` | Number | 码率（bps） |
| `channels` | Number | 声道数 |

---

### 第二部分：图像工具

> 所有图像工具均为**同步接口**（路径含 `tools-sync`），请求即返回结果，无需轮询。

---

#### 1. 图像画质增强

- **task_type**：`enhance-image`
- **请求路径**：`POST /api/v1/tools-sync/enhance-image`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 待增强图像 URL。支持 `https://`、`mediakit://`、`tos://`。单张 ≤10 MB。格式：png、jpg、jpeg、webp |
| `tool_version` | String | 否 | `standard`（默认）/ `professional` / `max`（大模型增强版，长边可达 6240px） |
| `multiple` | Number | 否 | 放大倍数，支持 2 位小数。standard [1, 8]；professional [1, 30]；max [1, 30] |
| `target_width` | Integer | 否 | 目标宽度（px）。standard [原图宽, 6144]；professional/max [64, 10240] |
| `target_height` | Integer | 否 | 目标高度（px）。standard [原图高, 6144]；professional/max [64, 10240] |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 增强后图片地址，有效期 24 小时 |
| `image_size` | Integer | 图片大小（字节） |
| `image_format` | String | 图片格式 |
| `image_width` | Integer | 宽度（px） |
| `image_height` | Integer | 高度（px） |

---

#### 2. 图像画质评估

- **task_type**：`evaluate-image-quality`
- **请求路径**：`POST /api/v1/tools-sync/evaluate-image-quality`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 待评估图像 URL。短边 ≤4320px，长边 ≤7680px，单张 ≤10 MB。格式：png、jpeg、webp、heic |
| `tool_version` | String | 否 | `standard`（默认，15 种基础维度）/ `professional`（大模型，综合性评分） |
| `standard_evaluate_items` | Array | 否 | 仅 standard 时生效，指定返回的评估维度。默认 `["vqscore","noise","aesthetic","blur"]`。可选：vqscore、advcolor、blockiness、noise、aesthetic、blur、cg、contrast、texture、brightness、overexposure、hue、saturation、green、cmartifacts |

- **result 结构（standard）**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tool_version` | String | 固定 `standard` |
| `vqscore` | Number | 主观质量 [0, 100] |
| `aesthetic` | Number | 美学评分 [0, 100] |
| `advcolor` | Number | 色彩质量 [0, 100] |
| `blockiness` | Number | 块效应 [0, 100]，-1 为非常规图像 |
| `blur` | Number | 模糊评分 [0, 100]，越高越清晰 |
| `brightness` | Number | 平均亮度 [0, 255] |
| `cg` | Number | 非自然场景程度 [0, 100] |
| `cmartifacts` | Number | 压缩失真 [0, 100] |
| `contrast` | Number | 对比度 [0, 100] |
| `green` | Number | 绿色区域 [0, 255] |
| `hue` | Number | 色调均衡 [0, 100] |
| `noise` | Number | 噪声评分 [0, 100]，越高越干净 |
| `overexposure` | Number | 过曝光面积 [0, 100] |
| `saturation` | Number | 饱和度均衡 [0, 100] |
| `texture` | Number | 纹理丰富度 [0, 255] |

- **result 结构（professional）**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tool_version` | String | 固定 `professional` |
| `overall` | Number | 综合总评分 [0, 100] |
| `aesthetics` | Number | 美学评分 [0, 100] |
| `artifacts` | Number | 伪影评分 [0, 100]，越高伪影越少 |
| `blur` | Number | 模糊评分 [0, 100] |
| `noise` | Number | 噪声评分 [0, 100] |

---

#### 3. 图像人脸打码

- **task_type**：`face-blur-image`
- **请求路径**：`POST /api/v1/tools-sync/face-blur-image`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 待打码图像 URL。建议 ≤35 MB，宽高乘积 ≤4 亿像素。格式：png、jpg、jpeg、webp、avif，不支持动图 |
| `blur_shape` | String | 否 | 模糊区域形状。`circle`（默认）/ `rectangle` |
| `mosaic_step` | Integer | 否 | 马赛克像素格大小（px），建议 [5, 100]，默认 12 |
| `face_detect_thresh` | Number | 否 | 人脸检测置信度阈值 (0, 1)，默认 0.9 |
| `output_format` | String | 否 | 输出格式。`png` / `jpeg` / `webp`（默认） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 打码后图片地址，有效期 24 小时 |
| `image_size` | Integer | 图片大小（字节） |
| `image_format` | String | 图片格式 |
| `image_width` | Integer | 宽度（px） |
| `image_height` | Integer | 高度（px） |
| `face_count` | Integer | 检测到并已打码的人脸数量 |
| `face_location` | Array | 每张人脸信息对象数组 |

**`face_location` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `top_left_x` | Integer | 左上角 X 坐标（px） |
| `top_left_y` | Integer | 左上角 Y 坐标（px） |
| `bottom_right_x` | Integer | 右下角 X 坐标（px） |
| `bottom_right_y` | Integer | 右下角 Y 坐标（px） |
| `confidence` | Number | 检测置信度 (0, 1) |

---

#### 4. 图像背景移除（智能抠图）

- **task_type**：`remove-image-background`
- **请求路径**：`POST /api/v1/tools-sync/remove-image-background`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 待处理图像 URL。短边 ≤4320px，长边 ≤7680px，单张 ≤10 MB。格式：png、jpg、jpeg、webp、tiff、bmp、heic |
| `scene` | String | 是 | 抠图场景。`general`（通用）/ `human`（人像）/ `product`（商品） |
| `need_contour` | Boolean | 否 | 是否生成描边，默认 false。仅 scene 为 human 或 product 时生效 |
| `contour_color` | String | 否 | 描边颜色（十六进制 RGB），默认 `#FFFFFF` |
| `contour_size` | Integer | 否 | 描边宽度（px）[1, 100]，默认 10 |
| `need_crop_background` | Boolean | 否 | 是否裁剪到刚好包裹主体，默认 false。仅 human 或 product 时生效 |
| `output_format` | String | 否 | 输出格式。`png`（默认，支持透明）/ `jpeg`（填充黑色）/ `webp`（支持透明） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 抠图后图片地址，有效期 24 小时 |
| `image_size` | Integer | 图片大小（字节） |
| `image_format` | String | 图片格式 |
| `image_width` | Integer | 宽度（px） |
| `image_height` | Integer | 高度（px） |

---

#### 5. 图像擦除修复

- **task_type**：`erase-image`
- **请求路径**：`POST /api/v1/tools-sync/erase-image`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 待处理图像 URL。不小于 10x10 px，不超过 2560x1440 px，单张 ≤10 MB |
| `tool_version` | String | 否 | 当前仅支持 `standard` |
| `standard_scene` | String | 否 | 擦除场景。`full_screen_text_erase`（默认，全屏文字擦除）/ `full_screen_icon_erase`（全屏图标擦除） |
| `standard_erase_text` | String | 否 | 指定擦除的文字内容。仅 `full_screen_text_erase` 时生效，不提供则擦除所有文字 |
| `output_format` | String | 否 | 输出格式。`webp`（默认）/ `png` / `jpeg` |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 擦除修复后图片地址，有效期 24 小时 |
| `image_size` | Integer | 图片大小（字节） |
| `image_format` | String | 图片格式 |
| `image_width` | Integer | 宽度（px） |
| `image_height` | Integer | 高度（px） |

---

#### 6. 图像文字识别（OCR）

- **task_type**：`image-ocr`
- **请求路径**：`POST /api/v1/tools-sync/image-ocr`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 待识别图像 URL。短边 ≤2160px，长边 ≤3840px，单张 ≤10 MB。仅支持简体中文和英文 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `ocr_result` | Array | 文字识别结果列表 |

**`ocr_result` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `content` | String | 识别出的文字内容 |
| `confidence` | Number | 置信度 [0, 1] |
| `top_left_x` | Number | 左上角 X 坐标（px） |
| `top_left_y` | Number | 左上角 Y 坐标（px） |
| `bottom_right_x` | Number | 右下角 X 坐标（px） |
| `bottom_right_y` | Number | 右下角 Y 坐标（px） |

---

#### 7. 图像智能裁剪

- **task_type**：`smart-crop-image`
- **请求路径**：`POST /api/v1/tools-sync/smart-crop-image`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 待处理图片 URL。宽高均 ≤6000px |
| `target_width` | Integer | 否 | 目标宽度（px），默认 100 |
| `target_height` | Integer | 否 | 目标高度（px），默认 100 |
| `scene` | String | 否 | 裁剪场景模型。`person_face`（默认）/ `cartoon_face` |
| `crop_strategy` | String | 否 | 降级裁剪策略。`top_crop`（默认）/ `center_crop` / `frosted_glass_fill` |
| `frosted_glass_strength` | Number | 否 | 毛玻璃模糊强度 [10, 100]，默认 100。仅 `frosted_glass_fill` 时生效 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 裁剪后图片地址，有效期 24 小时 |
| `image_size` | Integer | 图片大小（字节） |
| `image_format` | String | 图片格式 |
| `image_width` | Integer | 宽度（px） |
| `image_height` | Integer | 高度（px） |

---

#### 8. 智能扩图

- **task_type**：`expand-image-canvas`
- **请求路径**：`POST /api/v1/tools-sync/expand-image-canvas`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 待处理图片 URL。长边 ≤4160px |
| `expand_top` | Number | 否 | 向上扩展比例 [0, 0.4]，默认 0.1 |
| `expand_bottom` | Number | 否 | 向下扩展比例 [0, 0.4]，默认 0.1 |
| `expand_left` | Number | 否 | 向左扩展比例 [0, 0.4]，默认 0.1 |
| `expand_right` | Number | 否 | 向右扩展比例 [0, 0.4]，默认 0.1 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 扩图后图片地址，有效期 24 小时 |
| `image_size` | Integer | 图片大小（字节） |
| `image_format` | String | 图片格式 |
| `image_width` | Integer | 宽度（px） |
| `image_height` | Integer | 高度（px） |

---

#### 9. 集智瘦身

- **task_type**：`slim-image`
- **请求路径**：`POST /api/v1/tools-sync/slim-image`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 待处理图片 URL。建议 ≤50 MB，宽高均 ≤10000px。格式：jpeg、jpg、png、heic、avif、webp，不支持动图 |
| `output_format` | String | 否 | 输出格式。`original`（默认）/ `png` / `jpeg` / `webp` |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 瘦身后图片地址，有效期 24 小时 |
| `image_size` | Integer | 图片大小（字节） |
| `image_format` | String | 图片格式 |
| `image_width` | Integer | 宽度（px） |
| `image_height` | Integer | 高度（px） |

---

#### 10. 图像翻译

- **task_type**：`translate-image-text`
- **请求路径**：`POST /api/v1/tools-sync/translate-image-text`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 待翻译图像 URL。宽高均 ≥10px，宽高乘积 ≤2000 万像素，单张 ≤10 MB |
| `tool_version` | String | 否 | `seed-translation`（默认）/ `erase` / `overlay-translation` / `dense-text-translation` / `logo-retain-erase-translation` |
| `target_lang` | String | 是 | 目标语言语种编号（如 zh、en、ja、ko、fr 等） |
| `source_lang` | String | 否 | 源语言语种编号，不传则自动识别 |
| `output_format` | String | 否 | 输出格式，默认 `webp` |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 翻译后图片地址，有效期 24 小时 |
| `image_size` | Integer | 图片大小（字节） |
| `image_format` | String | 图片格式 |
| `image_width` | Integer | 宽度（px） |
| `image_height` | Integer | 高度（px） |

---

#### 11. 电商牛皮癣擦除

- **task_type**：`remove-image-elements`
- **请求路径**：`POST /api/v1/tools-sync/remove-image-elements`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 待清理图片 URL。128px ≤ 高度 ≤1440px，128px ≤ 宽度 ≤2560px |

- **result 结构**：

| ���段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 清理后图片地址，有效期 24 小时 |
| `image_size` | Integer | 图片大小（字节） |
| `image_format` | String | 图片格式 |
| `image_width` | Integer | 宽度（px） |
| `image_height` | Integer | 高度（px） |

---

#### 12. 电商万创（商品场景图生成）

- **task_type**：`generate-product-scene-image`
- **请求路径**：`POST /api/v1/tools-sync/generate-product-scene-image`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 商品图片 URL。短边 ≥512px，长边 ≤1024px |
| `tool_version` | String | 否 | `standard`（默认）/ `professional` |
| `output_width` | Integer | 否 | 输出宽度 [512, 1024]，默认 800 |
| `output_height` | Integer | 否 | 输出高度 [512, 1024]，默认 800 |
| `batch_count` | Integer | 否 | 生成张数 [1, 4]，默认 1 |
| `product_ratio` | Number | 否 | 商品主体面积比例 [0, 1]，默认 0.6 |
| `prompt` | String | 条件必选 | 创意描述提示词。standard 模式仅英文；professional 模式中英文 |
| `standard_scene` | String | 否 | 预设背景场景（仅 standard）。默认 `general`。可选：general、natural_pasture、exhibit_home、exhibit_simple、exhibit_kitchen、exhibit_bathroom、exhibit_wine、exhibit_beer、exhibit_liquor、exhibit_light、exhibit_luxury、exhibit_modern、exhibit_stone、exhibit_forest、exhibit_floor、exhibit_toy、glisten_dew、spring_rock、flower_rock、water_reflect、water_plants、water_ripples、origem_drop、sunrise_bake、onyx_flow、joy_pack、drug_moss、toy_mat、coast_nut、sea_crunch、dawn_silk 等 |
| `professional_reference_image_url` | String | 条件必选 | 背景风格参考图 URL（仅 professional，必填） |
| `professional_reference_image_adapt_scale` | Number | 否 | 参考图适配强度 [0, 1]，默认 0.9 |
| `professional_product_center_x` | Integer | 否 | 商品水平中心位置 [0, 输出宽度]，默认 0（居中） |
| `professional_product_center_y` | Integer | 否 | 商品垂直中心位置 [0, 输出高度]，默认 0（居中） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `images` | Array | 生成的图片信息列表 |

**`images` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 图片下载地址，有效期 24 小时 |
| `image_size` | Integer | 图片大小（字节） |
| `image_format` | String | 图片格式 |
| `image_width` | Integer | 宽度（px） |
| `image_height` | Integer | 高度（px） |

---

#### 13. 图像基础编辑（12 个子工具）

##### 13.1 圆角矩形

- **task_type**：`round-corner-image`
- **请求路径**：`POST /api/v1/tools-sync/round-corner-image`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `corner_type` | String | 否 | 圆角类型：`circle`（正圆）/ `ellipse`（椭圆） |
| `circle_radius` | Integer | 否 | 圆角半径 |
| `output_format` | String | 否 | 输出格式 |

##### 13.2 图像旋转

- **task_type**：`rotate-image`
- **请求路径**：`POST /api/v1/tools-sync/rotate-image`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `rotate_angle` | Number | 否 | 逆时针旋转角度 |
| `fill_color` | String | 否 | 空白区域填充色 |
| `output_format` | String | 否 | 输出格式 |

##### 13.3 图像翻转

- **task_type**：`flip-image`
- **请求路径**：`POST /api/v1/tools-sync/flip-image`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `flip_type` | String | 否 | 翻转模式：`horizontal`（水平）/ `vertical`（垂直） |
| `output_format` | String | 否 | 输出格式 |

##### 13.4 图像锐化

- **task_type**：`sharpen-image`
- **请求路径**：`POST /api/v1/tools-sync/sharpen-image`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `sharpen_level` | String | 否 | 锐化强度：`low`（默认）/ `medium` / `high` |
| `output_format` | String | 否 | 输出格式 |

##### 13.5 图像高斯模糊

- **task_type**：`gaussian-blur-image`
- **请求路径**：`POST /api/v1/tools-sync/gaussian-blur-image`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `blur_strength` | Integer | 否 | 模糊强度，推荐 10（轻度）/ 30（中度）/ 100（重度） |
| `output_format` | String | 否 | 输出格式 |

##### 13.6 图像打码

- **task_type**：`mosaic-image`
- **请求路径**：`POST /api/v1/tools-sync/mosaic-image`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `mosaic_type` | String | 否 | 打码范围：`full-image`（全图）/ `specify-region`（指定区域） |
| `mosaic_regions` | Array | 否 | 打码区域数组（`specify-region` 时使用），含 top_left_x/y、bottom_right_x/y |
| `mosaic_shape` | String | 否 | 像素格形状：`rectangle` / `circle` |
| `mosaic_step_x` | Integer | 否 | 像素格宽度 |
| `mosaic_step_y` | Integer | 否 | 像素格高度 |
| `output_format` | String | 否 | 输出格式 |

##### 13.7 添加图文水印

- **task_type**：`add-image-watermark`
- **请求路径**：`POST /api/v1/tools-sync/add-image-watermark`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `watermark_type` | String | 否 | 水印类型：`text`（文字）/ `image`（图片） |
| `watermark_text` | String | 否 | 文字水印内容 |
| `watermark_text_font_size` | Integer | 否 | 文字字体大小 |
| `watermark_text_color` | String | 否 | 文字颜色（十六进制） |
| `watermark_text_opacity` | Integer | 否 | 文字透明度 [0, 100] |
| `watermark_position` | String | 否 | 水印位置（九宫格） |
| `watermark_position_offset_x` | Integer | 否 | 水平偏移量 |
| `watermark_position_offset_y` | Integer | 否 | 垂直偏移量 |

##### 13.8 图像调整

- **task_type**：`adjust-image-color`
- **请求路径**：`POST /api/v1/tools-sync/adjust-image-color`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `adjust_type` | String | 否 | 调整类型：`increase_brightness` / `decrease_brightness` / `increase_contrast` / `decrease_contrast` / `increase_saturation` / `decrease_saturation` |
| `output_format` | String | 否 | 输出格式 |

##### 13.9 图像缩放

- **task_type**：`scale-image`
- **请求路径**：`POST /api/v1/tools-sync/scale-image`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `width` | Integer | 否 | 目标宽度。仅指定宽度时等比缩放 |
| `height` | Integer | 否 | 目标高度。仅指定高度时等比缩放 |
| `scale` | Number | 否 | 缩放比例 |

##### 13.10 图像负片

- **task_type**：`invert-image`
- **请求路径**：`POST /api/v1/tools-sync/invert-image`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `output_format` | String | 否 | 输出格式 |

##### 13.11 图像裁剪

- **task_type**：`crop-image`
- **请求路径**：`POST /api/v1/tools-sync/crop-image`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `crop_mode` | String | 否 | 裁剪模式：`directional`（方向）/ `origin`（定向）/ `custom`（自定义）/ `circle`（内切圆） |
| `crop_width` | Integer | 否 | 目标宽度（directional/origin） |
| `crop_height` | Integer | 否 | 目标高度（directional/origin） |
| `crop_position` | String | 否 | 方向位置（directional）：center、up、right 等 |
| `origin_gravity` | String | 否 | 锚点位置（origin）：九宫格之一 |
| `origin_x` | Integer | 否 | 水平偏移量（origin） |
| `origin_y` | Integer | 否 | 垂直偏移量（origin） |
| `custom_x1` / `custom_y1` | Integer | 否 | 自定义左上角坐标（custom） |
| `custom_x2` / `custom_y2` | Integer | 否 | 自定义右下角坐标（custom） |
| `output_format` | String | 否 | 输出格式。circle 模式建议 png 或 webp |

##### 13.12 图像压缩

- **task_type**：`compress-image`
- **请求路径**：`POST /api/v1/tools-sync/compress-image`

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 输入图片地址 |
| `output_format` | String | 否 | 输出格式：webp、avif、heic 等 |
| `quality` | Integer | 否 | 压缩质量 [1, 100] |
| `max_size` | Integer | 否 | 文件体积上限。与 quality 同时设置时 max_size 优先 |

> 图像基础编辑 12 个子工具的 result 结构统一为：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 处理后图片地址，有效期 24 小时 |
| `image_size` | Integer | 图片大小（字节） |
| `image_format` | String | 图片格式 |
| `image_width` | Integer | 宽度（px） |
| `image_height` | Integer | 高度（px） |

---

### 第三部分：剪辑工具

---

#### 1. 智能剪辑 Vibe Editing

- **task_type**：`vibe-editing`
- **请求路径**：`POST /api/v1/tools/vibe-editing`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `content` | Array | 是 | 输入内容列表，支持多模态混排，至少 1 项。建议将指令文本放在首位或末位 |
| `output` | Object | 否 | 输出配置 |

**`content` 元素结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `type` | String | 是 | 内容类型：`text` / `image_url` / `video_url` / `audio_url` / `subtitle_url` |
| `text` | String | 否 | 文本指令（仅 type=text）。使用自然语言描述剪辑目标 |
| `image_url` | Object | 否 | 图片素材 URL 对象（含 `url` 子字段） |
| `video_url` | Object | 否 | 视频素材 URL 对象（含 `url` 子字段） |
| `audio_url` | Object | 否 | 音频素材 URL 对象（含 `url` 子字段） |
| `subtitle_url` | Object | 否 | 字幕素材 URL 对象（含 `url` 子字段） |

**`output` 结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `type` | String | 否 | 输出类型：`video`（默认）/ `audio` |
| `resolution` | String | 否 | 视频分辨率（仅 type=video）。预设：`360p`/`480p`/`720p`/`1080p`/`2k`/`4k`；或宽高格式如 `1920x1080`（[160, 8192]） |
| `format` | String | 否 | 封装格式。`mp4`（视频）/ `mp3`（音频） |
| `fps` | Integer | 否 | 视频帧率 [15, 60]，默认 25 |
| `meta` | Object | 否 | 输出元信息 |

**`meta` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `aigc` | String | AIGC 标识 JSON 字符串，含 Label（"1"/"2"/"3"）、ContentProducer、ProduceID、ReservedCode1、ContentPropagator、PropagateID、ReservedCode2 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `artifacts` | Array | 输出产物列表 |

**`artifact` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `operation` | String | 合成操作类型，当前固定 `synthesize` |
| `type` | String | 产物类型：`video` / `audio` |
| `url` | String | 产物下载 URL，有效期 24 小时 |
| `duration` | Number | 产物时长（秒） |
| `description` | String | 产物描述 |

---

#### 2. 视频拼接

- **task_type**：`concat-video`
- **请求路径**：`POST /api/v1/tools/concat-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_urls` | Array&lt;String&gt; | 是 | 待拼接视频 URL 列表，1~100 个，**数组顺序即拼接顺序**。建议单文件 ≤10 GB，最高 4K |
| `transitions` | Array&lt;String&gt; | 否 | 转场效果 ID 列表，默认无转场（硬切）。数量不足时循环使用 |

**转场效果 ID 表**：

| 效果名称 | ID | 效果名称 | ID |
| --- | --- | --- | --- |
| 泛开 | 1182358 | 故障转换 | 1182367 |
| 交替出场 | 1182359 | 飞眼 | 1182368 |
| 旋转放大 | 1182360 | 开门展现 | 1182370 |
| 梦幻放大 | 1182369 | 立方转换 | 1182373 |
| 六角形 | 1182365 | 透镜变换 | 1182374 |
| 圆形交替 | 1182378 | 晚霞转场 | 1182375 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 拼接后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频总时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

#### 3. 音频拼接

- **task_type**：`concat-audio`
- **请求路径**：`POST /api/v1/tools/concat-audio`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说��� |
| --- | --- | --- | --- |
| `audio_urls` | Array&lt;String&gt; | 是 | 待拼接音频 URL 列表，1~100 个。建议单文件 ≤10 GB |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `audio_url` | String | 拼接后音频地址（M4A），有效期 24 小时 |
| `duration` | Number | 输出音频总时长（秒） |

---

#### 4. 视频裁剪

- **task_type**：`trim-video`
- **请求路径**：`POST /api/v1/tools/trim-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待裁剪视频 URL，建议 ≤10 GB，最高 4K |
| `start_time` | Number | 否 | 裁剪开始时间（秒），支持最多两位小数，默认 0 |
| `end_time` | Number | 否 | 裁剪结束时间（秒），支持最多两位小数，默认到视频末尾 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 裁剪后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

#### 5. 音频裁剪

- **task_type**：`trim-audio`
- **请求路径**：`POST /api/v1/tools/trim-audio`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `audio_url` | String | 是 | 待裁剪音频 URL，建议 ≤10 GB |
| `start_time` | Number | 否 | 裁剪开始时间（秒），支持最多两位小数，默认 0 |
| `end_time` | Number | 否 | 裁剪结束时间（秒），支持最多两位小数，默认到音频末尾 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `audio_url` | String | 裁剪后音频地址（M4A），有效期 24 小时 |
| `duration` | Number | 输出音频时长（秒） |

---

#### 6. 视频调速

- **task_type**：`adjust-video-speed`
- **请求路径**：`POST /api/v1/tools/adjust-video-speed`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待调速视频 URL，建议 ≤10 GB，最高 4K |
| `speed` | Number | 否 | 播放速度倍数 [0.1, 4.0]，默认 1.0。>1.0 快放，<1.0 慢放 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 调速后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

#### 7. 音频调速

- **task_type**：`adjust-audio-speed`
- **请求路径**：`POST /api/v1/tools/adjust-audio-speed`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `audio_url` | String | 是 | 待调速音频 URL，建议 ≤10 GB |
| `speed` | Number | 否 | 播放速度倍数 [0.1, 4.0]，通过算法保持音调自然 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `audio_url` | String | 调速后音频地址（M4A），有效期 24 小时 |
| `duration` | Number | 输出音频时长（秒） |

---

#### 8. 音频提取

- **task_type**：`extract-audio`
- **请求路径**：`POST /api/v1/tools/extract-audio`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待提取音频的视频 URL，建议 ≤10 GB，最高 4K |
| `format` | String | 否 | 输出音频格式。`mp3` / `m4a`（默认） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `audio_url` | String | 提取的音频地址，有效期 24 小时 |
| `duration` | Number | 输出音频时长（秒） |

---

#### 9. 音视频合成

- **task_type**：`mux-audio-video`
- **请求路径**：`POST /api/v1/tools/mux-audio-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 输入视频 URL，建议 ≤10 GB，最高 4K |
| `audio_url` | String | 是 | 输入音频 URL，建议 ≤10 GB |
| `is_audio_reserve` | Boolean | 否 | 是否保留视频原音轨。`true`（默认，保留并混音）/ `false`（替换原音轨） |
| `is_video_audio_sync` | Boolean | 否 | 是否对齐音视频时长。`false`（默认）/ `true` |
| `sync_mode` | String | 否 | 时长对齐基准，仅 `is_video_audio_sync=true` 时生效。`video`（默认）/ `audio` |
| `sync_method` | String | 否 | 时长对齐方式，仅 `is_video_audio_sync=true` 时生效。`trim`（默认，裁剪）/ `speed`（变速） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 合成后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频总时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

#### 10. 图片转视频

- **task_type**：`image-to-video`
- **请求路径**：`POST /api/v1/tools/image-to-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `images` | Array&lt;Object&gt; | 是 | 图片对象列表，1~100 个 |
| `transitions` | Array | 否 | 图片间转场效果 ID 列表，默认无转场。支持的 ID 同视频拼接 |

**`images` 元素结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `image_url` | String | 是 | 图片 URL |
| `duration` | Number | 否 | 展示时长（秒），默认 3 |
| `animation_type` | String | 否 | 镜头内动画：`move_up` / `move_down` / `move_left` / `move_right` / `zoom_in` / `zoom_out` |
| `animation_in` | Number | 否 | 动画开始时间（秒），默认 0 |
| `animation_out` | Number | 否 | 动画结束时间（秒），默认 = duration |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 生成的视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频总时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

#### 11. 音频混合

- **task_type**：`mix-audio`
- **请求路径**：`POST /api/v1/tools/mix-audio`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `audio_urls` | Array&lt;String&gt; | 是 | 待混合音频 URL 列表，1~100 个，建议单文件 ≤10 GB |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `audio_url` | String | 混合后音频地址（MP3），有效期 24 小时 |
| `duration` | Number | 输出音频时长（秒），以输入音频中最长为准 |

---

#### 12. 音频声音淡入淡出

- **task_type**：`fade-audio`
- **请求路径**：`POST /api/v1/tools/fade-audio`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `audio_url` | String | 是 | 待处理音频 URL，建议 ≤10 GB |
| `fade_in_duration` | Number | 否 | 淡入时长（秒），支持最多 3 位小数，0 或不填表示不执行淡入，默认 1 |
| `fade_out_duration` | Number | 否 | 淡出时长（秒），支持最多 3 位小数，0 或不填表示不执行淡出，默认 1 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `audio_url` | String | 处理后音频地址（MP3），有效期 24 小时 |
| `duration` | Number | 输出音频时长（秒） |

---

#### 13. 调整视频音量

- **task_type**：`adjust-video-volume`（推测）
- **请求路径**：`POST /api/v1/tools/adjust-video-volume`（推测）
- **状态**：⚠️ 官方 API 文档页面内容为空，参数信息未公开

---

#### 14. 视频画面翻转

- **task_type**：`flip-video`
- **请求路径**：`POST /api/v1/tools/flip-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待翻转视频 URL，建议 ≤10 GB，最高 4K |
| `is_flip_vertical` | Boolean | 否 | 是否垂直（上下）翻转，默认 false |
| `is_flip_horizontal` | Boolean | 否 | 是否水平（左右）翻转，默认 false。两个参数至少一个为 true；都为 true 等效旋转 180 度 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 翻转后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

#### 15. 视频画面旋转

- **task_type**：`rotate-video`
- **请求路径**：`POST /api/v1/tools/rotate-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待旋转视频 URL，建议 ≤10 GB，最高 4K |
| `rotate_direction` | String | 是 | 旋转方式：`rotate_left_90`（向左 90 度）/ `rotate_right_90`（向右 90 度）/ `rotate_180`（旋转 180 度） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 旋转后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

#### 16. 视频画面裁剪

- **task_type**：`crop-video`
- **请求路径**：`POST /api/v1/tools/crop-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待裁剪视频 URL，建议 ≤10 GB，最高 4K |
| `top_left_x` | Integer | 是 | 裁剪矩形左上角 X 坐标（px），非负整数 |
| `top_left_y` | Integer | 是 | 裁剪矩形左上角 Y 坐标（px），非负整数 |
| `bottom_right_x` | Integer | 是 | 裁剪矩形右下角 X 坐标（px），必须 > top_left_x，差值 ≥16px |
| `bottom_right_y` | Integer | 是 | 裁剪矩形右下角 Y 坐标（px），必须 > top_left_y，差值 ≥16px |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 裁剪后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

#### 17. 视频画面拼接

- **task_type**：`stitch-video`
- **请求路径**：`POST /api/v1/tools/stitch-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `videos` | Array&lt;Object&gt; | 是 | 待拼接视频对象列表，2~3 个，拼接顺序与列表顺序一致 |
| `stitch_direction` | String | 是 | 拼接方式：`horizontal`（左右拼接）/ `vertical`（上下拼接） |

**`videos` 元素结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 输入视频 URL，建议 ≤10 GB，最高 4K，建议宽高比 16:9、9:16、1:1、4:3、3:4 |
| `keep_audio` | Boolean | 否 | 是否保留该视频音频，默认 true。false 则该视频音轨不合入最终产物 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 拼接后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频时长（秒），与输入视频中最长的一致 |
| `resolution` | String | 输出视频分辨率 |

---

#### 18. 视频加字幕

- **task_type**：`add-subtitle-to-video`
- **请求路径**：`POST /api/v1/tools/add-subtitle-to-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待加字幕视频 URL，建议 ≤10 GB，最高 4K |
| `subtitle_url` | String | 否 | 字幕文件 URL（仅支持 HTTP/HTTPS）。格式：SRT、VTT、ASS。与 `subtitles` 二选一，两者都有时优先 `subtitle_url` |
| `subtitles` | Array&lt;Object&gt; | 否 | 字幕内容列表，与 `subtitle_url` 二选一 |
| `subtitle_pos_preset` | String | 否 | 位置预设：`bottom_center`（默认）/ `top_center` / `center` / `lower_third` |
| `subtitle_font_size` | Integer | 否 | 字体大小（px），默认 50 |
| `subtitle_font_color` | String | 否 | 字体颜色 RGBA（`#RRGGBBAA`），默认 `#FFFFFFFF` |
| `subtitle_font_type` | String | 否 | 字体：`sy_black`（默认）/ `pm_zhengdao` / `zhanku_kuaile` / `ali_puhui` |

**`subtitles` 元素结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `subtitle_text` | String | 是 | 字幕文本 |
| `start_time` | Number | 是 | 起始时间（秒） |
| `end_time` | Number | 是 | 结束时间（秒） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 带字幕视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

#### 19. 视频加图片

- **task_type**：`add-image-to-video`
- **请求路径**：`POST /api/v1/tools/add-image-to-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待加图片视频 URL，建议 ≤10 GB，最高 4K |
| `sub_image_url` | String | 是 | 待添加图片 URL（仅支持 HTTP/HTTPS），推荐透明 PNG |
| `sub_image_width` | String | 否 | 图片宽度，支持像素值（如 "100"）或百分比（如 "10%"），默认 "10%" |
| `sub_image_height` | String | 否 | 图片高度，默认 "5%" |
| `sub_image_pos_x` | String | 否 | 左上角 X 位置，默认 "85%" |
| `sub_image_pos_y` | String | 否 | 左上角 Y 位置，默认 "90%" |
| `start_time` | Number | 否 | 开始显示时间（秒），默认与视频开始一致 |
| `end_time` | Number | 否 | 结束显示时间（秒），默认与视频结束一致 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 加图片后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

#### 20. 视频添加滤镜

- **task_type**：`apply-video-filter`
- **请求路径**：`POST /api/v1/tools/apply-video-filter`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待处理视频 URL，建议 ≤10 GB，最高 4K |
| `filter_style` | String | 否 | 滤镜风格：`spring`（默认，春日）/ `sunset`（晚霞）/ `vivid`（鲜亮）/ `fair_skin`（白皙）/ `food`（食物） |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 处理后视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

#### 21. 视频截取动图

- **task_type**：`extract-animated-image`
- **请求路径**：`POST /api/v1/tools/extract-animated-image`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待截取动图的视频 URL，最高 4K |
| `start_time` | Number | 是 | 截取开始时间（秒），支持最多 3 位小数 |
| `end_time` | Number | 是 | 截取结束时间（秒），必须 > start_time，输出动图时长最大 60 秒 |
| `output_format` | String | 否 | 输出格式：`gif`（默认）/ `webp` |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image_url` | String | 动图地址，有效期 24 小时，输出帧率固定 15 fps |
| `duration` | Number | 动图时长（秒） |
| `resolution` | String | 动图分辨率，最大 480p |

---

#### 22. 视频高斯模糊

- **task_type**：`gaussian-blur-video`
- **请求路径**：`POST /api/v1/tools/gaussian-blur-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 是 | 待处理视频 URL，最高 4K |
| `blur_regions` | Array&lt;Object&gt; | 是 | 高斯模糊配置数组，最多 3 组 |

**`blur_regions` 元素结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `start_time` | Number | 是 | 模糊开始时间（秒），支持最多 3 位小数 |
| `end_time` | Number | 是 | 模糊结束时间（秒），支持最多 3 位小数 |
| `top_left_x` | Integer | 是 | 模糊矩形左上角 X 坐标（px） |
| `top_left_y` | Integer | 是 | 模糊矩形左上角 Y 坐标（px） |
| `bottom_right_x` | Integer | 是 | 模糊矩形右下角 X 坐标（px），必须 > top_left_x |
| `bottom_right_y` | Integer | 是 | 模糊矩形右下角 Y 坐标（px），必须 > top_left_y |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 处理后视频地址（MP4），有效期 24 小时 |
| `resolution` | String | 输出视频分辨率 |
| `duration` | Number | 输出视频时长（秒） |

---

#### 23. 文字生成滚屏视频

- **task_type**：`text-to-scrolling-video`
- **请求路径**：`POST /api/v1/tools/text-to-scrolling-video`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `text` | String | 是 | 滚屏文本内容。支持 `\n` 强制换行。特殊字符 `/` 需输入 `//` 转义 |
| `image_url` | String | 是 | 背景图片 URL，建议宽高比 9:16。图片顶部和底部 10% 区域将用作遮罩 |
| `audio_url` | String | 否 | 背景音乐 URL，将无缝循环播放至视频结束 |
| `resolution` | String | 否 | 输出竖版分辨率（固定 9:16）：`360p`/`480p`/`720p`（默认）/ `1080p` |
| `font_type` | String | 否 | 字体：`sy_black`（默认）/ `pm_zhengdao` / `ali_puhui` / `zhanku_kuaile` |
| `font_color` | String | 否 | 文本颜色 RGBA（`#RRGGBBAA`），默认 `#1F1F1FFF` |
| `single_roll_duration` | Number | 否 | 单页文字滚过屏幕的时长（秒）[0.5, 60]，默认 3 |
| `start_hold_duration` | Number | 否 | 开始时文字静止停留时长（秒）[0, 60]，默认 2 |
| `end_hold_duration` | Number | 否 | 结束时文字静止停留时长（秒）[0, 60]，默认 2 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `video_url` | String | 滚屏视频地址（MP4），有效期 24 小时 |
| `duration` | Number | 输出视频时长（秒） |
| `resolution` | String | 输出视频分辨率 |

---

### 第四部分：音频工具

---

#### 1. 人声背景音分离

- **task_type**：`separate-voice`
- **请求路径**：`POST /api/v1/tools/separate-voice`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 条件必选 | 待处理视频 URL。与 `audio_url` 二选一，都有时优先 `video_url` |
| `audio_url` | String | 条件必选 | 待处理音频 URL（仅支持 HTTP/HTTPS）。与 `video_url` 二选一 |
| `output_format` | String | 否 | 输出音频格式：`aac`（默认）/ `mp3` / `wav` / `m4a` / `flac` |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `voice_audio_url` | String | 分离出的人声音轨地址，有效期 24 小时 |
| `background_audio_url` | String | 分离出的背景音音轨地址，有效期 24 小时 |
| `duration` | Number | 输入音视频总时长（秒） |

---

#### 2. 语音端点识别

- **task_type**：`detect-voice-activity`
- **请求路径**：`POST /api/v1/tools/detect-voice-activity`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `video_url` | String | 条件必选 | 待处理视频 URL。与 `audio_url` 必须且只能提供一个 |
| `audio_url` | String | 条件必选 | 待处理音频 URL。与 `video_url` 必须且只能提供一个 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `voice_segments` | Array&lt;Object&gt; | 有效人声片段列表，未检测到则为空数组 |
| `segment_count` | Integer | 检测到的人声片段数量 |
| `duration` | Number | 输入媒体文件总时长（秒） |

**`voice_segments` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `start_time` | Number | 片段开始时间（秒），精确到小数点后两位 |
| `end_time` | Number | 片段结束时间（秒），精确到小数点后两位 |

---

#### 3. 音频转码

- **task_type**：`transcode-audio`
- **请求路径**：`POST /api/v1/tools/transcode-audio`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `audio_url` | String | 是 | 待转码音频 URL |
| `container_format` | String | 否 | 目标封装格式：`MP3`（默认）/ `M4A` / `OGG` |
| `audio` | Object | 否 | 音频参数配置 |
| `metadata_keep_tags` | Array&lt;String&gt; | 否 | 需保留的元信息标签列表 |
| `metadata_add_tags` | Array&lt;Object&gt; | 否 | 需新增的元信息标签列表 |

**`audio` 结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `sample_rate` | Integer | 否 | 采样率（Hz），默认 48000 |
| `bitrate_mode` | String | 否 | 码率控制模式：`cbr`（默认）/ `cae`（仅 M4A） |
| `bitrate_kbps` | Integer | 否 | 音频码率（Kbps）[10, 500]，默认 128 |
| `channels` | Integer | 否 | 声道数：1=单声道 / 2=双声道（默认） |
| `volume_method` | String | 否 | 音量均衡算法。设为 `2Pass` 启用 |
| `volume_integrated_loudness` | Number | 否 | 目标综合响度（LUFS）[-70, -5]，默认 -12 |
| `volume_true_peak` | Number | 否 | 真实峰值（dBTP）[-9, 0]，默认 0 |
| `volume_loudness_range` | Number | 否 | 响度范围（LU）[1, 20]，默认 7 |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `audio_url` | String | 输出音频地址，有效期 24 小时 |
| `duration` | Number | 音频时长（秒） |

---

#### 4. 音频元信息获取

- **task_type**：`probe-audio-metadata`
- **请求路径**：`POST /api/v1/tools/probe-audio-metadata`
- **业务请求参数**：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `audio_url` | String | 是 | 待探测音频 URL。格式：mp3、m4a、wav、wma、amr、aac、ogg、flac |

- **result 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `format_meta` | Object | 容器层元信息 |
| `audio_stream_meta` | Object | 主音频流元信息（无音频流时为 null） |

**`format_meta` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `md5` | String | 文件 MD5 值 |
| `container` | String | 容器格式（如 MP3） |
| `bitrate` | Number | 容器码率（bps） |
| `duration` | Number | 时长（秒） |
| `size` | Number | 文件大小（Byte） |

**`audio_stream_meta` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `codec` | String | 编码格式（如 aac） |
| `duration` | Number | 时长（秒） |
| `sample_rate` | Number | 采样率（Hz） |
| `bitrate` | Number | 码率（bps） |
| `channels` | Number | 声道数 |

---

### 第五部分：大模型处理工具

---

#### 1. 视频理解拓展工具

- **task_type**：不适用（Chat API 风格，非任务提交型）
- **请求路径**：`POST /api/v1/chat/completions`
- **Base URL**：`https://amk-ark.cn-beijing.volces.com`
- **鉴权**：`Authorization: Bearer {火山方舟API_Key}/{MediaKit_API_Key}`
- **业务请求参数**（仅列出与视频理解相关的核心参数）：

| 参数 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `model` | String | 是 | 火山方舟模型 ID |
| `messages` | Array&lt;Object&gt; | 是 | 消息列表，支持多模态（text、image_url、video_url） |
| `stream` | Boolean | 否 | 是否流式返回，默认 false |
| `max_tokens` | Integer | 否 | 模型回答最大长度（token），默认 4096 |
| `temperature` | Float | 否 | 采样温度 [0, 2]，默认 1 |
| `top_p` | Float | 否 | 核采样概率阈值 [0, 1]，默认 0.7 |
| `thinking` | Object | 否 | 深度思考模式控制：`{"type": "enabled"}` / `{"type": "disabled"}` / `{"type": "auto"}` |
| `reasoning_effort` | String | 否 | 思考力度：`minimal` / `low` / `medium`（默认）/ `high` |
| `response_format` | Object | 否 | 响应格式：`{"type": "text"}` / `{"type": "json_object"}` / `{"type": "json_schema"}` |

**`messages` 元素结构**：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `role` | String | 是 | 消息角色：`system` / `user` / `assistant` / `tool` |
| `content` | String 或 Array&lt;Object&gt; | 是 | 消息内容，可为纯文本或多模态对象数组 |

**`content` 多模态数组元素类型**：

| type 值 | 说明 |
| --- | --- |
| `text` | 文本内容，含 `text` 子字段 |
| `image_url` | 图片内容，含 `image_url` 对象（含 `url` 子字段） |
| `video_url` | 视频内容，含 `video_url` 对象 |

**`video_url` 对象结构**（视频理解核心）：

| 字段 | 类型 | 必选 | 说明 |
| --- | --- | --- | --- |
| `url` | String | 是 | 视频 URL 或 Base64 编码数据。通过 URL 传入支持最高 5 GB 大视频文件 |
| `fps` | Float | 否 | 抽帧频率（帧/秒）[0.01, 5]，默认 1 |
| `max_frames` | - | 否 | 单次任务最大抽帧数量上限 |
| `max_pixels` | - | 否 | 单帧画面最大分辨率（宽×高），默认 677,376，最大 9,031,680 |

- **响应结构（非流式）**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | String | 唯一请求标识 |
| `model` | String | 实际使用的模型名称和版本 |
| `created` | Integer | 请求创建的 Unix 时间戳（秒） |
| `object` | String | 固定值 `chat.completion` |
| `choices` | Array&lt;Object&gt; | 模型输出内容数组 |
| `usage` | Object | Token 使用统计 |

**`choices` 元素结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `index` | Integer | 索引 |
| `finish_reason` | String | 停止原因：`stop` / `length` / `content_filter` / `tool_calls` |
| `message` | Object | 模型输出消息 |

**`message` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `role` | String | 固定 `assistant` |
| `content` | String | 模型生成的消息内容 |
| `reasoning_content` | String | 链式思考内容（仅深度推理模型） |
| `tool_calls` | Array&lt;Object&gt; | 模型生成的工具调用 |

**`usage` 结构**：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `total_tokens` | Integer | 总 token 数 |
| `prompt_tokens` | Integer | 输入 token 数 |
| `completion_tokens` | Integer | 输出 token 数 |
| `completion_tokens_details.reasoning_tokens` | Integer | 思考推理消耗的 token 数 |

---

## 四、统计与说明

### 4.1 统计汇总

| 工具分类 | API 数量 | 异步接口 | 同步接口 | Chat API |
| --- | --- | --- | --- | --- |
| 视频工具 | 27 | 27 | 0 | 0 |
| 图像工具 | 24 | 0 | 24 | 0 |
| 剪辑工具 | 23 | 23 | 0 | 0 |
| 音频工具 | 5 | 5 | 0 | 0 |
| 大模型处理工具 | 1 | 0 | 0 | 1 |
| **合计** | **80** | **55** | **24** | **1** |

> 注：部分工具包含多个子 API（如视频暗水印含添加+提取、视频抠图含绿幕+人像、视频画面变换含翻转+旋转+裁剪+拼接、图像基础编辑含 12 个子工具、音视频调速含视频+音频、音量调节与淡入淡出含 2 个 API），均分别独立统计。

### 4.2 文档缺失说明

以下工具的官方 API 文档页面内容为空，参数信息依据命名约定推断，实际请以官方更新为准：

| 工具名称 | 推测 task_type | 推测请求路径 | 说明 |
| --- | --- | --- | --- |
| 视频转码 | `encode-video` | `/api/v1/tools/encode-video` | 文档页面 [2488141](https://docs.volcengine.com/docs/6448/2488141) 为空，参数结构可参考极智超清 |
| 调整视频音量 | `adjust-video-volume` | `/api/v1/tools/adjust-video-volume` | 文档页面为空，参数结构可参考音频声音淡入淡出 |
| 画质增强（极速版） | `enhance-video-fast` | `/api/v1/tools/enhance-video-fast` | 依据命名约定推断，未抓取到独立 API 文档 |

### 4.3 参考链接

| 资源 | 链接 |
| --- | --- |
| AI MediaKit 介绍 | https://www.volcengine.com/docs/6448/2222230 |
| 智能处理文档首页 | https://www.volcengine.com/docs/6448 |
| 查询任务信息 API | https://docs.volcengine.com/docs/6448/2278532 |
| 错误码 | https://docs.volcengine.com/docs/6448/2300662 |
| 多源媒体输入与本地上传 | https://docs.volcengine.com/docs/6448/2536893 |
| 事件回调 | https://docs.volcengine.com/docs/6448/2288701 |
| API Key 管理控制台 | https://console.volcengine.com/imp/ai-mediakit/settings |
