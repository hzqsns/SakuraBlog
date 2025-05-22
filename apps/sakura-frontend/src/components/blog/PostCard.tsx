import { FC } from 'react'
import { Post } from '@/types'
import { formatDate, getPostUrl } from '@/lib/utils'
import { Link, useNavigate } from 'react-router-dom'
import './PostList.less'

interface PostCardProps {
    post: Post
    isEven?: boolean
}

export const PostCard: FC<PostCardProps> = ({ post, isEven = true }) => {
    const navigate = useNavigate()

    // 计算阅读时间，假设一分钟可以阅读300个字
    const readTime = Math.max(1, Math.ceil(post.content.length / 300))

    // 使用工具函数生成URL
    const postUrl = getPostUrl(post)

    const handleTagClick = (e: React.MouseEvent, tag: string) => {
        e.preventDefault()
        e.stopPropagation()
        navigate(`/tag/${encodeURIComponent(tag)}`)
    }

    // 左图右文/左文右图布局组件
    const LeftImageLayout = () => (
        <div className="flex flex-row overflow-hidden alternate-layout-even rounded-lg">
            {/* 左侧图片区域 */}
            <div className="relative w-[38%] overflow-hidden">
                <div style={{ paddingBottom: '75%' }} className="relative img-container">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={e => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = 'https://via.placeholder.com/800x600?text=Sakura'
                        }}
                    />
                </div>
            </div>

            {/* 右侧内容区域 */}
            <div className="flex-1 p-6 text-white">
                <PostContent />
            </div>
        </div>
    )

    const RightImageLayout = () => (
        <div className="flex flex-row-reverse overflow-hidden alternate-layout-odd rounded-lg">
            {/* 右侧图片区域 */}
            <div className="relative w-[38%] overflow-hidden">
                <div style={{ paddingBottom: '75%' }} className="relative img-container">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={e => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = 'https://via.placeholder.com/800x600?text=Sakura'
                        }}
                    />
                </div>
            </div>

            {/* 左侧内容区域 */}
            <div className="flex-1 p-6 text-white">
                <PostContent />
            </div>
        </div>
    )

    // 内容组件
    const PostContent = () => (
        <>
            {/* 顶部信息栏 */}
            <div className="flex justify-between items-center mb-3">
                {/* 日期 */}
                <div className="flex items-center text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                    </svg>
                    <span>{formatDate(post.publishDate, 'YYYY年MM月DD日')}</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* 字数统计 */}
                    <span className="text-gray-300 text-sm">共{post.content.length}字</span>

                    {/* 阅读时间 */}
                    <div className="flex items-center text-gray-300 text-sm">
                        <svg
                            className="w-5 h-5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <span>约{readTime}分钟</span>
                    </div>
                </div>
            </div>

            {/* 标题 */}
            <h2 className="text-2xl font-bold mb-4 text-white transition-colors duration-300 hover:text-blue-200">{post.title}</h2>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                    <span
                        key={`${post.id}-${tag}-${index}`}
                        className="px-3 py-1 bg-gray-600 rounded-full text-sm transition-colors duration-300 hover:bg-gray-500 hover:text-white cursor-pointer"
                        onClick={e => handleTagClick(e, tag)}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* 内容摘要 */}
            <p className="text-gray-300 line-clamp-2">{post.excerpt || post.content.substring(0, 150)}</p>

            {/* 阅读更多 */}
            <div className="mt-4 text-gray-300 font-medium flex items-center opacity-80 hover:opacity-100 transition-opacity duration-300">
                阅读更多
                <svg
                    className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
            </div>
        </>
    )

    return (
        <Link to={postUrl} className="block group">
            <div className="post-card-hover rounded-lg overflow-hidden">{isEven ? <LeftImageLayout /> : <RightImageLayout />}</div>
        </Link>
    )
}
