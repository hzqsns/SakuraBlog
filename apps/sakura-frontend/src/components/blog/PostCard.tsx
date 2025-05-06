import { FC } from 'react'
import { Post } from '@/types'
import { formatDate, getPostUrl } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface PostCardProps {
    post: Post
}

export const PostCard: FC<PostCardProps> = ({ post }) => {
    // 计算阅读时间，假设一分钟可以阅读300个字
    const readTime = Math.max(1, Math.ceil(post.content.length / 300))

    // 使用工具函数生成URL
    const postUrl = getPostUrl(post)

    return (
        <Link to={postUrl} className="block group">
            <div className="flex overflow-hidden rounded-lg transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                {/* 左侧缩略图 */}
                <div className="w-[28%] relative overflow-hidden">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="object-cover w-full h-full max-h-64 transition-transform duration-500 group-hover:scale-110"
                        onError={e => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = 'https://via.placeholder.com/800x600?text=Sakura'
                        }}
                    />
                    {/* 悬停时显示的渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* 右侧内容区域 */}
                <div className="flex-1 p-6 flex flex-col justify-between bg-gradient-to-r from-gray-700 to-gray-900 text-white relative overflow-hidden">
                    {/* 动态背景效果 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-700/10 to-gray-800/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-0"></div>

                    {/* 内容层 */}
                    <div className="relative z-10">
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
                        <h2 className="text-2xl font-bold mb-4 transition-all duration-300 group-hover:text-blue-200">{post.title}</h2>

                        {/* 标签 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-600 rounded-full text-sm transition-colors duration-300 hover:bg-blue-600 hover:text-white"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* 内容摘要 */}
                        <p className="text-gray-300 line-clamp-2 transition-all duration-300 group-hover:text-white">
                            {post.excerpt || post.content.substring(0, 150)}
                        </p>

                        {/* 阅读更多指示器，悬停时显示 */}
                        <div className="mt-4 text-blue-300 font-medium opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center">
                            阅读更多
                            <svg
                                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
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
            </div>
        </Link>
    )
}
 