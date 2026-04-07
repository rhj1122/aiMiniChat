// src/components/Chat/Question/Question.test.tsx

import { render, screen } from '@testing-library/react';
import Question from './Question';
import type { Question as QuestionType } from '@/types';

const mockQuestion: QuestionType = {
  messageId: 'q-1',
  createTime: Date.now(),
  sessionId: 'session-1',
  moduleType: 'main',
  content: '你好，你是谁？',
  attachments: [],
  requestIdList: ['req-1'],
  ext: {},
};

describe('Question', () => {
  test('应该渲染问题内容', () => {
    render(<Question question={mockQuestion} />);
    expect(screen.getByText('你好，你是谁？')).toBeInTheDocument();
  });

  test('应该显示在右侧（justify-end）', () => {
    const { container } = render(<Question question={mockQuestion} />);
    expect(container.firstChild).toHaveClass('justify-end');
  });

  test('气泡应该是绿色', () => {
    const { container } = render(<Question question={mockQuestion} />);
    const bubble = container.querySelector('.bg-green-500');
    expect(bubble).toBeInTheDocument();
  });
});
