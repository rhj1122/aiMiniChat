// Hooks 层 - useAppInit
// 规则：只依赖 Store、API、Types 层
// 封装应用初始化逻辑

import { useEffect } from 'react'
import { getConfig } from '@/api/commonApi'
import { useConfigStore } from '@/store/configStore'

export function useAppInit() {
  const { isLoaded, setConfig } = useConfigStore()

  useEffect(() => {
    if (isLoaded) return

    getConfig()
      .then(res => {
        setConfig(res.data as Record<string, unknown>)
      })
      .catch(err => {
        console.error('获取全局配置失败:', err)
      })
  }, [isLoaded, setConfig])

  return { isLoaded }
}
