import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import type { ApiResponse } from './types.js'

import axios from 'axios'

export type { ApiResponse }

/** 扩展 Axios 配置，支持单次调用覆盖 API Key */
export interface RequestConfig extends AxiosRequestConfig {
  apiKey?: string
}

/* ── Error ── */

export class ApiError extends Error {
  name = 'ApiError'

  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message)
  }
}

/* ── Client ── */

let globalApiKey: string | undefined

/**
 * 设置全局 API Key，后续所有请求默认使用此 Key 鉴权。
 * 单次请求可通过 `RequestConfig.apiKey` 覆盖。
 */
export function setApiKey(key: string): void {
  globalApiKey = key
}

function createClient(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 30_000,
    headers: { 'Content-Type': 'application/json' },
  })

  /* 请求拦截：注入 Authorization 头 */
  instance.interceptors.request.use((config) => {
    const key = (config as RequestConfig).apiKey ?? globalApiKey
    if (key) {
      config.headers.Authorization = key
    }
    return config
  })

  /* 响应拦截：统一错误处理 */
  instance.interceptors.response.use(
    response => response,
    (error: AxiosError<{ message?: string }>) => {
      if (error.response) {
        const { status, data } = error.response
        return Promise.reject(
          new ApiError(data?.message ?? `Request failed (${status})`, status, data),
        )
      }
      if (error.request) {
        return Promise.reject(new ApiError('No response from server', 0))
      }
      return Promise.reject(new ApiError(error.message, -1))
    },
  )

  return instance
}

/**
 * 可实例化的 HTTP 客户端。
 * 如需自定义 baseURL（如测试环境），可创建独立实例。
 */
export class HttpClient {
  private client: AxiosInstance
  private apiKey?: string

  constructor(baseURL = 'https://mediakit.cn-beijing.volces.com') {
    this.client = createClient(baseURL)
  }

  /** 设置当前实例的 API Key */
  setApiKey(key: string): void {
    this.apiKey = key
  }

  /** 获取当前实例的 API Key */
  getApiKey(): string | undefined {
    return this.apiKey
  }

  async get<T = unknown>(
    url: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const merged: RequestConfig = {
      ...config,
      apiKey: config?.apiKey ?? this.apiKey,
    }
    const { data } = await this.client.get<ApiResponse<T>>(url, merged)
    return data
  }

  async post<T = unknown>(
    url: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const merged: RequestConfig = {
      ...config,
      apiKey: config?.apiKey ?? this.apiKey,
    }
    const { data } = await this.client.post<ApiResponse<T>>(url, body, merged)
    return data
  }

  /**
   * 发起任意 HTTP 请求，直接传递 Axios 配置。
   * 适用于非标准端点或需要精细控制的场景。
   */
  async request<T = unknown>(
    config: AxiosRequestConfig & { apiKey?: string },
  ): Promise<ApiResponse<T>> {
    const merged: AxiosRequestConfig & { apiKey?: string } = {
      ...config,
      apiKey: config.apiKey ?? this.apiKey,
    }
    const { data } = await this.client.request<ApiResponse<T>>(merged)
    return data
  }
}

/* ── 单例默认客户端 ── */

const defaultClient = new HttpClient()

/**
 * 默认 HTTP 请求器，直接使用全局 API Key，适合快速调用。
 *
 * @example
 * ```ts
 * import { http, setApiKey } from 'volcengine-ai-mediakit'
 *
 * setApiKey('Bearer your-api-key')
 *
 * // 提交任务
 * const res = await http.post('/api/v1/tools/enhance-video', {
 *   video_url: 'https://...',
 *   resolution: '1080p',
 * })
 * ```
 */
export const http = {
  get: <T>(url: string, config?: RequestConfig) =>
    defaultClient.get<T>(url, config),

  post: <T>(url: string, body?: unknown, config?: RequestConfig) =>
    defaultClient.post<T>(url, body, config),
}
