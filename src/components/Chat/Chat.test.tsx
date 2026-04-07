// src/components/Chat/Chat.test.tsx

import { render, screen } from '@testing-library/react';
import Chat from './Chat';
import { useChatStore } from '@/store/chatStore';
import type { Message } from '@/types';

// jsdom 不支持 scrollIntoView，mock 掉
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const mockMessage: Message = {
  qaId: 'qa-1',
  question: {
    messageId: 'q-1',
    createTime: Date.now(),
    sessionId: 'session-1',
    moduleType: 'main',
    content: '你好',
    attachments: [],
    requestIdList: ['req-1'],
    ext: {},
  },
  answers: [
    {
      messageId: 'a-1',
      createTime: Date.now(),
      sessionId: 'session-1',
      moduleType: 'main',
      content: '你好，我是 AI',
      contentAssets: [],
      status: 6,
      likeStatus: 0,
      requestId: 'req-1',
      ext: {},
    },
  ],
  answerActiveIndex: 0,
  fromHistory: false,
};

describe('Chat', () => {
  beforeEach(() => {
    useChatStore.setState({ messages: [] });
  });

  test('没有消息时应该显示占位文字', () => {
    render(<Chat />);
    expect(screen.getByText('对话内容将显示在这里')).toBeInTheDocument();
  });

  test('有消息时应该渲染问题和回答', () => {
    useChatStore.setState({ messages: [mockMessage] });
    render(<Chat />);

    expect(screen.getByText('你好')).toBeInTheDocument();
    expect(screen.getByText('你好，我是 AI')).toBeInTheDocument();
  });

  test('多条消息应该全部渲染', () => {
    const msg2: Message = {
      ...mockMessage,
      qaId: 'qa-2',
      question: { ...mockMessage.question, messageId: 'q-2', content: '第二个问题' },
      answers: [{ ...mockMessage.answers[0], messageId: 'a-2', content: '第二个回答' }],
    };

    useChatStore.setState({ messages: [mockMessage, msg2] });
    render(<Chat />);

    expect(screen.getByText('你好')).toBeInTheDocument();
    expect(screen.getByText('你好，我是 AI')).toBeInTheDocument();
    expect(screen.getByText('第二个问题')).toBeInTheDocument();
    expect(screen.getByText('第二个回答')).toBeInTheDocument();
  });
});
