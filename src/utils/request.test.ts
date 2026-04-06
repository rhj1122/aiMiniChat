// src/utils/request.test.ts

import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// 存储拦截器回调，以便测试中调用
let requestInterceptorFulfilled: (config: AxiosRequestConfig) => AxiosRequestConfig
let requestInterceptorRejected: (error: unknown) => Promise<never>
let responseInterceptorFulfilled: (response: AxiosResponse) => unknown
let responseInterceptorRejected: (error: unknown) => Promise<never>

const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPut = vi.fn()
const mockDelete = vi.fn()

// Mock axios，捕获拦截器注册
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
      interceptors: {
        request: {
          use: vi.fn((fulfilled, rejected) => {
            requestInterceptorFulfilled = fulfilled
            requestInterceptorRejected = rejected
          }),
        },
        response: {
          use: vi.fn((fulfilled, rejected) => {
            responseInterceptorFulfilled = fulfilled
            responseInterceptorRejected = rejected
          }),
        },
      },
    })),
  },
}))

// import 必须在 vi.mock 之后（Vitest 会自动提升 vi.mock）
const { get, post, put, del } = await import('./request')

describe('request', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── 请求方法测试 ──────────────────────────────────────

  test('get 应该调用 axios.get', async () => {
    const mockData = { data: { id: 1 } }
    mockGet.mockResolvedValue(mockData)

    const result = await get('/api/test')

    expect(mockGet).toHaveBeenCalledWith('/api/test', undefined)
    expect(result).toEqual(mockData)
  })

  test('post 应该调用 axios.post 并传递 data', async () => {
    const mockData = { data: { success: true } }
    const postData = { name: '测试' }
    mockPost.mockResolvedValue(mockData)

    const result = await post('/api/test', postData)

    expect(mockPost).toHaveBeenCalledWith('/api/test', postData, undefined)
    expect(result).toEqual(mockData)
  })

  test('put 应该调用 axios.put 并传递 data', async () => {
    const mockData = { data: { success: true } }
    const putData = { name: '更新' }
    mockPut.mockResolvedValue(mockData)

    const result = await put('/api/test/1', putData)

    expect(mockPut).toHaveBeenCalledWith('/api/test/1', putData, undefined)
    expect(result).toEqual(mockData)
  })

  test('del 应该调用 axios.delete', async () => {
    const mockData = { data: { success: true } }
    mockDelete.mockResolvedValue(mockData)

    const result = await del('/api/test/1')

    expect(mockDelete).toHaveBeenCalledWith('/api/test/1', undefined)
    expect(result).toEqual(mockData)
  })

  // ─── 请求拦截器测试 ────────────────────────────────────

  test('请求拦截器应该添加 Authorization 和 Token 到 header', () => {
    const mockConfig = { headers: {} } as AxiosRequestConfig & { headers: Record<string, string> }

    const result = requestInterceptorFulfilled(mockConfig) as typeof mockConfig

    expect(result.headers.Authorization).toBe('temp-token-placeholder')
    expect(result.headers.Token).toBe('temp-token-placeholder')
  })

  test('请求拦截器错误时应该 reject', async () => {
    const error = new Error('请求配置错误')
    await expect(requestInterceptorRejected(error)).rejects.toThrow('请求配置错误')
  })

  // ─── 响应拦截器测试 ────────────────────────────────────

  test('响应拦截器成功时应该返回 response.data', () => {
    const mockResponse = {
      data: { id: 1, name: '测试' },
      status: 200,
    } as AxiosResponse

    const result = responseInterceptorFulfilled(mockResponse)

    expect(result).toEqual({ id: 1, name: '测试' })
  })

  test('响应拦截器失败时应该返回 rejected Promise', async () => {
    const mockError = {
      response: { status: 500, data: { message: '服务器错误' } },
    }

    await expect(responseInterceptorRejected(mockError)).rejects.toThrow('服务器错误')
  })

  test('响应拦截器 401 时应该提示未授权', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const mockError = {
      response: { status: 401, data: { message: '未授权' } },
    }

    await expect(responseInterceptorRejected(mockError)).rejects.toThrow('未授权')
    expect(consoleSpy).toHaveBeenCalledWith('未授权，需要重新登录')

    consoleSpy.mockRestore()
  })
})
