// 对话页（骨架）
// 包含：消息列表、输入框
export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b p-4">
        <h1 className="text-lg font-semibold">AI 助手</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <p className="text-gray-400 text-center">对话内容将显示在这里</p>
      </main>
      <footer className="border-t p-4">
        <input className="w-full rounded-lg border px-4 py-2" placeholder="输入消息..." disabled />
      </footer>
    </div>
  )
}
