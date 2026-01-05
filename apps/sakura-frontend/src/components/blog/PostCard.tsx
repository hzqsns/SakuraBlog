import { FC } from 'react'
import { Post } from '@/types'
import { formatDate, getPostUrl } from '@/lib/utils'
import { Link, useNavigate } from 'react-router-dom'
import { useImageColor } from '@/hooks/useImageColor'
import './PostList.less'

interface PostCardProps {
    post: Post
    isEven?: boolean
}

export const PostCard: FC<PostCardProps> = ({ post, isEven = true }) => {
    const navigate = useNavigate()
    const colorData = useImageColor(post.cover_image)

    // 使用 API 返回的 reading_time，或计算阅读时间
    const readTime = post.reading_time || `${Math.max(1, Math.ceil(post.word_count / 300))}分钟`

    // 使用工具函数生成URL
    const postUrl = getPostUrl(post)

    const handleTagClick = (e: React.MouseEvent, tagName: string) => {
        e.preventDefault()
        e.stopPropagation()
        navigate(`/tag/${encodeURIComponent(tagName)}`)
    }

    // 获取标签名称列表
    const tagNames = post.tags?.map(tag => tag.name) || []

    // 左图右文/左文右图布局组件
    const LeftImageLayout = () => (
        <div
            className="flex flex-row overflow-hidden rounded-lg min-h-[280px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative"
            style={
                colorData
                    ? {
                          background: colorData.gradientStyle.split(';')[0].replace('background: ', ''),
                          backdropFilter: 'blur(24px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(24px) saturate(180%)'
                      }
                    : {
                          background: 'rgba(15, 15, 20, 0.8)',
                          backdropFilter: 'blur(24px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(24px) saturate(180%)'
                      }
            }
        >
            {/* 顶部高亮线条 */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-lg"></div>
            {/* 左侧图片区域 */}
            <div className="relative w-[38%] overflow-hidden">
                <div className="relative img-container h-full">
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={e => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = 'https://picsum.photos/800/600?random=6'
                        }}
                    />
                </div>
            </div>

            {/* 右侧内容区域 */}
            <div className="flex-1 p-6 text-white flex flex-col justify-between">
                <PostContent />
            </div>
        </div>
    )

    const RightImageLayout = () => (
        <div
            className="flex flex-row-reverse overflow-hidden rounded-lg min-h-[280px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative"
            style={
                colorData
                    ? {
                          background: colorData.gradientStyle.split(';')[0].replace('background: ', ''),
                          backdropFilter: 'blur(24px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(24px) saturate(180%)'
                      }
                    : {
                          background: 'rgba(15, 15, 20, 0.8)',
                          backdropFilter: 'blur(24px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(24px) saturate(180%)'
                      }
            }
        >
            {/* 顶部高亮线条 */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-lg"></div>
            {/* 右侧图片区域 */}
            <div className="relative w-[38%] overflow-hidden">
                <div className="relative img-container h-full">
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={e => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = 'https://picsum.photos/800/600?random=3'
                        }}
                    />
                </div>
            </div>

            {/* 左侧内容区域 */}
            <div className="flex-1 p-6 text-white flex flex-col justify-between">
                <PostContent />
            </div>
        </div>
    )

    // 内容组件
    const PostContent = () => (
        <div className="flex flex-col h-full">
            {/* 上半部分 - 标题和顶部信息 */}
            <div className="flex-1">
                {/* 顶部信息栏 */}
                <div className="flex justify-between items-center mb-3">
                    {/* 日期 */}
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z"
                            ></path>
                        </svg>
                        <span>{formatDate(post.publish_date || post.created_at, 'YYYY年MM月DD日')}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* 字数统计 */}
                        <span className="text-gray-300 text-sm">共{post.word_count}字</span>

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
                            <span>{readTime}</span>
                        </div>
                    </div>
                </div>

                {/* 标题 */}
                <h2 className="text-2xl font-bold mb-4 text-white transition-colors duration-300 hover:text-blue-200">{post.title}</h2>

                {/* 内容摘要 */}
                {post.excerpt && <p className="text-gray-200 line-clamp-3 mb-4">{post.excerpt}</p>}
            </div>

            {/* 下半部分 - 标签和阅读更多 */}
            <div>
                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tagNames.map((tagName, index) => (
                        <span
                            key={`${post.id}-${tagName}-${index}`}
                            className="px-3 py-1 bg-white/20 text-white rounded-full text-sm transition-colors duration-300 hover:bg-white/30 hover:text-white cursor-pointer backdrop-blur-sm"
                            onClick={e => handleTagClick(e, tagName)}
                        >
                            {tagName}
                        </span>
                    ))}
                </div>

                {/* 阅读更多 */}
                <div className="text-gray-300 font-medium flex items-center opacity-80 hover:opacity-100 transition-opacity duration-300">
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
            </div>
        </div>
    )

    return (
        <Link to={postUrl} className="block group">
            <div className="post-card-hover rounded-lg overflow-hidden">{isEven ? <LeftImageLayout /> : <RightImageLayout />}</div>
        </Link>
    )
}
