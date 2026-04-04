// API 层
// 规则：只依赖 Types、Config 层
// 只做请求/响应转换，不包含业务判断
// Hooks 层通过此层访问网络，不直接 fetch

import type { Message } from '@/types'
import { appConfig } from '@/config'

// ─── 发送消息（非流式，占位）────────────────────────────────────

export async function sendMessage(messages: Message[]): Promise<Message> {
  const response = await fetch(`${appConfig.aiBaseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    throw new Error(`AI 服务请求失败: ${response.status}`)
  }

  return response.json() as Promise<Message>
}

// ─── 流式发送消息（SSE）─────────────────────────────────────────

export async function* streamMessage(messages: Message[]): AsyncGenerator<string> {
  const response = await fetch(`${appConfig.aiBaseUrl}/api/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok || !response.body) {
    throw new Error(`AI 流式请求失败: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    if (chunk) yield chunk
  }
}
