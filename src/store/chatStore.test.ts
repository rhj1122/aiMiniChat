// src/store/chatStore.test.ts

import { useChatStore } from './chatStore';
import type { Message } from '@/types';

// 测试用的 mock 数据工厂
function createMockMessage(qaId: string, questionId: string, answerIds: string[]): Message {
  return {
    qaId,
    question: {
      messageId: questionId,
      createTime: Date.now(),
      sessionId: 'session-1',
      moduleType: 'main',
      content: `问题-${qaId}`,
      attachments: [],
      requestIdList: answerIds.map(id => `req-${id}`),
      ext: {},
    },
    answers: answerIds.map(id => ({
      messageId: id,
      createTime: Date.now(),
      sessionId: 'session-1',
      moduleType: 'main',
      content: `回答-${id}`,
      contentAssets: [],
      status: 3,
      likeStatus: 0,
      requestId: `req-${id}`,
      ext: {},
    })),
    answerActiveIndex: 0,
    fromHistory: false,
  };
}

// 预置多条数据，用于验证索引是否正确
function seedMessages() {
  const store = useChatStore.getState();
  store.addMessage(createMockMessage('qa-1', 'q-1', ['a-1', 'a-2']));
  store.addMessage(createMockMessage('qa-2', 'q-2', ['a-3', 'a-4']));
}

// 按 qaId + messageId 查找 answer 的辅助函数
function findAnswer(qaId: string, messageId: string) {
  const msg = useChatStore.getState().messages.find(m => m.qaId === qaId);
  return msg?.answers.find(a => a.messageId === messageId);
}

// 按 qaId 查找 question 的辅助函数
function findQuestion(qaId: string) {
  return useChatStore.getState().messages.find(m => m.qaId === qaId)?.question;
}

describe('chatStore', () => {
  beforeEach(() => {
    useChatStore.setState({ messages: [] });
  });

  // ─── addMessage ────────────────────────────────────────

  test('addMessage 应该添加消息到列表', () => {
    useChatStore.getState().addMessage(createMockMessage('qa-1', 'q-1', ['a-1']));

    const { messages } = useChatStore.getState();
    expect(messages).toHaveLength(1);
    expect(messages[0].qaId).toBe('qa-1');
  });

  test('addMessage 多次调用应该依次追加', () => {
    seedMessages();
    expect(useChatStore.getState().messages).toHaveLength(2);
  });

  // ─── updateMessage：answer defaultUpdater ───────────────

  test('updateMessage 应该只更新目标 answer，不影响其他 answer', () => {
    seedMessages();

    useChatStore.getState().updateMessage('qa-1', 'a-2', { content: '已更新' });

    // 目标 answer 被更新
    expect(findAnswer('qa-1', 'a-2')?.content).toBe('已更新');
    // 同 qa 的另一个 answer 不受影响
    expect(findAnswer('qa-1', 'a-1')?.content).toBe('回答-a-1');
    // 另一个 qa 的 answer 不受影响
    expect(findAnswer('qa-2', 'a-3')?.content).toBe('回答-a-3');
  });

  test('updateMessage 应该同时更新多个字段', () => {
    seedMessages();

    useChatStore.getState().updateMessage('qa-2', 'a-4', {
      content: '回复完成',
      status: 6,
      likeStatus: 1,
    });

    const answer = findAnswer('qa-2', 'a-4');
    expect(answer?.content).toBe('回复完成');
    expect(answer?.status).toBe(6);
    expect(answer?.likeStatus).toBe(1);
    // qa-1 的 answer 不受影响
    expect(findAnswer('qa-1', 'a-1')?.status).toBe(3);
  });

  // ─── updateMessage：question ────────────────────────────

  test('updateMessage 应该通过 question.messageId 更新 question', () => {
    seedMessages();

    useChatStore.getState().updateMessage('qa-2', 'q-2', { content: '修改后的问题' });

    // 目标 question 被更新
    expect(findQuestion('qa-2')?.content).toBe('修改后的问题');
    // 另一个 qa 的 question 不受影响
    expect(findQuestion('qa-1')?.content).toBe('问题-qa-1');
  });

  // ─── updateMessage：extUpdater ─────────────────────────

  test('updateMessage 应该更新 answer.ext 下的字段', () => {
    seedMessages();

    useChatStore.getState().updateMessage('qa-1', 'a-1', {
      'ext.source': 'web',
      'ext.model': 'gpt-4o',
    });

    const ext = findAnswer('qa-1', 'a-1')?.ext;
    expect(ext?.source).toBe('web');
    expect(ext?.model).toBe('gpt-4o');
    // 另一个 answer 的 ext 不受影响
    expect(findAnswer('qa-1', 'a-2')?.ext).toEqual({});
  });

  test('updateMessage 应该更新 question.ext 下的字段', () => {
    seedMessages();

    useChatStore.getState().updateMessage('qa-1', 'q-1', { 'ext.edited': true });

    expect(findQuestion('qa-1')?.ext.edited).toBe(true);
    // 另一个 qa 的 question.ext 不受影响
    expect(findQuestion('qa-2')?.ext).toEqual({});
  });

  test('updateMessage 混合使用 defaultUpdater 和 extUpdater', () => {
    seedMessages();

    useChatStore.getState().updateMessage('qa-1', 'a-1', {
      status: 6,
      'ext.finishReason': 'stop',
    });

    const answer = findAnswer('qa-1', 'a-1');
    expect(answer?.status).toBe(6);
    expect(answer?.ext.finishReason).toBe('stop');
  });

  // ─── updateMessage：不匹配时不修改 ─────────────────────

  test('updateMessage 不匹配的 qaId 不应该修改任何数据', () => {
    seedMessages();

    useChatStore.getState().updateMessage('qa-999', 'a-1', { content: '不应该出现' });

    // 所有数据都不受影响
    expect(findAnswer('qa-1', 'a-1')?.content).toBe('回答-a-1');
    expect(findAnswer('qa-2', 'a-3')?.content).toBe('回答-a-3');
  });

  test('updateMessage 不匹配的 messageId 不应该修改任何数据', () => {
    seedMessages();

    useChatStore.getState().updateMessage('qa-1', 'a-999', { content: '不应该出现' });

    expect(findAnswer('qa-1', 'a-1')?.content).toBe('回答-a-1');
    expect(findAnswer('qa-1', 'a-2')?.content).toBe('回答-a-2');
  });

  // ─── clearMessages ─────────────────────────────────────

  test('clearMessages 应该清空消息列表', () => {
    seedMessages();

    useChatStore.getState().clearMessages();
    expect(useChatStore.getState().messages).toHaveLength(0);
  });
});
