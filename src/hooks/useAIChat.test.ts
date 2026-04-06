// src/hooks/useAiChat.test.ts

import { renderHook, act } from '@testing-library/react'
import { useAiChat } from './useAiChat'
import { useChatStore } from '@/store/chatStore'

describe('useAiChat', () => {
  beforeEach(() => {
    useChatStore.setState({ messages: [], isLoading: false })
  })

  test('初始状态应该没有消息', () => {
    const { result } = renderHook(() => useAiChat())
    expect(result.current.messages).toHaveLength(0)
  })

  test('clearMessages 应该清空所有消息', () => {
    // 先手动添加一条消息
    useChatStore.getState().addMessage({
      id: '1',
      role: 'user',
      content: '你好',
      timestamp: Date.now(),
    })

    const { result } = renderHook(() => useAiChat())
    expect(result.current.messages).toHaveLength(1)

    act(() => {
      result.current.clearMessages()
    })
    expect(result.current.messages).toHaveLength(0)
  })
})
