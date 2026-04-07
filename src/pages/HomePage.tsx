// 首页（骨架）
// 包含：logo、推荐消息、输入框
import { useNavigate } from 'react-router';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSend = (content: string) => {
    if (content.trim()) {
      navigate('/chat', { state: { initialMessage: content } });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">AI Mini Chat</h1>
      <p className="text-gray-500">有什么可以帮你的？</p>
      <button
        type="button"
        className="rounded-lg bg-blue-500 px-6 py-2 text-white"
        onClick={() => handleSend('你好')}
      >
        开始对话
      </button>
    </div>
  );
}
