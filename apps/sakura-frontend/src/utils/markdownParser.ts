/**
 * Markdown解析工具
 * 用于解析markdown文件的前置元数据和内容
 */

import { MarkdownData } from '@/types/markdown'
import { generateSlug } from '@/lib/utils'

/**
 * 规范化markdown内容中的换行符
 * 确保不会有过多的连续空行
 */
function normalizeLineBreaks(text: string): string {
    // 1. 将Windows风格换行符(\r\n)替换为Unix风格(\n)
    let normalized = text.replace(/\r\n/g, '\n')

    // 2. 将三个以上连续的换行符替换为两个换行符（两个空行）
    normalized = normalized.replace(/\n{3,}/g, '\n\n')

    return normalized
}

/**
 * 解析Markdown文件内容，提取元数据和正文内容
 * @param markdown 原始markdown文本内容
 * @returns 解析后的结构化数据
 */
export function parseMarkdown(markdown: string): MarkdownData {
    // 默认结果对象
    const result: MarkdownData = {
        title: '',
        excerpt: '',
        author: '',
        publishDate: '',
        coverImage: '',
        slug: '',
        date: '',
        tags: [],
        category: [],
        content: ''
    }

    // 检查文件是否有前置元数据部分（由---分隔）
    if (!markdown.startsWith('---')) {
        // 没有元数据，直接将全部内容作为content返回
        result.content = normalizeLineBreaks(markdown)
        return result
    }

    // 查找元数据部分的结束位置
    const endOfFrontMatter = markdown.indexOf('---', 3)
    if (endOfFrontMatter === -1) {
        // 没有找到结束标记，直接将全部内容作为content返回
        result.content = normalizeLineBreaks(markdown)
        return result
    }

    // 提取元数据部分
    const frontMatter = markdown.substring(3, endOfFrontMatter).trim()

    // 提取内容部分（元数据之后的所有内容）
    // 正确处理元数据后的内容，移除第一个空行
    const contentStartPos = endOfFrontMatter + 3
    const content = markdown.substring(contentStartPos).trim()

    // 规范化内容中的换行符
    result.content = normalizeLineBreaks(content)

    // 解析元数据
    const lines = frontMatter.split('\n')
    let currentKey = ''
    let isInArray = false

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        // 跳过空行
        if (!line) continue

        // 检查是否是新的键值对
        if (line.includes(':') && !line.startsWith('-')) {
            const [key, ...valueParts] = line.split(':')
            currentKey = key.trim()

            // 处理值为数组的情况（下一行会是 - item1 这种格式）
            const value = valueParts.join(':').trim()

            // 检查是否是空数组声明
            if (value === '') {
                isInArray = true
                result[currentKey] = []
            } else {
                // 处理普通值，移除可能的引号
                result[currentKey] = value.replace(/^['"](.*)['"]$/, '$1') as unknown
                isInArray = false
            }
        }
        // 处理数组项
        else if (line.startsWith('-') && isInArray && currentKey) {
            if (!Array.isArray(result[currentKey])) {
                result[currentKey] = []
            }

            // 提取数组项的值，移除'-'并去除前后空格和引号
            const arrayValue = line
                .substring(1)
                .trim()
                .replace(/^['"](.*)['"]$/, '$1')
            ;(result[currentKey] as string[]).push(arrayValue)
        }
        // 继续处理多行文本或其他特殊情况
        else {
            // 如果不是数组项且不是新的键值对，则可能是多行文本或YAML中的特殊情况
            // 这里简单处理，实际应用中可能需要更复杂的YAML解析器
            if (currentKey && !isInArray && typeof result[currentKey] === 'string') {
                result[currentKey] = (result[currentKey] as string) + '\n' + line
            }
        }
    }

    return result
}

/**
 * 解析Markdown并动态生成slug
 * 此函数会在slug为空时生成基于标题的slug
 * @param markdown 原始markdown文本内容
 * @param fileName 可选的文件名（不含扩展名）
 * @param dirName 可选的目录名
 * @returns Promise<MarkdownData> 解析后的数据（包含生成的slug）
 */
export async function parseMarkdownWithSlug(markdown: string, fileName?: string, dirName?: string): Promise<MarkdownData> {
    // 先解析文档基本信息
    const result = parseMarkdown(markdown)

    // 保存原始slug，如果前置元数据中有定义的话
    if (result.slug) {
        result.originalSlug = result.slug
    }

    // 如果没有指定slug或slug为空，则使用标题和标签动态生成
    if (!result.slug || result.slug.trim() === '') {
        try {
            // 如果提供了文件名和目录名，优先使用它们生成slug
            if (fileName && dirName) {
                // 如果文件名不是index，使用dirName-fileName格式
                if (fileName.toLowerCase() !== 'index') {
                    result.slug = `${dirName.toLowerCase()}-${fileName.toLowerCase()}`
                } else {
                    // 如果是index.md，则尝试使用标题生成slug
                    result.slug = await generateSlug(result.title, result.tags, result.publishDate || result.date)
                }
            } else {
                // 无文件名和目录名信息时，使用翻译功能生成基于标题的slug
                result.slug = await generateSlug(result.title, result.tags, result.publishDate || result.date)
            }
        } catch (error) {
            console.error('动态生成slug失败:', error)
            // 失败时使用一个默认的基于日期的slug
            const now = new Date()
            result.slug = `post-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${now.getTime().toString().slice(-6)}`
        }
    }

    return result
}

/**
 * 从文件路径中读取并解析Markdown文件
 * 此函数适用于浏览器环境下的文件读取，比如通过fetch API
 *
 * @param filePath Markdown文件路径
 * @returns Promise<MarkdownData> 解析后的数据
 */
export async function loadMarkdownFile(filePath: string): Promise<MarkdownData> {
    try {
        const response = await fetch(filePath)
        if (!response.ok) {
            throw new Error(`Failed to fetch markdown file: ${response.statusText}`)
        }

        const markdownText = await response.text()
        return parseMarkdownWithSlug(markdownText)
    } catch (error) {
        console.error('Error loading markdown file:', error)
        throw error
    }
}

/**
 * 批量加载多个Markdown文件
 *
 * @param filePaths Markdown文件路径数组
 * @returns Promise<MarkdownData[]> 解析后的数据数组
 */
export async function loadMultipleMarkdownFiles(filePaths: string[]): Promise<MarkdownData[]> {
    try {
        const promises = filePaths.map(filePath => loadMarkdownFile(filePath))
        return await Promise.all(promises)
    } catch (error) {
        console.error('Error loading multiple markdown files:', error)
        throw error
    }
}
