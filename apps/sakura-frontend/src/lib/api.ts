// API基础URL - 开发环境使用代理，生产环境使用完整URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// 请求配置类型
interface RequestConfig extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>
    data?: any
}

// API响应类型
interface ApiResponse<T> {
    code: number
    message: string
    data: T
}

// 请求错误类型
export class ApiError extends Error {
    status: number
    code: number
    data?: any

    constructor(message: string, status: number, code: number = status, data?: any) {
        super(message)
        this.status = status
        this.code = code
        this.data = data
        this.name = 'ApiError'
    }
}

// 构建URL（包含查询参数）
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = `${API_BASE_URL}${endpoint}`

    if (!params) return url

    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            queryParams.append(key, String(value))
        }
    })

    const queryString = queryParams.toString()
    return queryString ? `${url}?${queryString}` : url
}

// 请求函数
async function request<T>(endpoint: string, { params, data, ...customConfig }: RequestConfig = {}): Promise<T> {
    const url = buildUrl(endpoint, params)

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    }

    const config: RequestInit = {
        method: data ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...(customConfig.headers as Record<string, string>)
        }
    }

    if (data) {
        config.body = JSON.stringify(data)
    }

    try {
        const response = await fetch(url, config)

        // 处理空响应
        const text = await response.text()
        const responseData: ApiResponse<T> = text ? JSON.parse(text) : { code: 0, message: 'success', data: null as T }

        if (!response.ok) {
            throw new ApiError(
                responseData.message || `API错误: ${response.status}`,
                response.status,
                responseData.code,
                responseData.data
            )
        }

        // 返回data字段
        return responseData.data
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(error instanceof Error ? error.message : '网络错误', 500, 500)
    }
}

// 导出基础API方法
export const api = {
    get: <T>(endpoint: string, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'GET' }),
    post: <T>(endpoint: string, data: any, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'POST', data }),
    put: <T>(endpoint: string, data: any, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'PUT', data }),
    patch: <T>(endpoint: string, data: any, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'PATCH', data }),
    delete: <T>(endpoint: string, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'DELETE' })
}

// ========== 类型定义 ==========

export interface Category {
    id: number
    name: string
    slug: string
    description: string
    color: string
    post_count: number
}

export interface Tag {
    id: number
    name: string
    slug: string
    color: string
    post_count: number
}

export interface Post {
    id: number
    title: string
    slug: string
    content: string
    excerpt: string
    cover_image: string
    status: 'draft' | 'published' | 'archived'
    publish_date: string | null
    view_count: number
    word_count: number
    reading_time: string
    category: Category
    tags: Tag[]
    created_at: string
    updated_at: string
}

export interface PostListResponse {
    posts: Post[]
    total: number
    page: number
    page_size: number
    total_pages: number
}

export interface PostQuery {
    page?: number
    page_size?: number
    status?: string
    category_id?: number
    tag_id?: number
    search?: string
    order_by?: string
    order?: 'asc' | 'desc'
}

// ========== 文章服务 ==========

export const postService = {
    // 获取文章列表
    list: async (query?: PostQuery) => {
        return api.get<PostListResponse>('/posts', { params: query as Record<string, string | number | boolean | undefined> })
    },

    // 获取单篇文章（通过ID）
    getById: async (id: number) => {
        return api.get<Post>(`/posts/${id}`)
    },

    // 获取单篇文章（通过Slug）
    getBySlug: async (slug: string) => {
        return api.get<Post>(`/posts/slug/${slug}`)
    },

    // 创建文章
    create: async (data: {
        title: string
        slug?: string
        content: string
        excerpt?: string
        cover_image?: string
        status?: string
        category_id?: number
        tag_ids?: number[]
        tag_names?: string[]
    }) => {
        return api.post<Post>('/posts', data)
    },

    // 更新文章
    update: async (id: number, data: {
        title?: string
        slug?: string
        content?: string
        excerpt?: string
        cover_image?: string
        status?: string
        category_id?: number
        tag_ids?: number[]
        tag_names?: string[]
    }) => {
        return api.put<Post>(`/posts/${id}`, data)
    },

    // 删除文章
    delete: async (id: number) => {
        return api.delete<null>(`/posts/${id}`)
    }
}

// ========== 分类服务 ==========

export const categoryService = {
    // 获取所有分类
    list: async () => {
        return api.get<Category[]>('/categories')
    },

    // 获取单个分类
    getById: async (id: number) => {
        return api.get<Category>(`/categories/${id}`)
    },

    // 创建分类
    create: async (data: { name: string; slug?: string; description?: string; color?: string }) => {
        return api.post<Category>('/categories', data)
    },

    // 更新分类
    update: async (id: number, data: { name?: string; slug?: string; description?: string; color?: string }) => {
        return api.put<Category>(`/categories/${id}`, data)
    },

    // 删除分类
    delete: async (id: number) => {
        return api.delete<null>(`/categories/${id}`)
    }
}

// ========== 标签服务 ==========

export const tagService = {
    // 获取所有标签
    list: async () => {
        return api.get<Tag[]>('/tags')
    },

    // 获取单个标签
    getById: async (id: number) => {
        return api.get<Tag>(`/tags/${id}`)
    },

    // 创建标签
    create: async (data: { name: string; slug?: string; color?: string }) => {
        return api.post<Tag>('/tags', data)
    },

    // 更新标签
    update: async (id: number, data: { name?: string; slug?: string; color?: string }) => {
        return api.put<Tag>(`/tags/${id}`, data)
    },

    // 删除标签
    delete: async (id: number) => {
        return api.delete<null>(`/tags/${id}`)
    }
}
