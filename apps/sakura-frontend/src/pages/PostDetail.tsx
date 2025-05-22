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

    // 提取markdown文本中的标题作为目录，并添加序号
    const extractHeadings = useCallback((markdown: string): HeadingItem[] => {
        if (!markdown) return []

        // 使用正则表达式匹配Markdown标题行 (##开头)
        const headingRegex = /^(#{2,6})\s+(.+)$/gm
        const headings: HeadingItem[] = []
        let match

        // 为不同级别的标题维护计数器
        const counters: { [level: number]: number } = {}

        while ((match = headingRegex.exec(markdown)) !== null) {
            const level = match[1].length // 标题级别 (# 的数量)
            const text = match[2].trim()

            // 更新当前级别的计数器
            if (!counters[level]) {
                counters[level] = 0
            }
            counters[level]++

            // 生成基于数字的ID
            const id = `heading-${headings.length + 1}`

            headings.push({
                id,
                text,
                level,
                index: headings.length + 1
            })
        }

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
            const headingElements = headings
                .map(h => ({
                    id: h.id,
                    element: document.getElementById(h.id)
                }))
                .filter(item => item.element !== null)

            // 找到当前视窗中的标题
            for (let i = 0; i < headingElements.length; i++) {
                const { id, element } = headingElements[i]
                if (!element) continue

                const rect = element.getBoundingClientRect()
                // 在标题进入视窗顶部加上导航栏高度的范围内时激活
                if (rect.top >= 0 && rect.top <= 150 + NAVBAR_HEIGHT_OFFSET) {
                    if (activeHeading !== id) {
                        setActiveHeading(id)
                        // 更新URL而不引起页面跳转
                        window.history.replaceState(null, '', `#${id}`)
                    }
                    return
                }
            }

            // 如果没有标题在视窗中，选择最接近顶部的标题
            if (headingElements.length > 0) {
                const closestHeading = headingElements.reduce((prev, curr) => {
                    if (!curr.element) return prev
                    const prevRect = prev.element?.getBoundingClientRect()
                    const currRect = curr.element.getBoundingClientRect()
                    if (!prevRect) return curr
                    return Math.abs(currRect.top) < Math.abs(prevRect.top) ? curr : prev
                })
                if (activeHeading !== closestHeading.id) {
                    setActiveHeading(closestHeading.id)
                    // 更新URL而不引起页面跳转
                    window.history.replaceState(null, '', `#${closestHeading.id}`)
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // 初始检查

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

    // 辅助函数：为标题创建固定格式的ID（heading-1, heading-2, ...）
    const createHeadingId = (index: number): string => {
        return `heading-${index}`
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
                            // 使用序号创建标题ID
                            h1: ({ node, ...props }) => {
                                const headingIndex = headings.findIndex(h => h.text === String(props.children))
                                const id = headingIndex >= 0 ? headings[headingIndex].id : createHeadingId(1)
                                return <h1 id={id} {...props} />
                            },
                            h2: ({ node, ...props }) => {
                                const headingIndex = headings.findIndex(h => h.text === String(props.children))
                                const id = headingIndex >= 0 ? headings[headingIndex].id : createHeadingId(1)
                                return <h2 id={id} {...props} />
                            },
                            h3: ({ node, ...props }) => {
                                const headingIndex = headings.findIndex(h => h.text === String(props.children))
                                const id = headingIndex >= 0 ? headings[headingIndex].id : createHeadingId(1)
                                return <h3 id={id} {...props} />
                            },
                            h4: ({ node, ...props }) => {
                                const headingIndex = headings.findIndex(h => h.text === String(props.children))
                                const id = headingIndex >= 0 ? headings[headingIndex].id : createHeadingId(1)
                                return <h4 id={id} {...props} />
                            },
                            h5: ({ node, ...props }) => {
                                const headingIndex = headings.findIndex(h => h.text === String(props.children))
                                const id = headingIndex >= 0 ? headings[headingIndex].id : createHeadingId(1)
                                return <h5 id={id} {...props} />
                            },
                            h6: ({ node, ...props }) => {
                                const headingIndex = headings.findIndex(h => h.text === String(props.children))
                                const id = headingIndex >= 0 ? headings[headingIndex].id : createHeadingId(1)
                                return <h6 id={id} {...props} />
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
