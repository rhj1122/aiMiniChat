// Providers 层 - AiProvider
// 规则：封装 AI 服务调用，统一管理 AI 服务入口

// TODO: 后续基于 WebSocket 重新实现 AiProvider

import { createContext, use, type ReactNode } from 'react'

interface AiProviderValue {
  // TODO: WebSocket 连接方法将在这里定义
}

const AiContext = createContext<AiProviderValue | null>(null)

export function AiProvider({ children }: { children: ReactNode }) {
  const value: AiProviderValue = {}

  return <AiContext value={value}>{children}</AiContext>
}

export function useAiProvider(): AiProviderValue {
  const context = use(AiContext)
  if (!context) {
    throw new Error('useAiProvider 必须在 AiProvider 内部使用')
  }
  return context
}
