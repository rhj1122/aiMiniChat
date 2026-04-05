// 配置层
// 规则：只读取环境变量，不包含业务常量和业务逻辑
// 业务常量放在 src/types/index.ts

export const appConfig = {
  // AI 服务地址（本地 VoltAgent 开发时使用，后续替换为公司网关）
  aiBaseUrl: import.meta.env.VITE_AI_BASE_URL ?? 'http://localhost:3141',
} as const
