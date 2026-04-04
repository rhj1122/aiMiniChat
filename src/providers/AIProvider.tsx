// Providers 层 - AIProvider
// 规则：封装 AI SDK 调用，统一管理 AI 服务入口
// 所有 AI 调用必须通过此 Provider，禁止在其他层直接调用 AI SDK

import { createContext, use, useMemo, type ReactNode } from 'react'
import { streamMessage, sendMessage } from '@/api/aiApi'
import type { Message } from '@/types'

interface AIProviderValue {
  streamMessage: (messages: Message[]) => AsyncGenerator<string>
  sendMessage: (messages: Message[]) => Promise<Message>
}

const AIContext = createContext<AIProviderValue | null>(null)

export function AIProvider({ children }: { children: ReactNode }) {
  // useMemo 防止每次渲染都创建新对象（避免 no-unstable-context-value warning）
  const value = useMemo<AIProviderValue>(
    () => ({
      streamMessage,
      sendMessage,
    }),
    []
  )

  return <AIContext value={value}>{children}</AIContext>
}

export function useAIProvider(): AIProviderValue {
  // React 19 推荐用 use() 替代 useContext()
  const context = use(AIContext)
  if (!context) {
    throw new Error('useAIProvider 必须在 AIProvider 内部使用')
  }
  return context
}
