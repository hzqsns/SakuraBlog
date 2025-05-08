import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

// 将标题转换为URL友好的slug
export const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // 移除特殊字符
        .replace(/\s+/g, '-') // 空格替换为连字符
        .replace(/-+/g, '-') // 移除多余的连字符
        .trim() // 移除首尾空格
        .substring(0, 60) // 限制长度
}

// 构建文章URL
export const getPostUrl = (post: { id: string; slug?: string; title?: string }): string => {
    if (post.slug) {
        return `/post/${post.slug}`
    }

    // 如果没有slug，根据标题生成
    if (post.title) {
        return `/post/${post.id}-${generateSlug(post.title)}`
    }

    // 最后的后备方案
    return `/post/${post.id}`
}
