import { FC, useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePost } from '@/hooks/usePosts'
import { CalendarIcon, Clock, BookOpen, Hash } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Catalogue } from '@/components/blog/Catalogue'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Waline } from '@/components/comment'

// 扩展标题项类型
interface HeadingItem {
    id: string
    text: string
    level: number
    index?: number
}

export const PostDetail: FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const { post, isLoading, error } = usePost(slug)
    const [isLoaded, setIsLoaded] = useState(false)
    const [activeHeading, setActiveHeading] = useState<string | null>(null)

    const NAVBAR_HEIGHT_OFFSET = 80

    useEffect(() => {
        if (post && !isLoading) {
            setIsLoaded(true)
        }
    }, [post, isLoading])

    // 提取markdown中的标题
    const extractHeadings = useCallback((markdown: string): HeadingItem[] => {
        if (!markdown) return []

        const headings: HeadingItem[] = []
        let headingCounter = 0

        const createHeadingId = () => {
            headingCounter++
            return `heading-${headingCounter}`
        }

        // 匹配 Markdown 标题
        const markdownHeadingRegex = /^(#{1,6})\s+(.+)$/gm
        let match
        while ((match = markdownHeadingRegex.exec(markdown)) !== null) {
            headings.push({
                id: createHeadingId(),
                text: match[2].trim(),
                level: match[1].length,
                index: headings.length + 1
            })
        }

        // 匹配 HTML 标题
        const htmlHeadingRegex = /<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/gi
        while ((match = htmlHeadingRegex.exec(markdown)) !== null) {
            const text = match[2].trim()
            if (!headings.some(h => h.text === text)) {
                headings.push({
                    id: createHeadingId(),
                    text,
                    level: parseInt(match[1]),
                    index: headings.length + 1
                })
            }
        }

        return headings
    }, [])

    const headings = post?.content ? extractHeadings(post.content) : []

    // 滚动到标题
    const scrollToHeading = useCallback(
        (id: string) => {
            const element = document.getElementById(id)
            if (element) {
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                window.scrollTo({
                    top: elementPosition - NAVBAR_HEIGHT_OFFSET,
                    behavior: 'smooth'
                })
                setActiveHeading(id)
                window.history.replaceState(null, '', `#${id}`)
            }
        },
        [NAVBAR_HEIGHT_OFFSET]
    )

    // 监听滚动更新高亮
    useEffect(() => {
        if (!isLoaded || headings.length === 0) return

        const handleScroll = () => {
            const headingElements = headings
                .map(h => ({
                    id: h.id,
                    element: document.getElementById(h.id)
                }))
                .filter(item => item.element !== null)

            if (headingElements.length === 0) return

            const scrollTop = window.pageYOffset
            const threshold = NAVBAR_HEIGHT_OFFSET + 20

            let activeId = null
            for (let i = headingElements.length - 1; i >= 0; i--) {
                const heading = headingElements[i]
                if (!heading.element) continue
                if (scrollTop >= heading.element.offsetTop - threshold) {
                    activeId = heading.id
                    break
                }
            }

            if (!activeId && headingElements.length > 0) {
                activeId = headingElements[0].id
            }

            if (activeId && activeHeading !== activeId) {
                setActiveHeading(activeId)
            }
        }

        window.addEventListener('scroll', handleScroll)
        setTimeout(handleScroll, 100)

        return () => window.removeEventListener('scroll', handleScroll)
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
                    </div>
                </div>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="container mx-auto px-4 py-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">文章不存在</h1>
                <p className="text-gray-600">{error?.message || '未找到该文章'}</p>
                <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
                    返回首页
                </Link>
            </div>
        )
    }

    const tagNames = post.tags?.map(tag => tag.name) || []

    return (
        <div className="container mx-auto px-4 py-4 bg-gray-50">
            {/* 顶部图片和标题 */}
            <div className="relative mb-8">
                <div className="w-full h-[60vh] relative">
                    <img
                        src={
                            post.cover_image ||
                            'https://images.unsplash.com/photo-1505673542670-a5e3ff5b8310?q=80&w=1974&auto=format&fit=crop'
                        }
                        alt={post.title}
                        className="w-full h-full object-cover rounded-2xl article-cover-image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {tagNames.map(tagName => (
                            <Link
                                key={tagName}
                                to={`/tag/${encodeURIComponent(tagName)}`}
                                className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center"
                            >
                                <Hash className="h-4 w-4 mr-1" />
                                {tagName}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-white/90">
                        <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(post.publish_date || post.created_at)}
                        </span>
                        <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.reading_time || `${Math.ceil(post.word_count / 300)}分钟`}
                        </span>
                        <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {post.word_count} 字
                        </span>
                    </div>
                </div>
            </div>

            {/* 文章内容 */}
            <div className="flex flex-col md:flex-row gap-8">
                <Catalogue headings={headings} activeHeading={activeHeading} onHeadingClick={scrollToHeading} />

                <div
                    className="flex-1 bg-white rounded-xl shadow-sm p-6 prose prose-lg max-w-full text-left markdown-body break-words"
                    id="article-content"
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            h1: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading?.id || `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h1 id={id} {...props}>
                                        {children}
                                    </h1>
                                )
                            },
                            h2: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading?.id || `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h2 id={id} {...props}>
                                        {children}
                                    </h2>
                                )
                            },
                            h3: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading?.id || `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h3 id={id} {...props}>
                                        {children}
                                    </h3>
                                )
                            },
                            h4: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading?.id || `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h4 id={id} {...props}>
                                        {children}
                                    </h4>
                                )
                            },
                            h5: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading?.id || `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h5 id={id} {...props}>
                                        {children}
                                    </h5>
                                )
                            },
                            h6: ({ children, ...props }) => {
                                const text = String(children).trim()
                                const heading = headings.find(h => h.text === text)
                                const id = heading?.id || `heading-${Math.random().toString(36).substr(2, 9)}`
                                return (
                                    <h6 id={id} {...props}>
                                        {children}
                                    </h6>
                                )
                            }
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
                    path={`/post/${post.slug}`}
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
