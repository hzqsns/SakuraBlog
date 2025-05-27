import { FC, useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loadPaperBySlug } from '@/utils/loadPapers'
import { Paper } from '@/types/markdown'
import { CalendarIcon, Clock, BookOpen, Hash } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Catalogue } from '@/components/blog/Catalogue'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Waline } from '@/components/comment'

// 扩展标题项类型，包含层级信息
interface HeadingItem {
    id: string
    text: string
    level: number
    index?: number // 添加索引属性
}

export const PostDetail: FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const [paper, setPaper] = useState<Paper | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [activeHeading, setActiveHeading] = useState<string | null>(null)

    // 导航栏高度偏移量，根据实际导航栏高度调整
    const NAVBAR_HEIGHT_OFFSET = 80

    useEffect(() => {
        if (!slug) return

        const fetchPaper = async () => {
            setIsLoading(true)
            try {
                const paperData = await loadPaperBySlug(slug)
                if (paperData) {
                    setPaper(paperData)
                    setIsLoaded(true)
                }
            } catch (error) {
                console.error(`Error loading paper with slug ${slug}:`, error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPaper()
    }, [slug])

    // 提取markdown文本中的标题作为目录，支持多种格式
    const extractHeadings = useCallback((markdown: string): HeadingItem[] => {
        if (!markdown) return []

        const headings: HeadingItem[] = []
        let headingCounter = 0 // 统一的标题计数器

        // 创建标题ID的统一函数
        const createHeadingId = () => {
            headingCounter++
            return `heading-${headingCounter}`
        }

        // 1. 匹配标准 Markdown 标题 (# ## ### 等)
        const markdownHeadingRegex = /^(#{1,6})\s+(.+)$/gm
        let match
        const markdownMatches = []
        while ((match = markdownHeadingRegex.exec(markdown)) !== null) {
            markdownMatches.push({
                start: match.index,
                level: match[1].length,
                text: match[2].trim(),
                type: 'markdown'
            })
        }

        // 2. 匹配 HTML 标题标签 (<h1> <h2> 等)
        const htmlHeadingRegex = /<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/gi
        const htmlMatches = []
        while ((match = htmlHeadingRegex.exec(markdown)) !== null) {
            htmlMatches.push({
                start: match.index,
                level: parseInt(match[1]),
                text: match[2].trim(),
                type: 'html'
            })
        }

        // 3. 匹配列表中的关键内容（特殊处理）
        const listHeadingRegex = /<li>([^<]{1,20})(<ul>|<\/li>)/gi
        const listMatches = []
        while ((match = listHeadingRegex.exec(markdown)) !== null) {
            const text = match[1].trim()

            // 只匹配看起来像标题的关键词或短词汇
            const titleKeywords = [
                '分析',
                '注意点',
                '目录',
                '题目',
                '输入输出',
                '思路',
                '解法',
                '代码',
                '总结',
                '实现',
                '算法',
                '复杂度',
                '说明',
                '方法',
                '步骤',
                '背景',
                '原理',
                '结论'
            ]
            const isShortTitle =
                text.length <= 8 && !text.includes('我') && !text.includes('的') && !text.includes('。') && !text.includes('，')

            if (titleKeywords.some(keyword => text.includes(keyword)) || isShortTitle) {
                listMatches.push({
                    start: match.index,
                    level: 2,
                    text: text,
                    type: 'list'
                })
            }
        }

        // 3.1. 特殊处理WordPress列表格式
        const wpListRegex = /<!-- wp:list-item -->\s*<li>([^<]{1,20})<ul>/gi
        while ((match = wpListRegex.exec(markdown)) !== null) {
            const text = match[1].trim()
            const titleKeywords = ['分析', '注意点', '目录', '题目', '输入输出', '思路', '解法', '代码', '总结', '实现', '算法', '复杂度']

            if (titleKeywords.some(keyword => text.includes(keyword)) || text.length <= 8) {
                listMatches.push({
                    start: match.index,
                    level: 2,
                    text: text,
                    type: 'wp-list'
                })
            }
        }

        // 4. 尝试匹配其他可能的标题结构
        const otherHeadingRegex = /<!-- wp:(heading|list) [^>]*>[\s\S]*?<(h[1-6]|li)(?:[^>]*)>([^<]+)<\/(?:h[1-6]|li)>/gi
        const otherMatches = []
        while ((match = otherHeadingRegex.exec(markdown)) !== null) {
            const text = match[3]?.trim()
            if (text && text.length >= 2 && text.length <= 20) {
                const level = match[2].startsWith('h') ? parseInt(match[2].slice(1)) : 2
                otherMatches.push({
                    start: match.index,
                    level: level,
                    text: text,
                    type: 'other'
                })
            }
        }

        // 合并所有匹配结果并按出现位置排序
        const allMatches = [...markdownMatches, ...htmlMatches, ...listMatches, ...otherMatches]
        allMatches.sort((a, b) => a.start - b.start)

        // 去除重复的标题（相同文本且位置接近）
        const uniqueMatches = []
        for (const match of allMatches) {
            const isDuplicate = uniqueMatches.some(existing => {
                const textSimilar = existing.text === match.text
                const positionClose = Math.abs(existing.start - match.start) < 100
                return textSimilar && positionClose
            })
            if (!isDuplicate) {
                uniqueMatches.push(match)
            }
        }

        // 转换为标题项
        for (const match of uniqueMatches) {
            headings.push({
                id: createHeadingId(),
                text: match.text,
                level: match.level,
                index: headings.length + 1
            })
        }

        // 如果仍然没有找到标题，使用备用方案
        if (headings.length === 0) {
            // 简单匹配一些可能的标题格式
            const fallbackRegex = /^([*-]\s*)?([^\n]{3,20})$/gm
            const fallbackMatches = []
            while ((match = fallbackRegex.exec(markdown)) !== null) {
                const text = match[2].trim()
                // 只选择看起来像标题的行
                if (text.length >= 3 && text.length <= 20 && !text.includes('```') && !text.includes('http')) {
                    fallbackMatches.push(text)
                }
            }

            // 限制备用标题的数量
            fallbackMatches.slice(0, 5).forEach(text => {
                headings.push({
                    id: createHeadingId(),
                    text: text,
                    level: 2,
                    index: headings.length + 1
                })
            })
        }

        console.log('提取到的标题：', headings)
        return headings
    }, [])

    const headings = paper?.content ? extractHeadings(paper.content) : []

    // 平滑滚动到目标位置，添加偏移量以避免被导航栏遮挡
    const scrollToHeading = useCallback(
        (id: string) => {
            const element = document.getElementById(id)
            if (element) {
                // 获取元素位置
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset

                // 使用自定义滚动，计入偏移量
                window.scrollTo({
                    top: elementPosition - NAVBAR_HEIGHT_OFFSET,
                    behavior: 'smooth'
                })

                setActiveHeading(id)

                // 更新URL而不引起页面跳转
                window.history.replaceState(null, '', `#${id}`)
            }
        },
        [NAVBAR_HEIGHT_OFFSET]
    )

    // 监听URL hash变化，实现通过URL直接跳转
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash
            if (hash) {
                const id = hash.slice(1) // 移除#符号
                scrollToHeading(id)
            }
        }

        // 初始加载时检查
        handleHashChange()

        // 添加事件监听器
        window.addEventListener('hashchange', handleHashChange)

        return () => {
            window.removeEventListener('hashchange', handleHashChange)
        }
    }, [scrollToHeading])

    // 页面滚动时更新当前活动的标题
    useEffect(() => {
        if (!isLoaded || headings.length === 0) return

        const handleScroll = () => {
            // 获取所有标题元素，增强查找逻辑
            const headingElements = headings
                .map(h => {
                    let element = document.getElementById(h.id)

                    // 如果直接通过ID找不到，尝试其他方法
                    if (!element) {
                        // 首先尝试查找具有特定标记的元素
                        const markedElements = document.querySelectorAll('.heading-marker')
                        for (const el of markedElements) {
                            const textContent = el.textContent?.trim()
                            if (textContent === h.text) {
                                element = el as HTMLElement
                                if (!element.id) {
                                    element.id = h.id
                                }
                                break
                            }
                        }

                        // 如果还是找不到，尝试更广泛的查找
                        if (!element) {
                            const possibleElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, li, p, strong, b')
                            for (const el of possibleElements) {
                                const textContent = el.textContent?.trim()
                                if (textContent === h.text) {
                                    element = el as HTMLElement
                                    // 为找到的元素添加ID，以便后续查找
                                    if (!element.id) {
                                        element.id = h.id
                                    }
                                    break
                                }
                            }
                        }
                    }

                    return {
                        id: h.id,
                        text: h.text,
                        element: element
                    }
                })
                .filter(item => item.element !== null)

            if (headingElements.length === 0) {
                console.log('未找到任何标题元素，标题列表：', headings)
                return
            }

            // 简化的滚动检测逻辑
            const scrollTop = window.pageYOffset
            const threshold = NAVBAR_HEIGHT_OFFSET + 20 // 检测阈值

            let activeId = null

            // 从上到下遍历所有标题，找到当前应该高亮的标题
            for (let i = headingElements.length - 1; i >= 0; i--) {
                const heading = headingElements[i]
                if (!heading.element) continue

                const elementTop = heading.element.offsetTop

                // 如果当前滚动位置已经超过了这个标题的位置，就激活这个标题
                if (scrollTop >= elementTop - threshold) {
                    activeId = heading.id
                    console.log(`找到激活标题: ${heading.text} (scrollTop: ${scrollTop}, elementTop: ${elementTop})`)
                    break
                }
            }

            // 如果没有找到合适的标题，且滚动位置在第一个标题之前，则激活第一个标题
            if (!activeId && headingElements.length > 0) {
                activeId = headingElements[0].id
                console.log(`使用默认第一个标题: ${headingElements[0].text}`)
            }

            // 更新活动标题
            if (activeId && activeHeading !== activeId) {
                console.log(`切换激活标题: ${activeHeading} -> ${activeId}`)
                setActiveHeading(activeId)
                // 更新URL而不引起页面跳转
                window.history.replaceState(null, '', `#${activeId}`)
            }
        }

        window.addEventListener('scroll', handleScroll)
        // 延迟初始检查，确保DOM完全加载
        setTimeout(handleScroll, 100)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [isLoaded, headings, activeHeading, NAVBAR_HEIGHT_OFFSET])

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-4">
                <div className="animate-pulse">
                    <div className="w-full h-[60vh] bg-gray-200 rounded-2xl mb-8"></div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>

                        <div className="space-y-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i}>
                                    <div className="h-6 bg-gray-200 rounded mb-2 w-1/3"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!paper) {
        return <div className="container mx-auto px-4 py-4">文章不存在</div>
    }

    return (
        <div className="container mx-auto px-4 py-4 bg-gray-50">
            {/* 顶部图片和标题区域 */}
            <div className="relative mb-8">
                <div className="w-full h-[60vh] relative">
                    <img
                        src={
                            paper.coverImage ||
                            'https://images.unsplash.com/photo-1505673542670-a5e3ff5b8310?q=80&w=1974&auto=format&fit=crop'
                        }
                        alt={paper.title}
                        className="w-full h-full object-cover rounded-2xl article-cover-image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{paper.title}</h1>

                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {paper.tags?.map(tag => (
                            <Link
                                key={tag}
                                to={`/tag/${tag}`}
                                className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center"
                            >
                                <Hash className="h-4 w-4 mr-1" />
                                {tag}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-white/90">
                        <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(paper.publishDate || new Date().toISOString())}
                        </span>
                        <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {paper.readingTime || `${Math.ceil(paper.content.length / 300)}分钟`}
                        </span>
                        <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {paper.wordCount || paper.content.length} 字
                        </span>
                    </div>
                </div>
            </div>

            {/* 文章内容区域 */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* 左侧目录 */}
                <Catalogue headings={headings} activeHeading={activeHeading} onHeadingClick={scrollToHeading} />

                {/* 右侧文章内容 */}
                <div
                    className="flex-1 bg-white rounded-xl shadow-sm p-6 prose prose-lg max-w-full text-left markdown-body break-words"
                    id="article-content"
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            // 为标题添加ID，使用精确匹配
                            h1: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading ? heading.id : `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h1 id={id} {...props}>
                                        {children}
                                    </h1>
                                )
                            },
                            h2: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading ? heading.id : `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h2 id={id} {...props}>
                                        {children}
                                    </h2>
                                )
                            },
                            h3: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading ? heading.id : `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h3 id={id} {...props}>
                                        {children}
                                    </h3>
                                )
                            },
                            h4: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading ? heading.id : `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h4 id={id} {...props}>
                                        {children}
                                    </h4>
                                )
                            },
                            h5: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading ? heading.id : `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h5 id={id} {...props}>
                                        {children}
                                    </h5>
                                )
                            },
                            h6: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading ? heading.id : `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h6 id={id} {...props}>
                                        {children}
                                    </h6>
                                )
                            },
                            // 为列表项添加ID支持（处理特殊格式的标题）
                            li: ({ children, ...props }) => {
                                const text = String(children).trim()
                                // 更精确的匹配逻辑
                                let heading = headings.find(h => h.text === text)

                                // 如果直接匹配不到，尝试模糊匹配
                                if (!heading) {
                                    heading = headings.find(h => text.includes(h.text) || h.text.includes(text))
                                }

                                if (heading) {
                                    console.log(`为列表项设置ID: "${text}" -> ${heading.id} (标题: "${heading.text}")`)
                                    return (
                                        <li id={heading.id} className="heading-marker" {...props}>
                                            {children}
                                        </li>
                                    )
                                }
                                return <li {...props}>{children}</li>
                            },
                            // 处理其他可能包含标题的元素
                            p: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                if (heading && text.length < 50) {
                                    return (
                                        <p id={heading.id} {...props}>
                                            {children}
                                        </p>
                                    )
                                }
                                return <p {...props}>{children}</p>
                            }
                        }}
                    >
                        {paper.content || ''}
                    </ReactMarkdown>
                </div>
            </div>

            {/* 评论 */}
            <div className="mt-12">
                <Waline
                    serverURL="https://waline-comment-eta-three.vercel.app/"
                    path={`/post/${paper.slug}`}
                    emoji={['//unpkg.com/@waline/emojis@1.2.0/weibo', '//unpkg.com/@waline/emojis@1.2.0/bmoji']}
                    reaction={[
                        'https://unpkg.com/@waline/emojis@1.2.0/bmoji/bmoji_give_love.png',
                        'https://unpkg.com/@waline/emojis@1.2.0/bmoji/bmoji_doge.png',
                        'https://unpkg.com/@waline/emojis@1.2.0/bmoji/bmoji_unhappy.png'
                    ]}
                />
            </div>
        </div>
    )
}
