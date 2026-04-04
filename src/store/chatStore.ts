// Store 层
// 规则：只依赖 API、Types 层，不包含 UI 逻辑
// 存储需要跨组件共享的状态

import { create } from 'zustand'
import type { Message } from '@/types'

interface ChatStore {
  messages: Message[]
  isLoading: boolean
  addMessage: (message: Message) => void
  updateLastMessage: (content: string) => void
  clearMessages: () => void
  setLoading: (loading: boolean) => void
}

export const useChatStore = create<ChatStore>()(set => ({
  messages: [],
  isLoading: false,

  addMessage: message =>
    set(state => ({
      messages: [...state.messages, message],
    })),

  updateLastMessage: content =>
    set(state => {
      const messages = [...state.messages]
      const last = messages[messages.length - 1]
      if (last) {
        messages[messages.length - 1] = { ...last, content }
      }
      return { messages }
    }),

  clearMessages: () => set({ messages: [] }),

  setLoading: loading => set({ isLoading: loading }),
}))
