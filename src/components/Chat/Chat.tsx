// Components 层 - Chat
// 规则：只依赖 Hooks、Types 层，不直接发网络请求，不直接写入 Store

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import Question from './Question/Question';
import Answer from './Answer/Answer';

export default function Chat() {
  const messages = useChatStore(state => state.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 新消息时自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <p className="text-center text-gray-400">对话内容将显示在这里</p>
    );
  }

  return (
    <div className="flex flex-col">
      {messages.map(item => (
        <div key={item.qaId}>
          <Question question={item.question} />
          {item.answers[0] && <Answer answer={item.answers[0]} />}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
