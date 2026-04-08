// Hooks 层 - useChat
// 规则：只依赖 Store、API、Types 层
// 封装发送消息和接收响应的业务逻辑

import { useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { sendMessage, registerCallback, unregisterCallback } from '@/api/asGateway';
import type { WsMessage } from '@/types';

const string = '改一行代码验证针对pre-commit的format更新是否生效';
console.log(string);

// 固定的设备/应用信息（后续可从 config 或 store 读取）
const DEVICE_INFO = {
  sn: '333333333322222222',
  mt: 'WEB',
  user_id: 'user_001',
  app_id: 'ai-mini-chat',
  app_version: '0.1.0',
  device_id: 'web-device',
  resource_id: 'main',
};

export function useChat() {
  const { addMessage, updateMessage } = useChatStore();

  const send = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      const sessionId = crypto.randomUUID();
      const requestId = crypto.randomUUID();
      const qaId = crypto.randomUUID();
      const questionMessageId = crypto.randomUUID();
      const answerMessageId = crypto.randomUUID();

      // 1. 添加消息到 store
      addMessage({
        qaId,
        question: {
          messageId: questionMessageId,
          createTime: Date.now(),
          sessionId,
          moduleType: 'main',
          content,
          attachments: [],
          requestIdList: [requestId],
          ext: {},
        },
        answers: [
          {
            messageId: answerMessageId,
            createTime: Date.now(),
            sessionId,
            moduleType: 'main',
            content: '',
            contentAssets: [],
            status: 3,
            likeStatus: 0,
            requestId,
            ext: {},
          },
        ],
        answerActiveIndex: 0,
        fromHistory: false,
      });

      // 2. 注册响应回调（按 session_id 分发）
      const handleResponse = (msg: WsMessage) => {
        const text = (msg.data?.content as string) ?? '';
        if (text) {
          // 追加流式文本到 answer 的 content
          updateMessage(qaId, answerMessageId, { content: text, status: 5 });
        }

        // 收到结束状态时注销回调
        const isEnd = msg.data?.isEnd;
        if (isEnd) {
          updateMessage(qaId, answerMessageId, { status: 6 });
          unregisterCallback(sessionId);
        }
      };

      registerCallback(sessionId, handleResponse);

      // 3. 发送 WS 消息
      const wsMessage: WsMessage = {
        id: crypto.randomUUID(),
        type: 'query',
        timestamp: String(Date.now()),
        header: {
          ...DEVICE_INFO,
          session_id: sessionId,
          request_id: requestId,
        },
        data: {
          text: content,
          attachments: [],
        },
        source: { type: 'user', id: DEVICE_INFO.user_id },
        target: { type: 'agent', id: 'agent_id' },
        extend: {},
      };

      sendMessage(wsMessage);
    },
    [addMessage, updateMessage],
  );

  return { send };
}
