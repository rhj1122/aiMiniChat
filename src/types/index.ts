// 类型定义层（最底层）
// 规则：只包含 interface、type、enum，无副作用，无业务逻辑
// 可以被任何层依赖

// ─── 消息相关 ───────────────────────────────────────────────

export interface Question {
  messageId: string
  createTime: number
  sessionId: string
  moduleType: string
  content: string
  attachments: unknown[]
  requestIdList: string[]
  ext: Record<string, unknown>
}

export interface Answer {
  messageId: string
  createTime: number
  sessionId: string
  moduleType: string
  content: string
  contentAssets: unknown[]
  status: number
  likeStatus: number
  requestId: string
  ext: Record<string, unknown>
}

export interface Message {
  qaId: string
  question: Question
  answers: Answer[]
  answerActiveIndex: number
  fromHistory: boolean
}

// ─── 通用工具类型 ─────────────────────────────────────────────

export type AnyRecord = Record<string, unknown>

// ─── 常量 ──────────────────────────────────────────────────────
// 业务常量放在 Types 层，任何层都可以依赖

export const QA_STATUS = {
  analyzing: 3,
  thinking: 4,
  replying: 5,
  finished: 6,
}



// 以上为正确业务代码，有效
// 以下为架构模板代码，无用






// ─── AI 配置相关 ─────────────────────────────────────────────

export interface AiConfig {
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


