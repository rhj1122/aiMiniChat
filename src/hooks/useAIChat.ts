// Hooks 层 - useAIChat
// 规则：只依赖 Store、API、Types 层
// 只返回数据和方法，不返回 JSX

import { useState, useCallback } from 'react'
import { useChatStore } from '@/store/chatStore'
import { streamMessage } from '@/api/aiApi'
import type { Message } from '@/types'

export function useAIChat() {
  const { messages, addMessage, updateLastMessage, clearMessages, setLoading } = useChatStore()
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return

      // 添加用户消息
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: Date.now(),
      }
      addMessage(userMessage)

      // 添加 AI 消息占位
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      }
      addMessage(assistantMessage)

      setIsStreaming(true)
      setLoading(true)

      try {
        let fullContent = ''
        for await (const chunk of streamMessage([...messages, userMessage])) {
          fullContent += chunk
          updateLastMessage(fullContent)
        }
      } catch (error) {
        updateLastMessage('抱歉，发生了错误，请重试。')
        console.error('AI 请求失败:', error)
      } finally {
        setIsStreaming(false)
        setLoading(false)
      }
    },
    [messages, isStreaming, addMessage, updateLastMessage, setLoading]
  )

  return {
    messages,
    isStreaming,
    sendMessage,
    clearMessages,
  }
}
