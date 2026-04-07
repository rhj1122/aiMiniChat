// src/api/asGateway.test.ts

import type { WsMessageCallback, WsMessage } from '@/types';

const mockInstance = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  getStatus: vi.fn().mockReturnValue('disconnected'),
  send: vi.fn(),
  registerCallback: vi.fn(),
  unregisterCallback: vi.fn(),
};

vi.mock('@/utils/websocket', () => {
  return {
    WsManager: function () {
      return mockInstance;
    },
  };
});

import {
  connect,
  disconnect,
  getStatus,
  registerCallback,
  unregisterCallback,
  sendMessage,
  _resetManager,
} from './asGateway';

describe('asGateway', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInstance.getStatus.mockReturnValue('disconnected');
    _resetManager();
  });

  test('connect 应该调用 wsManager.connect', () => {
    connect();
    expect(mockInstance.connect).toHaveBeenCalledTimes(1);
  });

  test('disconnect 应该调用 wsManager.disconnect', () => {
    disconnect();
    expect(mockInstance.disconnect).toHaveBeenCalledTimes(1);
  });

  test('getStatus 应该返回 wsManager 的状态', () => {
    mockInstance.getStatus.mockReturnValue('connected');
    expect(getStatus()).toBe('connected');
  });

  test('registerCallback 应该调用 wsManager.registerCallback', () => {
    const cb: WsMessageCallback = vi.fn();
    registerCallback('session-1', cb);
    expect(mockInstance.registerCallback).toHaveBeenCalledWith('session-1', cb);
  });

  test('unregisterCallback 应该调用 wsManager.unregisterCallback', () => {
    unregisterCallback('session-1');
    expect(mockInstance.unregisterCallback).toHaveBeenCalledWith('session-1');
  });

  test('sendMessage 应该将消息序列化后调用 wsManager.send', () => {
    const message: WsMessage = {
      id: 'msg-1',
      type: 'query',
      timestamp: '1234567890',
      header: {
        sn: '333',
        mt: 'test',
        user_id: 'u1',
        app_id: 'app1',
        app_version: '1.0',
        device_id: 'dev1',
        session_id: 'session-1',
        request_id: 'req-1',
        resource_id: 'main',
      },
      data: { text: '你好' },
      source: { type: 'user', id: 'u1' },
      target: { type: 'agent', id: 'a1' },
      extend: {},
    };

    sendMessage(message);

    expect(mockInstance.send).toHaveBeenCalledTimes(1);
    expect(mockInstance.send).toHaveBeenCalledWith(JSON.stringify(message));
  });
});
