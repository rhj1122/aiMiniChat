// Store 层 - configStore
// 规则：只依赖 Types 层，不包含 UI 逻辑
// 存储全局配置数据

import { create } from 'zustand';

interface ConfigStore {
  config: Record<string, unknown> | null;
  isLoaded: boolean;
  setConfig: (config: Record<string, unknown>) => void;
}

export const useConfigStore = create<ConfigStore>()((set) => ({
  config: null,
  isLoaded: false,

  setConfig: (config) => set({ config, isLoaded: true }),
}));
