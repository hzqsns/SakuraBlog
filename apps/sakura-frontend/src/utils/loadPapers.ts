import { parseMarkdownWithSlug } from './markdownParser'
import { Paper } from '@/types/markdown'

/**
 * 根据paper目录下的所有.md文件生成文章列表
 * 此函数在客户端通过Vite的动态导入功能获取所有文章
 */
export async function loadAllPapers(): Promise<Paper[]> {
    try {
        // 使用Vite的import.meta.glob动态获取paper目录下的所有.md文件
        const modules = import.meta.glob('/src/paper/**/*.md', { as: 'raw' })

        // 处理每个导入的模块
        const papers: Paper[] = []

        for (const path in modules) {
            try {
                // 跳过可能存在的README.md文件
                if (path.toLowerCase().endsWith('readme.md')) continue

                // 从路径中提取文件名和目录名
                const pathMatch = path.match(/\/src\/paper\/([^/]+)\/([^/]+)\.md$/)
                if (!pathMatch) continue

                const dirName = pathMatch[1] // 目录名
                const fileName = pathMatch[2] // 文件名（不含扩展名）

                // 导入模块内容
                const markdownText = await modules[path]()

                // 使用支持动态slug生成的解析函数，传入文件名作为参考
                const paperData = (await parseMarkdownWithSlug(markdownText, fileName, dirName)) as Paper

                // 添加文件路径信息，以便后续可能的处理
                paperData.filePath = path

                // 如果文件不是index.md，更新文章的URL标识
                if (fileName.toLowerCase() !== 'index') {
                    // 如果前置元数据中已有slug，则不覆盖
                    if (!paperData.originalSlug) {
                        paperData.slug = generateSlugFromPath(dirName, fileName, paperData.title)
                    }
                }

                // 计算阅读时间和字数
                const wordCount = paperData.content.split(/\s+/).length
                paperData.wordCount = wordCount
                paperData.readingTime = `${Math.ceil(wordCount / 200)}分钟`
                papers.push(paperData)
            } catch (error) {
                console.error(`Error loading paper from path ${path}:`, error)
            }
        }

        // 按发布日期排序，最新的在前面
        return papers.sort((a, b) => {
            return new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime()
        })
    } catch (error) {
        console.error('Error loading papers:', error)
        return []
    }
}

/**
 * 基于目录名、文件名和标题生成slug
 */
function generateSlugFromPath(dirName: string, fileName: string, title: string): string {
    // 默认使用文件名作为基础
    let baseSlug = fileName.toLowerCase()

    // 如果文件名是index，则使用目录名
    if (fileName.toLowerCase() === 'index') {
        baseSlug = dirName.toLowerCase()
    }

    // 如果标题存在且文件名是index.md，使用标题生成slug部分
    // 移除非字母数字字符，替换空格为连字符
    const titleSlug = title
        ? title
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
        : ''

    // 如果有意义的标题slug存在，则使用目录名-标题的格式
    if (titleSlug && titleSlug !== 'index') {
        return `${dirName.toLowerCase()}-${titleSlug}`
    }

    // 否则返回基础slug
    return baseSlug
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
