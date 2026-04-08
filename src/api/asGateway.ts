// API 层 - asGateway.ts
// 规则：只依赖 Types、Config、Utils 层
// 只做请求/响应转换，不包含业务判断
// AS Gateway 的 WebSocket 连接管理和消息发送

import { WsManager } from '@/utils/websocket';
import type { WsMessageCallback, WsMessage } from '@/types';
import { appConfig } from '@/config';

// ─── 单例 WsManager（懒加载，第一次调用时初始化）────────────────

let _wsManager: WsManager | null = null;

function getManager(): WsManager {
  if (!_wsManager) {
    _wsManager = new WsManager({
      url: appConfig.asWsUrl,
      onStatusChange: (status) => {
        console.log('[asGateway] WS 状态:', status);
      },
      onError: (event) => {
        console.error('[asGateway] WS 错误:', event);
      },
    });
  }
  return _wsManager;
}

// ─── 仅用于测试：重置单例 ─────────────────────────────────────

export function _resetManager(): void {
  _wsManager = null;
}

// ─── 连接管理 ─────────────────────────────────────────────────

export function connect(): void {
  getManager().connect();
}

export function disconnect(): void {
  getManager().disconnect();
}

export function getStatus() {
  return getManager().getStatus();
}

// ─── 回调注册 ─────────────────────────────────────────────────

export function registerCallback(sessionId: string, callback: WsMessageCallback): void {
  getManager().registerCallback(sessionId, callback);
}

export function unregisterCallback(sessionId: string): void {
  getManager().unregisterCallback(sessionId);
}

// ─── 发送消息 ─────────────────────────────────────────────────

export function sendMessage(message: WsMessage): void {
  getManager().send(JSON.stringify(message));
}
