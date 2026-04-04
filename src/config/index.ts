// 配置层
// 规则：只依赖 Types 层，从环境变量读取配置，不包含业务逻辑

import type { AIConfig } from '@/types'

export const appConfig = {
  // AI 服务地址（本地 VoltAgent 开发时使用）
  aiBaseUrl: import.meta.env.VITE_AI_BASE_URL ?? 'http://localhost:3141',

  // 默认 AI 配置
  defaultAIConfig: {
    model: 'gpt-4o-mini',
    temperature: 0.7,
  } satisfies AIConfig,
} as const
