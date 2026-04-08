// Components 层 - Question
// 规则：只依赖 Hooks、Types 层，不直接发网络请求，不直接写入 Store

import type { Question as QuestionType } from '@/types';

export default function Question({ question }: { question: QuestionType }) {
  return (
    <div className="mb-3 flex justify-end">
      <div className="max-w-[70%] rounded-2xl rounded-tr-sm bg-green-500 px-4 py-2 text-white">
        <p className="text-sm break-words whitespace-pre-wrap">{question.content}</p>
      </div>
    </div>
  );
}
