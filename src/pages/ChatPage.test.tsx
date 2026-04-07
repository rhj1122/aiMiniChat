import { render, screen } from '@testing-library/react';
import ChatPage from './ChatPage';

describe('测试ChatPage', () => {
  test('渲染header', () => {
    render(<ChatPage />);
    expect(screen.getByText('AI 助手')).toBeInTheDocument();
  });

  test('渲染对话内容', () => {
    render(<ChatPage />);
    expect(screen.getByText('对话内容将显示在这里')).toBeInTheDocument();
  });

  test('渲染input', () => {
    render(<ChatPage />);

    expect(screen.getByPlaceholderText('输入消息...')).toBeInTheDocument();
  });
});
