import { FC } from 'react'
import { Post } from '@/types'
import { PostCard } from './PostCard'
import './PostList.less'

interface PostListProps {
    posts: Post[]
    hasMore?: boolean
    onLoadMore?: () => void
    isLoadingMore?: boolean
}

export const PostList: FC<PostListProps> = ({ posts, hasMore = false, onLoadMore, isLoadingMore = false }) => {
    return (
        <div className="space-y-8">
            {posts.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">没有找到文章</p>
                </div>
            ) : (
                <>
                    <div className="bg-white bg-opacity-95 rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="flex flex-col gap-4 p-4">
                            {posts.map((post, index) => (
                                <div key={post.id} className="post-list-item">
                                    <PostCard post={post} isEven={index % 2 === 0} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 加载更多按钮或加载状态 */}
                    {(hasMore || isLoadingMore) && (
                        <div className="flex justify-center my-10">
                            {isLoadingMore ? (
                                <div className="px-8 py-3 bg-gradient-to-r from-purple-50 via-blue-50 to-white border-2 border-purple-200/60 text-purple-600 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                                    <span className="font-medium text-sm">加载中...</span>
                                </div>
                            ) : (
                                <button
                                    onClick={onLoadMore}
                                    className="group relative px-8 py-3 bg-gradient-to-r from-purple-50 via-blue-50 to-white border-2 border-purple-200/60 text-purple-600 rounded-full hover:from-purple-100 hover:via-blue-100 hover:to-purple-50 hover:border-purple-300/80 hover:text-purple-700 transition-all duration-300 flex items-center justify-center focus:outline-none shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
                                    aria-label="加载更多内容"
                                >
                                    {/* 可爱的背景光晕效果 */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-blue-200/20 to-purple-100/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* 按钮内容 */}
                                    <div className="relative flex items-center">
                                        <span className="font-medium text-sm mr-2">✨ 加载更多</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-y-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
