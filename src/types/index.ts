// 类型定义层（最底层）
// 规则：只包含 interface、type、enum，无副作用，无业务逻辑
// 可以被任何层依赖

// ─── 消息相关 ───────────────────────────────────────────────

export interface Question {
  messageId: string;
  createTime: number;
  sessionId: string;
  moduleType: string;
  content: string;
  attachments: unknown[];
  requestIdList: string[];
  ext: Record<string, unknown>;
}

export interface Answer {
  messageId: string;
  createTime: number;
  sessionId: string;
  moduleType: string;
  content: string;
  contentAssets: unknown[];
  status: number;
  likeStatus: number;
  requestId: string;
  ext: Record<string, unknown>;
}

export interface Message {
  qaId: string;
  question: Question;
  answers: Answer[];
  answerActiveIndex: number;
  fromHistory: boolean;
}

// ─── WebSocket 消息相关 ───────────────────────────────────────

export interface WsMessageHeader {
  sn: string;
  mt: string;
  user_id: string;
  app_id: string;
  app_version: string;
  device_id: string;
  session_id: string;
  request_id: string;
  resource_id: string;
}

export interface WsMessageSource {
  type: string;
  id: string;
}

export interface WsMessageTarget {
  type: string;
  id: string;
}

export interface WsMessage {
  id: string;
  type: string;
  timestamp: string;
  header: WsMessageHeader;
  data: Record<string, unknown>;
  source: WsMessageSource;
  target: WsMessageTarget;
  extend: Record<string, unknown>;
}

export type WsMessageCallback = (message: WsMessage) => void;

// ─── WebSocket 管理器类型 ─────────────────────────────────────

export type WsStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface WsManagerOptions {
  url: string;
  onStatusChange?: (status: WsStatus) => void;
  onError?: (event: Event) => void;
}

// ─── 通用工具类型 ─────────────────────────────────────────────

export type AnyRecord = Record<string, unknown>;

// ─── 常量 ──────────────────────────────────────────────────────
// 业务常量放在 Types 层，任何层都可以依赖

export const QA_STATUS = {
  analyzing: 3,
  thinking: 4,
  replying: 5,
  finished: 6,
};

// 以上为正确业务代码，有效
// 以下为架构模板代码，无用

// ─── AI 配置相关 ─────────────────────────────────────────────

export interface AiConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
}

// ─── API 响应相关 ─────────────────────────────────────────────

export interface ApiError {
  code: number;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

// ─── 用户相关 ─────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  avatar?: string;
}
