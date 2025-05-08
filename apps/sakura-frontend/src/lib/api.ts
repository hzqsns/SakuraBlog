// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// 请求配置类型
interface RequestConfig extends RequestInit {
    params?: Record<string, string | number | boolean>
    data?: any
}

// 请求错误类型
export class ApiError extends Error {
    status: number
    data?: any

    constructor(message: string, status: number, data?: any) {
        super(message)
        this.status = status
        this.data = data
        this.name = 'ApiError'
    }
}

// 构建URL（包含查询参数）
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = `${API_BASE_URL}${endpoint}`

    if (!params) return url

    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value))
    })

    return `${url}?${queryParams.toString()}`
}

// 请求函数
async function request<T>(endpoint: string, { params, data, ...customConfig }: RequestConfig = {}): Promise<T> {
    const url = buildUrl(endpoint, params)

    const headers = { 'Content-Type': 'application/json' }

    const config: RequestInit = {
        method: data ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers
        }
    }

    if (data) {
        config.body = JSON.stringify(data)
    }

    try {
        const response = await fetch(url, config)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new ApiError(errorData.message || `API错误: ${response.status}`, response.status, errorData)
        }

        const responseData = await response.json()
        return responseData as T
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(error instanceof Error ? error.message : '未知API错误', 500)
    }
}

// 导出API方法
export const api = {
    get: <T>(endpoint: string, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'GET' }),

    post: <T>(endpoint: string, data: any, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'POST', data }),

    put: <T>(endpoint: string, data: any, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'PUT', data }),

    patch: <T>(endpoint: string, data: any, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'PATCH', data }),

    delete: <T>(endpoint: string, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'DELETE' })
}
