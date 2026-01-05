// ========== API 数据类型 ==========

// 分类
export interface Category {
    id: number
    name: string
    slug: string
    description: string
    color: string
    post_count?: number
}

// 标签
export interface Tag {
    id: number
    name: string
    slug: string
    color: string
    post_count?: number
}

// 文章（来自 API）
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

// 文章列表响应
export interface PostListResponse {
    posts: Post[]
    total: number
    page: number
    page_size: number
    total_pages: number
}

// 文章查询参数
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

// ========== 用户类型 ==========

export interface User {
    id: string
    username: string
    displayName: string
    avatar?: string
    bio?: string
    email: string
    role: 'admin' | 'user' | 'guest'
}

// ========== 其他类型 ==========

// 友链类型
export interface FriendLink {
    id: string
    name: string
    url: string
    avatar?: string
    description?: string
}

// 导航项类型
export interface NavItem {
    title: string
    href: string
    icon?: React.ComponentType
    isExternal?: boolean
}

// 主题配置类型
export interface ThemeConfig {
    primaryColor: string
    darkMode: boolean
    fontFamily: string
}

// 应用状态类型
export interface AppState {
    theme: ThemeConfig
    isAuthenticated: boolean
    currentUser?: User
}

// API响应类型
export interface ApiResponse<T> {
    code: number
    message: string
    data: T
}

// 博客设置类型
export interface BlogSettings {
    title: string
    description: string
    logo: string
    authorName: string
    authorAvatar: string
    authorBio: string
    social: {
        twitter?: string
        github?: string
        linkedin?: string
        instagram?: string
    }
    footer: {
        text: string
        links: Array<{
            label: string
            url: string
        }>
    }
}

// 评论类型
export interface Comment {
    id: string
    content: string
    author: {
        name: string
        avatar?: string
    }
    createdAt: string
    replies?: Comment[]
    likes: number
}

// 扩展Window接口
declare global {
    interface Window {
        global: Window
    }
}
