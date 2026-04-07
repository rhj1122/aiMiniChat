// Components 层 - Answer
// 规则：只依赖 Hooks、Types 层，不直接发网络请求，不直接写入 Store

import type { Answer as AnswerType } from '@/types';

export default function Answer({ answer }: { answer: AnswerType }) {
  return (
    <div className="flex justify-start mb-3">
      <div className="max-w-[70%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2 text-gray-800">
        {answer.content ? (
          <p className="whitespace-pre-wrap break-words text-sm">{answer.content}</p>
        ) : (
          <span className="flex items-center gap-1 py-1">
            <span className="h-2 w-2 rounded-full bg-gray-400 animate-[pulse_1.2s_ease-in-out_0s_infinite]" />
            <span className="h-2 w-2 rounded-full bg-gray-400 animate-[pulse_1.2s_ease-in-out_0.4s_infinite]" />
            <span className="h-2 w-2 rounded-full bg-gray-400 animate-[pulse_1.2s_ease-in-out_0.8s_infinite]" />
          </span>
        )}
      </div>
    </div>
  );
}
