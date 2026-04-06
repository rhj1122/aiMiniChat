// API 层 - 通用接口
// 规则：只依赖 Types、Config 层
// 只做请求/响应转换，不包含业务判断

import { get } from '@/utils/request'
import type { ApiResponse } from '@/types'

// ─── 获取应用配置 ─────────────────────────────────────────────

export function getConfig(): Promise<ApiResponse<unknown>> {
  return get('/config')
}
