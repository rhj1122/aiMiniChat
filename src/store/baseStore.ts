// Store 层 - baseStore
// 规则：只依赖 Types 层，不包含 UI 逻辑
// 存储项目级通用信息（userInfo、deviceInfo 等）

import { create } from 'zustand';

interface BaseStore {
  userInfo: Record<string, unknown> | null;
  deviceInfo: Record<string, unknown> | null;
  setUserInfo: (userInfo: Record<string, unknown>) => void;
  setDeviceInfo: (deviceInfo: Record<string, unknown>) => void;
  clearUserInfo: () => void;
  clearDeviceInfo: () => void;
}

export const useBaseStore = create<BaseStore>()(set => ({
  userInfo: null,
  deviceInfo: null,

  setUserInfo: userInfo => set({ userInfo }),
  setDeviceInfo: deviceInfo => set({ deviceInfo }),
  clearUserInfo: () => set({ userInfo: null }),
  clearDeviceInfo: () => set({ deviceInfo: null }),
}));
