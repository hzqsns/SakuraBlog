import { FC, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { mockPosts } from '@/lib/mockData'
import { Post } from '@/types'
import { CalendarIcon, Clock, BookOpen, Hash } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const PostDetail: FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const [post, setPost] = useState<Post | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [activeHeading, setActiveHeading] = useState<string | null>(null)
    const tocRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!slug) return

        // 尝试多种方式查找文章
        let foundPost = mockPosts.find(p => p.slug === slug) // 精确匹配

        // 如果没找到，尝试不区分大小写的匹配
        if (!foundPost) {
            foundPost = mockPosts.find(p => p.slug?.toLowerCase() === slug.toLowerCase())
        }

        // 如果还没找到，尝试通过ID查找
        if (!foundPost) {
            foundPost = mockPosts.find(p => p.id === slug)
        }

        // 如果还没找到，尝试ID-slug组合方式
        if (!foundPost && slug.includes('-')) {
            const idPart = slug.split('-')[0]
            foundPost = mockPosts.find(p => p.id === idPart)
        }

        setPost(foundPost || null)

        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 300)

        return () => clearTimeout(timer)
    }, [slug])

    // 目录跟随滚动效果和当前阅读位置高亮
    useEffect(() => {
        if (!post) return

        // 获取所有标题元素
        const headingElements = Array.from(document.querySelectorAll('[id^="heading-"]'))
        if (headingElements.length === 0) return

        // 监听滚动，更新当前阅读位置
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150 // 偏移量，使标题提前高亮

            // 找到当前可见的标题
            for (let i = headingElements.length - 1; i >= 0; i--) {
                const element = headingElements[i] as HTMLElement
                if (element.offsetTop <= scrollPosition) {
                    setActiveHeading(element.id)
                    break
                }
            }

            // 如果已经滚动到顶部，则清除激活状态
            if (scrollPosition <= 150) {
                setActiveHeading(null)
            }
        }

        // 初始化时执行一次
        handleScroll()

        // 添加滚动监听
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [post, isLoaded])

    if (!post) {
        return (
            <div className="py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">文章不存在</h2>
                <p className="text-gray-600">该文章可能已被删除或地址有误</p>
                <p className="text-sm text-gray-500 mt-2">请求的slug: {slug}</p>
            </div>
        )
    }

    // 计算阅读时间
    const readTime = Math.max(1, Math.ceil(post.content.length / 300))

    // 计算字数
    const wordCount = post.content.length

    // 解析Markdown标题
    const headings = post.content
        .split('\n')
        .filter(line => line.startsWith('###'))
        .map((line, index) => ({
            id: `heading-${index}`,
            text: line.replace(/^###\s+/, '').trim()
        }))

    // 格式化Markdown内容 (简单实现，实际应使用markdown解析库)
    const formattedContent = post.content
        .split('\n')
        .map((line, index) => {
            if (line.startsWith('### ')) {
                return `<h3 id="heading-${index}" class="text-xl font-bold mt-8 mb-4">${line.replace('### ', '')}</h3>`
            }
            if (line.startsWith('```')) {
                return '<pre class="bg-gray-800 text-white p-4 rounded-md my-4 overflow-x-auto">'
            }
            if (line.startsWith('`') && line.endsWith('`')) {
                return `<code class="bg-gray-100 px-1 rounded">${line.slice(1, -1)}</code>`
            }
            if (line.trim() === '') {
                return '<br>'
            }
            if (line.startsWith('- ')) {
                return `<li class="ml-4 mb-2">${line.replace('- ', '')}</li>`
            }
            return `<p class="mb-4">${line}</p>`
        })
        .join('')

    // 目录点击时平滑滚动到对应位置
    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {/* 文章封面图和信息 */}
            <div className="relative h-80 mb-8 overflow-hidden">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={e => {
                        const target = e.target as HTMLImageElement
                        target.onerror = null
                        target.src = 'https://picsum.photos/1200/400?blur=3'
                    }}
                />

                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>

                {/* 居中的文章信息 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    {/* 标题 */}
                    <h1 className="text-4xl font-bold text-white mb-4 max-w-3xl">{post.title}</h1>

                    {/* 标签 */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {post.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm hover:bg-white/30 transition-colors cursor-pointer"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* 文章元信息 */}
                    <div className="flex items-center flex-wrap justify-center text-white/80 text-sm gap-4">
                        <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            <span>{formatDate(post.publishDate, 'YYYY年MM月DD日')}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>约{readTime}分钟</span>
                        </div>
                        <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            <span>{wordCount}字</span>
                        </div>
                        <div className="flex items-center">
                            <Hash className="w-4 h-4 mr-1" />
                            <span>{post.author}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 文章内容区域: 左侧目录 + 右侧正文 */}
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* 左侧目录 - 使用position: fixed在小屏幕上 */}
                    {headings.length > 0 && (
                        <div className="md:w-64 mb-6 md:mb-0">
                            <div
                                ref={tocRef}
                                className="hidden md:block md:sticky md:top-20 bg-white rounded-xl p-4 shadow-sm border border-gray-100 max-h-[calc(100vh-120px)] overflow-y-auto"
                                style={{ willChange: 'transform' }}
                            >
                                <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-100 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    目录
                                </h2>
                                <nav className="space-y-1">
                                    {headings.map(heading => (
                                        <button
                                            key={heading.id}
                                            onClick={() => scrollToHeading(heading.id)}
                                            className={`w-full text-left block py-2 px-3 rounded transition-colors ${
                                                activeHeading === heading.id
                                                    ? 'bg-purple-100 text-purple-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {heading.text}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* 移动端悬浮目录按钮 */}
                            <div className="md:hidden fixed bottom-6 right-6 z-30">
                                <button
                                    onClick={() => {
                                        const toc = document.getElementById('mobile-toc')
                                        if (toc) {
                                            toc.classList.toggle('translate-y-full')
                                        }
                                    }}
                                    className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                </button>
                            </div>

                            {/* 移动端目录抽屉 */}
                            <div
                                id="mobile-toc"
                                className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 shadow-lg border-t border-gray-200 max-h-[70vh] overflow-y-auto z-20 transform translate-y-full transition-transform duration-300"
                            >
                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                                    <h2 className="text-lg font-bold flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                        目录
                                    </h2>
                                    <button
                                        onClick={() => {
                                            const toc = document.getElementById('mobile-toc')
                                            if (toc) {
                                                toc.classList.add('translate-y-full')
                                            }
                                        }}
                                        className="text-gray-500"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <nav className="space-y-2">
                                    {headings.map(heading => (
                                        <button
                                            key={heading.id}
                                            onClick={() => {
                                                scrollToHeading(heading.id)
                                                const toc = document.getElementById('mobile-toc')
                                                if (toc) {
                                                    toc.classList.add('translate-y-full')
                                                }
                                            }}
                                            className={`w-full text-left block py-3 px-4 rounded transition-colors ${
                                                activeHeading === heading.id
                                                    ? 'bg-purple-100 text-purple-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {heading.text}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    )}

                    {/* 右侧文章内容 */}
                    <div className={`flex-1 ${headings.length === 0 ? 'max-w-4xl mx-auto' : ''}`}>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div
                                className="prose max-w-none prose-img:rounded-xl prose-headings:text-purple-800 prose-a:text-pink-600"
                                dangerouslySetInnerHTML={{ __html: formattedContent }}
                            />

                            {/* 文章底部信息 */}
                            <div className="mt-10 pt-6 border-t border-gray-100">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors cursor-pointer"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src="https://i.pravatar.cc/150?img=32"
                                            alt="作者头像"
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">{post.author}</div>
                                            <div className="text-sm text-gray-500">文章作者</div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200 transition-colors flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                            喜欢
                                        </button>
                                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                                            </svg>
                                            分享
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
