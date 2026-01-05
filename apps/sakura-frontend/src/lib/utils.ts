import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { translateToEnglish, extractKeywords, generateSlugFromKeywords } from '@/utils/translateUtils'

/**
 * 合并类名工具函数，结合clsx和tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}

/**
 * 格式化日期的工具函数
 */
export function formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD'): string {
    const d = new Date(date)

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')

    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
}

/**
 * 节流函数类型定义
 */
export function throttle<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: number | null = null
    let previous = 0

    return function (this: any, ...args: Parameters<T>) {
        const now = Date.now()
        const remaining = wait - (now - previous)

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                window.clearTimeout(timeout)
                timeout = null
            }
            previous = now
            func.apply(this, args)
        } else if (!timeout) {
            timeout = window.setTimeout(() => {
                previous = Date.now()
                timeout = null
                func.apply(this, args)
            }, remaining)
        }
    }
}

/**
 * 防抖函数类型定义
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate: boolean = false
): (...args: Parameters<T>) => void {
    let timeout: number | null = null

    return function (this: any, ...args: Parameters<T>) {
        const callNow = immediate && !timeout

        if (timeout) {
            window.clearTimeout(timeout)
        }

        timeout = window.setTimeout(() => {
            timeout = null
            if (!immediate) {
                func.apply(this, args)
            }
        }, wait)

        if (callNow) {
            func.apply(this, args)
        }
    }
}

/**
 * 安全的解析JSON，带类型支持
 */
export function safeParseJSON<T>(json: string, fallback: T): T {
    try {
        return JSON.parse(json) as T
    } catch (e) {
        return fallback
    }
}

/**
 * 生成随机ID
 */
export function generateId(length: number = 8): string {
    return Math.random()
        .toString(36)
        .substring(2, 2 + length)
}

/**
 * 将文本转换为URL友好的slug (基础版)
 * @param text 需要转换的文本
 * @returns slug字符串
 */
export const generateBasicSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // 移除特殊字符
        .replace(/\s+/g, '-') // 空格替换为连字符
        .replace(/-+/g, '-') // 移除多余的连字符
        .trim() // 移除首尾空格
        .substring(0, 60) // 限制长度
}

/**
 * 高级版slug生成函数，支持中文标题转英文slug
 * @param title 文章标题
 * @param tags 标签数组
 * @param date 发布日期
 * @returns Promise<string> 生成的slug
 */
export async function generateSlug(title: string, tags: string[] = [], date?: string | Date): Promise<string> {
    if (!title || title.trim() === '') {
        // 如果没有标题，使用时间戳
        return `post-${Date.now().toString().slice(-8)}`
    }

    // 检查标题是否包含中文
    const hasChinese = /[\u4e00-\u9fa5]/.test(title)

    if (hasChinese) {
        try {
            // 翻译中文标题为英文
            const englishTitle = await translateToEnglish(title)

            // 提取关键词
            const keywords = extractKeywords(englishTitle)

            // 生成时间戳
            const timestamp = date ? new Date(date).getTime().toString().slice(-6) : Date.now().toString().slice(-6)

            // 根据关键词生成slug
            return generateSlugFromKeywords(keywords, timestamp)
        } catch (error) {
            console.error('生成slug失败:', error)

            // 回退方案：从标签中提取英文单词
            const englishWords = []

            // 从标签中提取英文单词
            for (const tag of tags) {
                const words = tag.match(/[a-zA-Z0-9]+/g)
                if (words) {
                    englishWords.push(...words)
                }
            }

            if (englishWords.length > 0) {
                return generateSlugFromKeywords(
                    englishWords.slice(0, 3).map(w => w.toLowerCase()),
                    Date.now().toString().slice(-6)
                )
            }

            // 如果所有方法都失败，使用基于日期的slug
            return `post-${Date.now().toString().slice(-8)}`
        }
    } else {
        // 英文标题，直接生成slug
        const cleanTitle = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

        // 提取关键词
        const words = cleanTitle
            .split('-')
            .filter(word => word.length > 1)
            .slice(0, 3)

        // 生成时间戳
        const timestamp = date ? new Date(date).getTime().toString().slice(-6) : Date.now().toString().slice(-6)

        return generateSlugFromKeywords(words, timestamp)
    }
}

// 构建文章URL
export const getPostUrl = (post: { id: string | number; slug?: string; title?: string }): string => {
    if (post.slug) {
        return `/post/${post.slug}`
    }

    // 如果没有slug，根据标题生成
    if (post.title) {
        return `/post/${post.id}-${generateBasicSlug(post.title)}`
    }

    // 最后的后备方案
    return `/post/${post.id}`
}
