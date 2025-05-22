// 博客文章类型
export interface Post {
    id: string
    title: string
    content: string
    excerpt: string
    author: string
    publishDate: string
    tags: string[]
    category: string
    coverImage: string
    slug: string
}

// 用户类型
export interface User {
    id: string
    username: string
    displayName: string
    avatar?: string
    bio?: string
    email: string
    role: 'admin' | 'user' | 'guest'
}

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
    data: T
    success: boolean
    message?: string
}

// 重新导出markdown.ts中的类型
export * from './markdown'

// 扩展Window接口，添加global属性
declare global {
    interface Window {
        global: Window
    }
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
 