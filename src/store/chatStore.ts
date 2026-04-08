// Store 层 - chatStore
// 规则：只依赖 Types 层，不包含 UI 逻辑
// 存储消息列表状态

import { create } from 'zustand';
import type { Message, AnyRecord } from '@/types';

// ─── Updaters ────────────────────────────────────────────────

// 默认更新：直接按字段名赋值
function defaultUpdate(target: AnyRecord, key: string, value: unknown): AnyRecord {
  return { ...target, [key]: value };
}

// ext 更新：更新 target.ext 下的字段（key 格式为 "ext.xxx"）
function extUpdate(target: AnyRecord, key: string, value: unknown): AnyRecord {
  const extKey = key.replace(/^ext\./, '');
  const ext = (target.ext ?? {}) as AnyRecord;
  return {
    ...target,
    ext: { ...ext, [extKey]: value },
  };
}

// 追加文本更新：对指定字段使用 += 追加
function appendTextUpdate(target: AnyRecord, key: string, value: unknown): AnyRecord {
  const current = (target[key] ?? '') as string;
  return { ...target, [key]: current + String(value) };
}

// 根据 key 直接返回更新后的对象
function getUpdatedData(target: AnyRecord, key: string, value: unknown): AnyRecord {
  switch (key) {
    case 'content':
      return appendTextUpdate(target, key, value);
    case 'setContent':
      return defaultUpdate(target, 'content', value);
    default:
      if (key.startsWith('ext.')) return extUpdate(target, key, value);
      return defaultUpdate(target, key, value);
  }
}

// 对目标对象应用所有字段更新
function applyFields<T extends AnyRecord>(target: T, fields: AnyRecord): T {
  let updated: AnyRecord = { ...target };
  for (const key of Object.keys(fields)) {
    updated = getUpdatedData(updated, key, fields[key]);
  }
  return updated as T;
}

// ─── Store ───────────────────────────────────────────────────

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (qaId: string, messageId: string, fields: AnyRecord) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  messages: [],

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (qaId, messageId, fields) =>
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.qaId !== qaId) return msg;

        // 匹配 question
        if (msg.question.messageId === messageId) {
          return {
            ...msg,
            question: applyFields(
              msg.question as unknown as AnyRecord,
              fields,
            ) as unknown as typeof msg.question,
          };
        }

        // 匹配 answers 中的某一项
        return {
          ...msg,
          answers: msg.answers.map((answer) => {
            if (answer.messageId !== messageId) return answer;
            return applyFields(answer as unknown as AnyRecord, fields) as unknown as typeof answer;
          }),
        };
      }),
    })),

  clearMessages: () => set({ messages: [] }),
}));
