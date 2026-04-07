// 对话页
// 包含：消息列表、输入框、发送按钮
import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useConfigStore } from '@/store/configStore';
import { useWsConnection } from '@/hooks/useWsConnection';
import { useChat } from '@/hooks/useChat';

export default function ChatPage() {
  const { config, isLoaded } = useConfigStore();
  const { send } = useChat();
  const [inputValue, setInputValue] = useState('');

  // 页面加载时建立 WS 连接
  useWsConnection();

  useEffect(() => {
    if (isLoaded) {
      console.log('全局配置:', config);
    }
  }, [config, isLoaded]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    send(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b p-4">
        <h1 className="text-lg font-semibold">AI 助手</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <p className="text-center text-gray-400">对话内容将显示在这里</p>
      </main>
      <footer className="border-t p-4">
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border px-4 py-2"
            placeholder="输入消息..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
            disabled={!inputValue.trim()}
            onClick={handleSend}
          >
            发送
          </button>
        </div>
      </footer>
    </div>
  );
}
