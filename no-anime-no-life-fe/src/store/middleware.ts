// 定义一个适配localStorage的接口
interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

// 创建一个Redux中间件来自动存储状态到localStorage
const createStorageMiddleware = (adapter: StorageAdapter) => {
  return ({ dispatch, getState }) => (next: any) => (action: any) => {
    // 派发action
    const result = next(action)

    try {
      // 获取当前state并保存到localStorage
      const state = getState()
      adapter.setItem('state', JSON.stringify(state))
    } catch (e) {
      // 处理任何错误
      console.error('Error saving to localStorage', e)
    }

    return result
  }
}

// 自定义localStorage方法
const localStorageAdapter: StorageAdapter = {
  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.error('Error retrieving item from localStorage', e)
      return null
    }
  },
  setItem: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key)
  },
}
const localMiddleware = createStorageMiddleware.bind(localStorageAdapter)

export default localMiddleware
