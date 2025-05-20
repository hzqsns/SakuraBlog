/**
 * 浏览器环境下的翻译工具函数
 */

/**
 * 将中文文本翻译为英文
 * 直接调用Google翻译API，无需第三方库
 * @param text 需要翻译的中文文本
 * @returns 英文翻译结果
 */
export async function translateToEnglish(text: string): Promise<string> {
    try {
        // 检查文本是否包含中文字符
        const hasChinese = /[\u4e00-\u9fa5]/.test(text)
        if (!hasChinese) {
            return text // 如果没有中文字符，直接返回原文本
        }

        // 构建Google翻译API URL
        const googleTranslateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encodeURIComponent(
            text
        )}`

        // 发起请求
        const response = await fetch(googleTranslateUrl)

        if (!response.ok) {
            throw new Error(`翻译请求失败: ${response.statusText}`)
        }

        // 解析返回的数据
        const data = await response.json()

        // Google翻译API返回的数据结构是一个嵌套数组，第一个元素包含翻译结果
        let translatedText = ''
        if (data && data[0] && Array.isArray(data[0])) {
            // 合并所有翻译片段
            translatedText = data[0]
                .filter(item => item && item[0])
                .map(item => item[0])
                .join('')
        }

        return translatedText || text
    } catch (error) {
        console.error('翻译失败:', error)

        // 翻译失败时的备选方案：简单替换
        // 这不是真正的翻译，但可以为纯中文标题生成一些英文字符
        return simplifiedPinyinMapping(text)
    }
}

/**
 * 中文字符简单映射 - 当翻译API失败时的备选方案
 * 这只是一个非常简单的实现，并不是真正的拼音转换
 */
function simplifiedPinyinMapping(text: string): string {
    // 仅截取前10个字符以避免slug过长
    const truncatedText = text.substring(0, 10)
    // 为了确保生成一些英文内容，使用中文字符数作为一个标识
    const charCount = truncatedText.length
    return `chinese-article-${charCount}-${Date.now().toString().slice(-4)}`
}

/**
 * 从英文文本中提取关键词
 * @param text 英文文本
 * @param maxWords 最大单词数量
 * @returns 关键词数组
 */
export function extractKeywords(text: string, maxWords: number = 3): string[] {
    // 英文停用词列表
    const stopWords = [
        'a',
        'an',
        'the',
        'and',
        'but',
        'or',
        'for',
        'nor',
        'on',
        'at',
        'to',
        'from',
        'by',
        'in',
        'of',
        'with',
        'about',
        'as',
        'is',
        'are',
        'was',
        'were',
        'be',
        'been',
        'being',
        'have',
        'has',
        'had',
        'do',
        'does',
        'did',
        'will',
        'would',
        'shall',
        'should',
        'may',
        'might',
        'must',
        'can',
        'could'
    ]

    // 分词并过滤停用词
    const words = text
        .toLowerCase()
        .split(/\s+/)
        .filter(word => {
            // 保留非停用词且长度大于1的单词
            const cleanWord = word.replace(/[^\w]/g, '')
            return cleanWord.length > 1 && !stopWords.includes(cleanWord)
        })
        .map(word => word.replace(/[^\w-]/g, ''))
        .filter(word => word.length > 0)

    // 返回指定数量的关键词
    return words.slice(0, maxWords)
}

/**
 * 生成英文slug
 * @param keywords 关键词数组
 * @param timestamp 时间戳（可选）
 * @returns slug字符串
 */
export function generateSlugFromKeywords(keywords: string[], timestamp?: string): string {
    if (!keywords || keywords.length === 0) {
        return `post-${Date.now().toString().slice(-8)}`
    }

    const slug = keywords.join('-')

    // 添加时间戳确保唯一性
    const uniqueStr = timestamp || Date.now().toString().slice(-6)

    return `${slug}-${uniqueStr}`
}

/**
 * 从提取的英文单词生成slug
 * @param text 英文文本
 * @returns 英文slug
 */
export function generateSlugFromEnglish(text: string): string {
    // 从文本中提取英文单词
    const englishWords = text.match(/[a-zA-Z0-9]+/g) || []

    // 如果有英文单词，使用它们
    if (englishWords.length > 0) {
        return englishWords.slice(0, 3).join('-').toLowerCase()
    }

    // 如果没有英文单词，返回基于时间的slug
    return `post-${Date.now().toString().slice(-8)}`
}
