// 类型定义层（最底层）
// 规则：只包含 interface、type、enum，无副作用，无业务逻辑
// 可以被任何层依赖

// ─── 消息相关 ───────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  isStreaming?: boolean
}

// ─── AI 配置相关 ─────────────────────────────────────────────

export interface AIConfig {
  model: string
  temperature?: number
  maxTokens?: number
}

// ─── API 响应相关 ─────────────────────────────────────────────

export interface ApiError {
  code: number
  message: string
}

export interface ApiResponse<T> {
  data: T
  error?: ApiError
}

// ─── 用户相关 ─────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  avatar?: string
}

// ─── 常量 ──────────────────────────────────────────────────────
// 业务常量放在 Types 层，任何层都可以依赖

export const DEFAULT_AI_CONFIG: AIConfig = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
}

export const MESSAGE_MAX_LENGTH = 4000
