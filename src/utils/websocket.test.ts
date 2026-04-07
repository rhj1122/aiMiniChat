// src/utils/websocket.test.ts

import { WsManager } from './websocket';
import type { WsMessage } from '@/types';

// ─── Mock WebSocket ───────────────────────────────────────────

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: (() => void) | null = null;
  sentMessages: string[] = [];
  closed = false;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  send(data: string) {
    this.sentMessages.push(data);
  }

  close() {
    this.closed = true;
    this.onclose?.();
  }

  // 测试辅助：模拟服务端推送消息
  simulateMessage(data: string) {
    this.onmessage?.({ data });
  }

  // 测试辅助：模拟连接成功
  simulateOpen() {
    this.onopen?.();
  }

  // 测试辅助：模拟连接错误
  simulateError(event: Event) {
    this.onerror?.(event);
  }
}

// ─── 测试 ─────────────────────────────────────────────────────

describe('WsManager', () => {
  let manager: WsManager;

  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.stubGlobal('WebSocket', MockWebSocket);

    manager = new WsManager({
      url: 'ws://localhost:3141/test',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  })

  // ─── 连接状态 ────────────────────────────────────────────────

  test('初始状态应该是 disconnected', () => {
    expect(manager.getStatus()).toBe('disconnected');
  });

  test('connect 后状态应该变为 connecting', () => {
    manager.connect();
    expect(manager.getStatus()).toBe('connecting');
  });

  test('连接成功后状态应该变为 connected', () => {
    manager.connect();
    const ws = MockWebSocket.instances[0];
    ws.simulateOpen();
    expect(manager.getStatus()).toBe('connected');
  });

  test('连接关闭后状态应该变为 disconnected', () => {
    manager.connect();
    const ws = MockWebSocket.instances[0];
    ws.simulateOpen();
    ws.close();
    expect(manager.getStatus()).toBe('disconnected');
  });

  test('连接错误后状态应该变为 error', () => {
    manager.connect();
    const ws = MockWebSocket.instances[0];
    ws.simulateError(new Event('error'));
    expect(manager.getStatus()).toBe('error');
  });

  test('已连接时重复调用 connect 不应该创建新连接', () => {
    manager.connect();
    MockWebSocket.instances[0].simulateOpen();
    manager.connect();
    expect(MockWebSocket.instances).toHaveLength(1);
  });

  // ─── 发送消息 ────────────────────────────────────────────────

  test('connected 状态下 send 应该发送消息', () => {
    manager.connect();
    const ws = MockWebSocket.instances[0];
    ws.simulateOpen();

    manager.send('{"test": true}');

    expect(ws.sentMessages).toHaveLength(1);
    expect(ws.sentMessages[0]).toBe('{"test": true}');
  });

  test('未连接时 send 不应该发送消息', () => {
    manager.send('{"test": true}');
    expect(MockWebSocket.instances).toHaveLength(0);
  });

  // ─── 回调注册与消息分发 ──────────────────────────────────────

  test('registerCallback 应该按 session_id 分发消息', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    manager.registerCallback('session-1', callback1);
    manager.registerCallback('session-2', callback2);

    manager.connect();
    const ws = MockWebSocket.instances[0];
    ws.simulateOpen();

    const msg1: WsMessage = {
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

    ws.simulateMessage(JSON.stringify(msg1));

    // callback1 收到消息，callback2 不受影响
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledWith(msg1);
    expect(callback2).not.toHaveBeenCalled();
  });

  test('unregisterCallback 后不应该再收到消息', () => {
    const callback = vi.fn();
    manager.registerCallback('session-1', callback);
    manager.unregisterCallback('session-1');

    manager.connect();
    const ws = MockWebSocket.instances[0];
    ws.simulateOpen();

    ws.simulateMessage(JSON.stringify({
      id: 'msg-1',
      type: 'query',
      timestamp: '123',
      header: { session_id: 'session-1' },
      data: {},
      source: { type: 'user', id: 'u1' },
      target: { type: 'agent', id: 'a1' },
      extend: {},
    }));

    expect(callback).not.toHaveBeenCalled();
  });

  test('收到非 JSON 消息时不应该崩溃', () => {
    manager.connect();
    const ws = MockWebSocket.instances[0];
    ws.simulateOpen();

    expect(() => ws.simulateMessage('not json')).not.toThrow();
  });

  // ─── onStatusChange 回调 ─────────────────────────────────────

  test('onStatusChange 应该在状态变化时被调用', () => {
    const onStatusChange = vi.fn();
    const mgr = new WsManager({
      url: 'ws://localhost:3141/test',
      onStatusChange,
    });

    mgr.connect();
    expect(onStatusChange).toHaveBeenCalledWith('connecting');

    MockWebSocket.instances[0].simulateOpen();
    expect(onStatusChange).toHaveBeenCalledWith('connected');
  });
});
