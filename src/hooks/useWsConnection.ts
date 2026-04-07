// Hooks 层 - useWsConnection
// 规则：只依赖 API、Types 层
// 封装 WS 连接的生命周期管理

import { useEffect } from 'react';
import { connect, disconnect } from '@/api/asGateway';

export function useWsConnection() {
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);
}
