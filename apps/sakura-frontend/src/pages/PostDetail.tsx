import { FC, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { mockPosts } from '@/lib/mockData'
import { Post } from '@/types'
import { CalendarIcon, Clock, BookOpen, Hash } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Catalogue } from '@/components/blog/Catalogue'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Waline } from '@/components/comment'

// 扩展Post类型以满足组件需求
interface ExtendedPost extends Post {
    readingTime?: string
    wordCount?: string | number
}

// 扩展标题项类型，包含层级信息
interface HeadingItem {
    id: string
    text: string
    level: number
}

export const PostDetail: FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const [post, setPost] = useState<ExtendedPost | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [activeHeading, setActiveHeading] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) return

        // 尝试多种方式查找文章
        let foundPost = mockPosts.find(p => p.slug === slug) // 精确匹配

        // 如果没找到，尝试不区分大小写的匹配
        if (!foundPost) {
            foundPost = mockPosts.find(p => p.slug?.toLowerCase() === slug.toLowerCase())
        }

        // 如果还是没找到，尝试通过ID查找
        if (!foundPost && !isNaN(Number(slug))) {
            const numId = Number(slug)
            // 使用类型断言避免类型错误
            foundPost = mockPosts.find(p => String(p.id) === String(numId))
        }

        if (foundPost) {
            // 计算额外的字段
            const extendedPost: ExtendedPost = {
                ...foundPost,
                // 计算阅读时间 (按照300字/分钟计算)
                readingTime: `${Math.max(1, Math.ceil((foundPost.content?.length || 0) / 300))} min read`,
                // 计算字数
                wordCount: foundPost.content?.length || 0
            }
            setPost(extendedPost)
        }

        // 提取标题
        if (foundPost && foundPost.content) {
            // 内容已加载，可以提取标题
            setIsLoaded(true)
        }
    }, [slug])

    // 提取markdown文本中的标题作为目录
    const extractHeadings = useCallback((markdown: string): HeadingItem[] => {
        if (!markdown) return []

        // 使用正则表达式匹配Markdown标题行 (##开头)
        const headingRegex = /^(#{2,6})\s+(.+)$/gm
        const headings: HeadingItem[] = []
        let match

        while ((match = headingRegex.exec(markdown)) !== null) {
            const level = match[1].length // 标题级别 (# 的数量)
            const text = match[2].trim()
            const id = text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')

            headings.push({
                id,
                text,
                level
            })
        }

        return headings
    }, [])

    const headings = post?.content ? extractHeadings(post.content) : []

    // 平滑滚动到目标位置
    const scrollToHeading = useCallback((id: string) => {
        const element = document.getElementById(id)
        if (element) {
            // 使用scrollIntoView实现平滑滚动
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // 确保标题在视窗顶部
            })
            setActiveHeading(id)
        }
    }, [])

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
                // 在标题进入视窗顶部150px范围内时激活
                if (rect.top >= 0 && rect.top <= 150) {
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
    }, [isLoaded, headings, activeHeading])

    if (!post) {
        return <div className="container mx-auto px-4 py-8">文章不存在</div>
    }

    // 辅助函数：创建ID
    const createIdFromText = (text: string | React.ReactNode) => {
        return String(text)
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50">
            {/* 顶部图片和标题区域 */}
            <div className="relative mb-8">
                <div className="w-full h-[60vh] relative">
                    <img
                        src={
                            post.coverImage ||
                            'https://images.unsplash.com/photo-1505673542670-a5e3ff5b8310?q=80&w=1974&auto=format&fit=crop'
                        }
                        alt={post.title}
                        className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-end items-center text-center px-6 pb-10 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {post.tags?.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                                <Hash className="inline h-4 w-4 mr-1" />
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-white/90">
                        <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(post.publishDate || new Date())}
                        </span>
                        <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readingTime}
                        </span>
                        <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {post.wordCount} 字
                        </span>
                    </div>
                </div>
            </div>

            {/* 文章内容区域 */}
            <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-sm p-6">
                {/* 左侧目录和右侧文章内容并排 */}
                <Catalogue headings={headings} activeHeading={activeHeading} onHeadingClick={scrollToHeading} />

                <div className="flex-1 prose prose-lg max-w-full text-left" id="article-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ ...props }) => <h1 id={createIdFromText(props.children)} {...props} />,
                            h2: ({ ...props }) => <h2 id={createIdFromText(props.children)} {...props} />,
                            h3: ({ ...props }) => <h3 id={createIdFromText(props.children)} {...props} />,
                            h4: ({ ...props }) => <h4 id={createIdFromText(props.children)} {...props} />,
                            h5: ({ ...props }) => <h5 id={createIdFromText(props.children)} {...props} />,
                            h6: ({ ...props }) => <h6 id={createIdFromText(props.children)} {...props} />
                        }}
                    >
                        {post.content || ''}
                    </ReactMarkdown>
                </div>
            </div>

            {/* 评论 */}
            <div className="mt-12">
                <Waline
                    serverURL="https://waline-comment-eta-three.vercel.app/"
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
