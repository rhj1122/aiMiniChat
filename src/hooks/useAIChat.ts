// Hooks 层 - useAiChat
// 规则：只依赖 Store、API、Types 层
// 只返回数据和方法，不返回 JSX

// TODO: 后续基于 WebSocket 重新实现 AI 对话逻辑

import { useChatStore } from '@/store/chatStore';

export function useAiChat() {
  const { messages, clearMessages } = useChatStore();

  return {
    messages,
    clearMessages,
  };
}
