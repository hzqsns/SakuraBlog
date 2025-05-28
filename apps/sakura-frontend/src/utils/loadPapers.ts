import { parseMarkdownWithSlug } from './markdownParser'
import { Paper } from '@/types/markdown'

// 全局缓存，避免重复加载文件路径
let cachedPaperPaths: string[] | null = null
let cachedAllPapers: Paper[] | null = null

/**
 * 获取所有文章的路径信息（轻量级操作）
 */
async function getAllPaperPaths(): Promise<string[]> {
    if (cachedPaperPaths) {
        return cachedPaperPaths
    }

    try {
        // 使用Vite的import.meta.glob只获取路径，不加载内容
        const modules = import.meta.glob('/src/paper/**/*.md', { as: 'url' })

        const paths = Object.keys(modules).filter(path => {
            // 跳过README.md文件
            return !path.toLowerCase().endsWith('readme.md')
        })

        cachedPaperPaths = paths
        return paths
    } catch (error) {
        console.error('Error getting paper paths:', error)
        return []
    }
}

/**
 * 从路径加载单个文章
 */
async function loadPaperFromPath(path: string): Promise<Paper | null> {
    try {
        // 动态导入单个文件
        const module = await import(`${path}?raw`)
        const markdownText = module.default

        // 从路径中提取文件名和目录名
        const pathMatch = path.match(/\/src\/paper\/([^/]+)\/([^/]+)\.md$/)
        if (!pathMatch) return null

        const dirName = pathMatch[1]
        const fileName = pathMatch[2]

        // 解析markdown内容
        const paperData = (await parseMarkdownWithSlug(markdownText, fileName, dirName)) as Paper

        // 添加文件路径信息
        paperData.filePath = path

        // 处理slug生成
        if (fileName.toLowerCase() !== 'index') {
            if (!paperData.originalSlug) {
                paperData.slug = generateSlugFromPath(dirName, fileName, paperData.title)
            }
        }

        // 计算阅读时间和字数
        const wordCount = paperData.content.split(/\s+/).length
        paperData.wordCount = wordCount
        paperData.readingTime = `${Math.ceil(wordCount / 200)}分钟`

        return paperData
    } catch (error) {
        console.error(`Error loading paper from path ${path}:`, error)
        return null
    }
}

/**
 * 分页加载文章
 * @param page 页码（从1开始）
 * @param pageSize 每页数量
 * @returns Promise<{papers: Paper[], hasMore: boolean, total: number}>
 */
export async function loadPapersPaginated(
    page: number = 1,
    pageSize: number = 6
): Promise<{
    papers: Paper[]
    hasMore: boolean
    total: number
}> {
    try {
        const allPaths = await getAllPaperPaths()
        const total = allPaths.length

        // 计算分页
        const startIndex = (page - 1) * pageSize
        const endIndex = Math.min(startIndex + pageSize, total)
        const hasMore = endIndex < total

        // 只加载当前页需要的文章
        const currentPagePaths = allPaths.slice(startIndex, endIndex)

        // 并行加载当前页的文章
        const paperPromises = currentPagePaths.map(path => loadPaperFromPath(path))
        const loadedPapers = await Promise.all(paperPromises)

        // 过滤掉加载失败的文章并排序
        const papers = loadedPapers
            .filter((paper): paper is Paper => paper !== null)
            .sort((a, b) => {
                return new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime()
            })

        return {
            papers,
            hasMore,
            total
        }
    } catch (error) {
        console.error('Error loading paginated papers:', error)
        return {
            papers: [],
            hasMore: false,
            total: 0
        }
    }
}

/**
 * 搜索文章（优化版）
 * @param query 搜索关键词
 * @param limit 返回结果数量限制
 */
export async function searchPapers(query: string, limit: number = 20): Promise<Paper[]> {
    if (!query.trim()) return []

    try {
        // 先加载所有文章的基本信息（较少的内容）
        const allPaths = await getAllPaperPaths()
        const searchResults: Paper[] = []

        // 分批加载和搜索，避免一次性加载太多
        const batchSize = 10
        for (let i = 0; i < allPaths.length && searchResults.length < limit; i += batchSize) {
            const batchPaths = allPaths.slice(i, i + batchSize)
            const batchPromises = batchPaths.map(path => loadPaperFromPath(path))
            const batchPapers = await Promise.all(batchPromises)

            // 搜索当前批次
            for (const paper of batchPapers) {
                if (!paper || searchResults.length >= limit) continue

                const searchableContent = [
                    paper.title,
                    paper.content,
                    paper.excerpt,
                    paper.author,
                    ...(paper.tags || []),
                    ...paper.category
                ]
                    .join(' ')
                    .toLowerCase()

                if (searchableContent.includes(query.toLowerCase())) {
                    searchResults.push(paper)
                }
            }
        }

        // 按发布日期排序
        return searchResults.sort((a, b) => {
            return new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime()
        })
    } catch (error) {
        console.error('Error searching papers:', error)
        return []
    }
}

/**
 * 获取所有标签（优化版，只加载必要信息）
 */
export async function getAllTags(): Promise<{ name: string; count: number }[]> {
    try {
        const allPaths = await getAllPaperPaths()
        const tagCounts: Record<string, number> = {}

        // 分批加载以获取标签信息
        const batchSize = 15
        for (let i = 0; i < allPaths.length; i += batchSize) {
            const batchPaths = allPaths.slice(i, i + batchSize)
            const batchPromises = batchPaths.map(path => loadPaperFromPath(path))
            const batchPapers = await Promise.all(batchPromises)

            batchPapers.forEach(paper => {
                if (paper?.tags) {
                    paper.tags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1
                    })
                }
            })
        }

        return Object.entries(tagCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
    } catch (error) {
        console.error('Error loading tags:', error)
        return []
    }
}

/**
 * 根据标签获取文章
 */
export async function getPapersByTag(tag: string): Promise<Paper[]> {
    try {
        const allPaths = await getAllPaperPaths()
        const taggedPapers: Paper[] = []

        // 分批加载和过滤
        const batchSize = 10
        for (let i = 0; i < allPaths.length; i += batchSize) {
            const batchPaths = allPaths.slice(i, i + batchSize)
            const batchPromises = batchPaths.map(path => loadPaperFromPath(path))
            const batchPapers = await Promise.all(batchPromises)

            batchPapers.forEach(paper => {
                if (paper?.tags && paper.tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
                    taggedPapers.push(paper)
                }
            })
        }

        return taggedPapers.sort((a, b) => {
            return new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime()
        })
    } catch (error) {
        console.error(`Error loading papers with tag ${tag}:`, error)
        return []
    }
}

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
