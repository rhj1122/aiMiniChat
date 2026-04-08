// src/hooks/useChat.test.ts

import { renderHook, act } from '@testing-library/react';
import { useChat } from './useChat';
import { useChatStore } from '@/store/chatStore';
import type { WsMessageCallback } from '@/types';

vi.mock('@/api/asGateway', () => ({
  sendMessage: vi.fn(),
  registerCallback: vi.fn(),
  unregisterCallback: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  getStatus: vi.fn(),
}));

import {
  sendMessage as mockSendMessage,
  registerCallback as mockRegisterCallback,
  unregisterCallback as mockUnregisterCallback,
} from '@/api/asGateway';

describe('useChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useChatStore.setState({ messages: [] });
  });

  test('send 应该添加消息到 store', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.send('你好');
    });

    const { messages } = useChatStore.getState();
    expect(messages).toHaveLength(1);
    expect(messages[0].question.content).toBe('你好');
    expect(messages[0].answers).toHaveLength(1);
    expect(messages[0].answers[0].content).toBe('');
    expect(messages[0].answers[0].status).toBe(3);
  });

  test('send 应该调用 sendMessage 发送 WS 消息', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.send('你好');
    });

    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    const sentMsg = vi.mocked(mockSendMessage).mock.calls[0][0];
    expect(sentMsg.type).toBe('query');
    expect(sentMsg.data.text).toBe('你好');
  });

  test('send 应该注册 session_id 对应的回调', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.send('你好');
    });

    expect(mockRegisterCallback).toHaveBeenCalledTimes(1);
    const registeredSessionId = vi.mocked(mockRegisterCallback).mock.calls[0][0];
    const sentMsg = vi.mocked(mockSendMessage).mock.calls[0][0];
    expect(registeredSessionId).toBe(sentMsg.header.session_id);
  });

  test('send 空内容时不应该发送', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.send('');
      result.current.send('   ');
    });

    expect(mockSendMessage).not.toHaveBeenCalled();
    expect(useChatStore.getState().messages).toHaveLength(0);
  });

  test('收到响应时应该追加 content 到 store', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.send('你好');
    });

    const callback = vi.mocked(mockRegisterCallback).mock.calls[0][1] as WsMessageCallback;
    const { messages } = useChatStore.getState();
    const qaId = messages[0].qaId;
    const answerMessageId = messages[0].answers[0].messageId;
    const sessionId = messages[0].answers[0].sessionId;

    const makeResponse = (text: string, status?: number) => ({
      id: crypto.randomUUID(),
      type: 'task_output',
      timestamp: String(Date.now()),
      header: {
        sn: '333',
        mt: 'test',
        user_id: 'u1',
        app_id: 'app1',
        app_version: '1.0',
        device_id: 'dev1',
        session_id: sessionId,
        request_id: 'req-1',
        resource_id: 'main',
      },
      data: { content: text, ...(status !== undefined ? { status } : {}) },
      source: { type: 'agent', id: 'a1' },
      target: { type: 'user', id: 'u1' },
      extend: {},
    });

    act(() => {
      callback(makeResponse('你好，'));
    });
    act(() => {
      callback(makeResponse('我是 AI 助手'));
    });

    const answer = useChatStore
      .getState()
      .messages.find((m) => m.qaId === qaId)
      ?.answers.find((a) => a.messageId === answerMessageId);

    expect(answer?.content).toBe('你好，我是 AI 助手');
  });

  test('收到结束状态时应该注销回调', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.send('你好');
    });

    const callback = vi.mocked(mockRegisterCallback).mock.calls[0][1] as WsMessageCallback;
    const sessionId = useChatStore.getState().messages[0].answers[0].sessionId;

    act(() => {
      callback({
        id: 'resp-end',
        type: 'task_output',
        timestamp: String(Date.now()),
        header: {
          sn: '333',
          mt: 'test',
          user_id: 'u1',
          app_id: 'app1',
          app_version: '1.0',
          device_id: 'dev1',
          session_id: sessionId,
          request_id: 'req-1',
          resource_id: 'main',
        },
        data: { content: '', isEnd: true },
        source: { type: 'agent', id: 'a1' },
        target: { type: 'user', id: 'u1' },
        extend: {},
      });
    });

    expect(mockUnregisterCallback).toHaveBeenCalledWith(sessionId);
  });
});
