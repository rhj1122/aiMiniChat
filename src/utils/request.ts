// src/utils/request.ts
// 通用 HTTP 请求封装（基于 axios）
// 约束：纯工具函数，不依赖 Store、Hooks 层

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';
import { appConfig } from '@/config';

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: appConfig.aiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── 请求拦截器 ──────────────────────────────────────────────

instance.interceptors.request.use(
  (config) => {
    // TODO: 后期替换为登录获取的真实 token
    const token = 'temp-token-placeholder';

    if (token) {
      config.headers.Authorization = token;
      config.headers.Token = token;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── 响应拦截器 ──────────────────────────────────────────────

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || '请求失败';

    // 401 未授权（token 过期等）
    if (status === 401) {
      // TODO: 跳转登录页或刷新 token
      console.warn('未授权，需要重新登录');
    }

    return Promise.reject(new Error(message));
  },
);

// ─── 请求方法封装 ─────────────────────────────────────────────

export function get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return instance.get(url, config);
}

export function post<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return instance.post(url, data, config);
}

export function put<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return instance.put(url, data, config);
}

export function del<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  return instance.delete(url, config);
}

export default instance;
