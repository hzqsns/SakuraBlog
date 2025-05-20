import { parseMarkdownWithSlug } from './markdownParser'
import { Paper } from '@/types/markdown'

/**
 * 根据paper目录下的index.md文件生成文章列表
 * 此函数在客户端通过Vite的动态导入功能获取所有文章
 */
export async function loadAllPapers(): Promise<Paper[]> {
    try {
        // 使用Vite的import.meta.glob动态获取所有paper目录下的index.md文件
        const modules = import.meta.glob('/src/paper/*/index.md', { as: 'raw' })

        // 处理每个导入的模块
        const papers: Paper[] = []

        for (const path in modules) {
            try {
                // 导入模块内容
                const markdownText = await modules[path]()

                // 使用支持动态slug生成的解析函数
                const paperData = (await parseMarkdownWithSlug(markdownText)) as Paper

                // 计算阅读时间（假设一分钟阅读200个单词）
                const wordCount = paperData.content.split(/\s+/).length
                paperData.wordCount = wordCount
                paperData.readingTime = `${Math.ceil(wordCount / 200)}分钟`

                papers.push(paperData)
            } catch (error) {
                // 提取文件夹名称用于错误日志
                const dirMatch = path.match(/\/src\/paper\/([^/]+)\/index\.md/)
                const dirName = dirMatch ? dirMatch[1] : path
                console.error(`Error loading paper ${dirName}:`, error)
            }
        }

        // 按发布日期排序，最新的在前面
        return papers.sort((a, b) => {
            return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        })
    } catch (error) {
        console.error('Error loading papers:', error)
        return []
    }
}

// 导出单个文章的加载函数
export async function loadPaperBySlug(slug: string): Promise<Paper | null> {
    try {
        const allPapers = await loadAllPapers()
        return allPapers.find(paper => paper.slug === slug) || null
    } catch (error) {
        console.error(`Error loading paper with slug ${slug}:`, error)
        return null
    }
}
