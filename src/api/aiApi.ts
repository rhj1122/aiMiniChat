// API 层
// 规则：只依赖 Types、Config 层
// 只做请求/响应转换，不包含业务判断
// Hooks 层通过此层访问网络，不直接 fetch

// TODO: 后续在此实现 WebSocket 连接相关的 API 封装
