# Skill：创建新 Hook

## 适用场景
- 需要封装业务逻辑（连接 Store 和 API）
- 需要在多个组件间复用逻辑

## 使用步骤

### 1. 创建 Hook 文件
```
位置：src/hooks/useXxxYyy.ts
命名：camelCase，以 use 开头
```

```typescript
// src/hooks/useMessageSearch.ts

import { useChatStore } from '@/store/chatStore';

export function useMessageSearch() {
  const { messages } = useChatStore();

  // 业务逻辑...

  return {
    // 只返回数据和方法，不返回 JSX
  };
}
```

### 2. 创建测试文件（同目录）
```typescript
// src/hooks/useMessageSearch.test.ts

import { renderHook, act } from '@testing-library/react';
import { useMessageSearch } from './useMessageSearch';

// 如果 Hook 内部调用了 API，需要 mock
vi.mock('@/api/xxxApi', () => ({
  someFunction: vi.fn(),
}));

describe('useMessageSearch', () => {
  test('初始状态验证', () => {
    const { result } = renderHook(() => useMessageSearch());
    // 断言初始状态
  });

  test('方法调用验证', async () => {
    const { result } = renderHook(() => useMessageSearch());
    await act(async () => {
      // 调用 Hook 返回的方法
    });
    // 断言结果
  });
});
```

### 3. 验证
```bash
pnpm check && pnpm test:run
```

## 不适用场景
- 纯工具函数（不依赖 React 状态）→ 放在 src/utils/
- 只在一个组件内使用的简单状态 → 直接用 useState

## 常见错误
- Hook 返回了 JSX → Hook 只返回数据和方法
- 在 Hook 里定义了 type/interface → 类型放 src/types/
- Hook 做了太多事情 → 一个 Hook 只做一件事，拆分
- 缩写词全大写（useAIChat）→ 应该是 useAiChat
