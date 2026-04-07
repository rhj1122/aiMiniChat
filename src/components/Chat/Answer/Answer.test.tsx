// src/components/Chat/Answer/Answer.test.tsx

import { render, screen } from '@testing-library/react';
import Answer from './Answer';
import type { Answer as AnswerType } from '@/types';

const mockAnswer: AnswerType = {
  messageId: 'a-1',
  createTime: Date.now(),
  sessionId: 'session-1',
  moduleType: 'main',
  content: '我是 AI 助手',
  contentAssets: [],
  status: 6,
  likeStatus: 0,
  requestId: 'req-1',
  ext: {},
};

describe('Answer', () => {
  test('应该渲染回答内容', () => {
    render(<Answer answer={mockAnswer} />);
    expect(screen.getByText('我是 AI 助手')).toBeInTheDocument();
  });

  test('应该显示在左侧（justify-start）', () => {
    const { container } = render(<Answer answer={mockAnswer} />);
    expect(container.firstChild).toHaveClass('justify-start');
  });

  test('气泡应该是灰色', () => {
    const { container } = render(<Answer answer={mockAnswer} />);
    const bubble = container.querySelector('.bg-gray-100');
    expect(bubble).toBeInTheDocument();
  });

  test('content 为空时应该显示加载动画', () => {
    const emptyAnswer = { ...mockAnswer, content: '' };
    const { container } = render(<Answer answer={emptyAnswer} />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
