// utils 层 - websocket.ts
// 规则：纯工具函数，不依赖 Store、Hooks 层
// 通用 WebSocket 连接管理工具

import type { WsMessage, WsMessageCallback, WsStatus, WsManagerOptions } from '@/types';

// ─── WebSocket 管理器 ─────────────────────────────────────────

export class WsManager {
  private ws: WebSocket | null = null;
  private status: WsStatus = 'disconnected';
  private callbacks: Map<string, WsMessageCallback> = new Map();
  private options: WsManagerOptions;

  constructor(options: WsManagerOptions) {
    this.options = options;
  }

  // 获取当前连接状态
  getStatus(): WsStatus {
    return this.status;
  }

  // 建立连接
  connect(): void {
    if (this.ws && this.status === 'connected') return;

    this.setStatus('connecting');
    this.ws = new WebSocket(this.options.url);

    this.ws.onopen = () => {
      this.setStatus('connected');
    };

    this.ws.onmessage = (event: MessageEvent) => {
      this.handleMessage(event);
    };

    this.ws.onerror = (event: Event) => {
      this.setStatus('error');
      this.options.onError?.(event);
    };

    this.ws.onclose = () => {
      this.setStatus('disconnected');
      this.ws = null;
    };
  }

  // 断开连接
  disconnect(): void {
    if (!this.ws) return;
    this.ws.close();
    this.ws = null;
    this.callbacks.clear();
  }

  // 发送消息（原始字符串）
  send(data: string): void {
    if (!this.ws || this.status !== 'connected') {
      console.warn('[WsManager] 未连接，无法发送消息');
      return;
    }
    this.ws.send(data);
  }

  // 注册 session_id 对应的回调
  registerCallback(sessionId: string, callback: WsMessageCallback): void {
    this.callbacks.set(sessionId, callback);
  }

  // 注销 session_id 对应的回调
  unregisterCallback(sessionId: string): void {
    this.callbacks.delete(sessionId);
  }

  // 处理收到的消息，按 session_id 分发
  private handleMessage(event: MessageEvent): void {
    let message: WsMessage;
    try {
      message = JSON.parse(event.data as string) as WsMessage;
    } catch {
      console.warn('[WsManager] 收到非 JSON 消息:', event.data);
      return;
    }

    const sessionId = message.header?.session_id;
    if (!sessionId) return;

    const callback = this.callbacks.get(sessionId);
    callback?.(message);
  }

  // 更新状态并通知
  private setStatus(status: WsStatus): void {
    this.status = status;
    this.options.onStatusChange?.(status);
  }
}
