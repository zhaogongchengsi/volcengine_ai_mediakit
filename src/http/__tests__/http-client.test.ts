import axios from 'axios'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, HttpClient } from '../index.js'

vi.mock('axios', () => {
  const mockGet = vi.fn()
  const mockPost = vi.fn()
  const mockRequest = vi.fn()

  // Capture the error handler registered on the response interceptor
  let responseOkHandler: ((v: unknown) => unknown) | undefined
  let responseErrHandler: ((e: unknown) => unknown) | undefined

  const instance = {
    get: mockGet,
    post: mockPost,
    request: mockRequest,
    interceptors: {
      request: { use: vi.fn() },
      response: {

        use: vi.fn((ok: unknown, err: unknown) => {
          responseOkHandler = ok as typeof responseOkHandler
          responseErrHandler = err as typeof responseErrHandler
        }),
      },
    },
  }

  return {
    default: {
      create: vi.fn(() => instance),
      __mock: {
        mockGet,
        mockPost,
        mockRequest,
        instance,
        getResponseOkHandler: () => responseOkHandler,
        getResponseErrHandler: () => responseErrHandler,
      },
    },
  }
})

const { mockGet, mockPost } = (axios as unknown as {
  __mock: {
    mockGet: ReturnType<typeof vi.fn>
    mockPost: ReturnType<typeof vi.fn>
    mockRequest: ReturnType<typeof vi.fn>
    instance: Record<string, unknown>
  }
}).__mock

beforeEach(() => {
  vi.clearAllMocks()
})

describe('httpClient', () => {
  describe('get', () => {
    it('calls axios get and returns ApiResponse data', async () => {
      const apiResponse = { success: true, request_id: 'req-001' }
      mockGet.mockResolvedValue({ data: apiResponse })

      const client = new HttpClient()
      const result = await client.get('/api/v1/tasks/123')

      expect(mockGet).toHaveBeenCalledWith(
        '/api/v1/tasks/123',
        expect.objectContaining({}),
      )
      expect(result).toEqual(apiResponse)
    })

    it('passes instance apiKey via config', async () => {
      mockGet.mockResolvedValue({ data: { success: true } })

      const client = new HttpClient()
      client.setApiKey('my-key')
      await client.get('/test')

      expect(mockGet).toHaveBeenCalledWith(
        '/test',
        expect.objectContaining({ apiKey: 'my-key' }),
      )
    })

    it('uses request-level apiKey over instance key', async () => {
      mockGet.mockResolvedValue({ data: { success: true } })

      const client = new HttpClient()
      client.setApiKey('instance-key')
      await client.get('/test', { apiKey: 'override-key' })

      const callConfig = mockGet.mock.calls[0][1]
      expect(callConfig.apiKey).toBe('override-key')
    })

    it('defaults baseURL correctly', () => {
      void new HttpClient()
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://mediakit.cn-beijing.volces.com',
        }),
      )
    })

    it('accepts custom baseURL', () => {
      void new HttpClient('https://custom.example.com')
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({ baseURL: 'https://custom.example.com' }),
      )
    })
  })

  describe('post', () => {
    it('calls axios post with URL and body', async () => {
      const body = { video_url: 'https://example.com/video.mp4' }
      const apiResponse = {
        success: true,
        task_id: 'task-001',
        request_id: 'req-001',
      }
      mockPost.mockResolvedValue({ data: apiResponse })

      const client = new HttpClient()
      const result = await client.post('/api/v1/tools/enhance-video', body)

      expect(mockPost).toHaveBeenCalledWith(
        '/api/v1/tools/enhance-video',
        body,
        expect.any(Object),
      )
      expect(result).toEqual(apiResponse)
    })
  })

  describe('request', () => {
    it('calls axios request with full config', async () => {
      const { mockRequest } = (axios as unknown as {
        __mock: { mockRequest: ReturnType<typeof vi.fn> }
      }).__mock

      mockRequest.mockResolvedValue({ data: { success: true } })

      const client = new HttpClient()
      await client.request({ method: 'DELETE', url: '/api/v1/tasks/123' })

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'DELETE', url: '/api/v1/tasks/123' }),
      )
    })
  })

  describe('error handling', () => {
    it('wraps response errors in ApiError', async () => {
      const errHandler = (axios as unknown as {
        __mock: { getResponseErrHandler: () => ((e: unknown) => Promise<unknown>) | undefined }
      }).__mock.getResponseErrHandler()

      const axiosError = {
        response: { status: 400, data: { message: 'Bad request' } },
      }

      await expect(errHandler!(axiosError)).rejects.toThrow(ApiError)
    })

    it('apiError carries status and data', async () => {
      const errHandler = (axios as unknown as {
        __mock: { getResponseErrHandler: () => ((e: unknown) => Promise<unknown>) | undefined }
      }).__mock.getResponseErrHandler()

      const axiosError = {
        response: { status: 403, data: { message: 'Forbidden' } },
      }

      try {
        await errHandler!(axiosError)
        expect.fail('should have thrown')
      }
      catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect((e as ApiError).status).toBe(403)
        expect((e as ApiError).data).toEqual({ message: 'Forbidden' })
      }
    })
  })
})
