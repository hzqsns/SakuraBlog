import { parseMarkdown } from './markdownParser'
import { Paper } from '@/types/markdown'

/**
 * 根据paper目录下的index.md文件生成文章列表
 * 此函数应在服务端构建时调用，或者在客户端通过动态导入方式使用
 *
 * 注意：在实际项目中，这个函数可能需要使用Node.js的fs模块或Vite的import.meta.glob功能
 * 本例中使用了一个简化版本，模拟文件系统操作
 */
export async function loadAllPapers(): Promise<Paper[]> {
    try {
        // 在实际项目中，这里应该使用项目特定的方式来获取所有Markdown文件
        // 例如使用Vite的import.meta.glob:
        // const modules = import.meta.glob('/src/paper/*/index.md')

        // 这里我们模拟通过fetch获取文件列表的过程
        // 实际生产环境中应替换为适合你项目结构的实现
        const paperDirectories = [
            'loop-variables-and-closures',
            'extend-markdown-syntax-part-1',
            'tensorrt-pitfalls-and-solutions',
            'sql-advanced-handbook',
            'learn-react-hooks-from-scratch'
        ]

        // 模拟加载所有文章
        const papers: Paper[] = []

        for (const dir of paperDirectories) {
            try {
                // 实际项目中，这里应该使用文件系统API或者其他方式读取文件
                const response = await fetch(`/src/paper/${dir}/index.md`)
                if (!response.ok) {
                    console.warn(`Failed to load paper: ${dir}`)
                    continue
                }

                const markdownText = await response.text()
                const paperData = parseMarkdown(markdownText) as Paper

                // 计算阅读时间（假设一分钟阅读200个单词）
                const wordCount = paperData.content.split(/\s+/).length
                paperData.wordCount = wordCount
                paperData.readingTime = `${Math.ceil(wordCount / 200)}分钟`

                papers.push(paperData)
            } catch (error) {
                console.error(`Error loading paper ${dir}:`, error)
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

/**
 * 使用Vite的import.meta.glob实现的版本
 * 此函数仅适用于Vite项目
 */
export async function loadAllPapersVite(): Promise<Paper[]> {
    try {
        // 使用Vite的import.meta.glob加载所有Markdown文件
        // 这行代码会在构建时被Vite处理，自动导入所有匹配的文件
        const modules = import.meta.glob('/src/paper/*/index.md', { as: 'raw' })

        // 处理每个导入的模块
        const papers: Paper[] = []

        for (const path in modules) {
            try {
                // 导入模块内容
                const markdownText = await modules[path]()
                const paperData = parseMarkdown(markdownText) as Paper

                // 计算阅读时间
                const wordCount = paperData.content.split(/\s+/).length
                paperData.wordCount = wordCount
                paperData.readingTime = `${Math.ceil(wordCount / 200)}分钟`

                papers.push(paperData)
            } catch (error) {
                console.error(`Error loading paper from ${path}:`, error)
            }
        }

        // 按发布日期排序
        return papers.sort((a, b) => {
            return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        })
    } catch (error) {
        console.error('Error loading papers with Vite:', error)
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
