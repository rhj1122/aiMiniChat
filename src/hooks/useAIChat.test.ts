// src/hooks/useAiChat.test.ts

import { renderHook, act } from '@testing-library/react'
import { useAiChat } from './useAiChat'
import { useChatStore } from '@/store/chatStore'

describe('useAiChat', () => {
  beforeEach(() => {
    useChatStore.setState({ messages: [] })
  })

  test('初始状态应该没有消息', () => {
    const { result } = renderHook(() => useAiChat())
    expect(result.current.messages).toHaveLength(0)
  })

  test('clearMessages 应该清空所有消息', () => {
    // 先手动添加一条消息（使用新的 Message 结构）
    useChatStore.getState().addMessage({
      qaId: 'qa-1',
      question: {
        messageId: 'q-1',
        createTime: Date.now(),
        sessionId: 'session-1',
        moduleType: 'main',
        content: '你好',
        attachments: [],
        requestIdList: ['req-1'],
        ext: {},
      },
      answers: [
        {
          messageId: 'a-1',
          createTime: Date.now(),
          sessionId: 'session-1',
          moduleType: 'main',
          content: '',
          contentAssets: [],
          status: 3,
          likeStatus: 0,
          requestId: 'req-1',
          ext: {},
        },
      ],
      answerActiveIndex: 0,
      fromHistory: false,
    })

    const { result } = renderHook(() => useAiChat())
    expect(result.current.messages).toHaveLength(1)

    act(() => {
      result.current.clearMessages()
    })
    expect(result.current.messages).toHaveLength(0)
  })
})
