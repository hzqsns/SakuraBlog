/**
 * Markdown相关类型定义
 */

/**
 * 解析后的Markdown元数据和内容结构
 */
export interface MarkdownData {
    title: string
    excerpt: string
    author: string
    publishDate: string
    coverImage: string
    slug: string
    date: string
    tags: string[]
    category: string[]
    content: string
    [key: string]: unknown // 允许其他自定义字段，使用unknown替代any
}

/**
 * 博客文章数据接口
 */
export interface Paper extends MarkdownData {
    // 扩展的额外字段
    readingTime?: string // 阅读时间估计
    wordCount?: number // 单词数量
}
