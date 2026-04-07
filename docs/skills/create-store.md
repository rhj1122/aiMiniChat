# Skill：创建新 Store

## 适用场景
- 需要在多个组件间共享状态

## 使用步骤

### 1. 确认类型定义
在 `src/types/` 中定义 Store 需要的数据类型（如果还没有）。

### 2. 创建 Store 文件
```
位置：src/store/xxxStore.ts
命名：camelCase，以 Store 结尾
```

```typescript
// src/store/userStore.ts

import { create } from 'zustand';
import type { User } from '@/types';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(set => ({
  user: null,
  setUser: user => set({ user }),
  clearUser: () => set({ user: null }),
}));
```

### 3. 创建测试文件（同目录）
```typescript
// src/store/userStore.test.ts

import { useUserStore } from './userStore';

describe('userStore', () => {
  beforeEach(() => {
    // 重置状态
    useUserStore.setState({ user: null });
  });

  test('setUser 应该设置用户', () => {
    useUserStore.getState().setUser({ id: '1', name: '张三' });
    expect(useUserStore.getState().user?.name).toBe('张三');
  });
});
```

**测试要求：** 如果 Store 有更新方法，必须预置多条数据，用业务 ID 查找断言，验证只有目标被修改。

### 4. 验证
```bash
pnpm check && pnpm test:run
```

## 不适用场景
- 只在一个组件内使用的状态 → 用 useState
- 纯工具函数 → 放 src/utils/

## 常见错误
- 在 Store 文件里定义业务 type/interface → 只允许定义 Store 自身的 interface（如 `interface UserStore`），其他类型放 src/types/
- Store 里写了 API 调用 → API 调用放在 Hooks 层，Store 只存储状态
- action 命名用了名词 → action 用动词（setUser、clearUser），state 用名词（user、messages）
