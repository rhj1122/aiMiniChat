// src/hooks/useAIChat.test.ts

import { renderHook, act } from '@testing-library/react'
import { useAIChat } from './useAIChat'
import { useChatStore } from '@/store/chatStore'
import { streamMessage } from '@/api/aiApi'

// Mock API 层（不真的发 WebSocket 请求）
vi.mock('@/api/aiApi', () => ({
  streamMessage: vi.fn(),
}))

describe('useAIChat', () => {
  // 每个测试前重置状态
  beforeEach(() => {
    vi.clearAllMocks()
    useChatStore.setState({ messages: [], isLoading: false })
  })

  // ─── 测试初始状态 ───────────────────────────────────────

  test('初始状态应该没有消息，不在流式输出中', () => {
    const { result } = renderHook(() => useAIChat())

    expect(result.current.messages).toHaveLength(0)
    expect(result.current.isStreaming).toBe(false)
  })

  // ─── 测试 sendMessage ──────────────────────────────────

  test('sendMessage 应该添加用户消息和 AI 占位消息', async () => {
    // Mock streamMessage 返回空的流（不产生任何 chunk）
    vi.mocked(streamMessage).mockImplementation(async function* () {
      // 模拟空响应，yield 空字符串
      yield ''
    })

    const { result } = renderHook(() => useAIChat())

    await act(async () => {
      await result.current.sendMessage('你好')
    })

    // 应该有 2 条消息：用户消息 + AI 占位消息
    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[0].role).toBe('user')
    expect(result.current.messages[0].content).toBe('你好')
    expect(result.current.messages[1].role).toBe('assistant')
  })

  test('sendMessage 应该调用 streamMessage API', async () => {
    vi.mocked(streamMessage).mockImplementation(async function* () {
      yield '你好！'
    })

    const { result } = renderHook(() => useAIChat())

    await act(async () => {
      await result.current.sendMessage('你好')
    })

    // 验证 API 被调用了
    expect(streamMessage).toHaveBeenCalledTimes(1)
  })

  test('sendMessage 空内容时不应该发送', async () => {
    const { result } = renderHook(() => useAIChat())

    await act(async () => {
      await result.current.sendMessage('')
      await result.current.sendMessage('   ')
    })

    expect(result.current.messages).toHaveLength(0)
    expect(streamMessage).not.toHaveBeenCalled()
  })

  test('streamMessage 失败时应该显示错误消息', async () => {
    vi.mocked(streamMessage).mockImplementation(async function* () {
      yield '' // 需要至少一个 yield 才能满足 require-yield 规则
      throw new Error('连接失败')
    })

    const { result } = renderHook(() => useAIChat())

    await act(async () => {
      await result.current.sendMessage('你好')
    })

    // 最后一条消息应该包含错误提示
    const lastMsg = result.current.messages[result.current.messages.length - 1]
    expect(lastMsg.content).toContain('错误')
    // 流式状态应该恢复
    expect(result.current.isStreaming).toBe(false)
  })

  // ─── 测试 clearMessages ────────────────────────────────

  test('clearMessages 应该清空所有消息', async () => {
    vi.mocked(streamMessage).mockImplementation(async function* () {
      yield '回复'
    })

    const { result } = renderHook(() => useAIChat())

    // 先发一条消息
    await act(async () => {
      await result.current.sendMessage('你好')
    })
    expect(result.current.messages.length).toBeGreaterThan(0)

    // 清空
    act(() => {
      result.current.clearMessages()
    })
    expect(result.current.messages).toHaveLength(0)
  })
})
