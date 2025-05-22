import { FC } from 'react'
import { Post } from '@/types'
import { PostCard } from './PostCard'
import './PostList.less'

interface PostListProps {
    posts: Post[]
    hasMore?: boolean
    onLoadMore?: () => void
}

export const PostList: FC<PostListProps> = ({ posts, hasMore = false, onLoadMore }) => {
    return (
        <div className="space-y-10">
            {posts.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">没有找到文章</p>
                </div>
            ) : (
                <>
                    <div className="bg-white bg-opacity-95 rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {posts.map((post, index) => (
                                <div key={post.id} className="p-4">
                                    <PostCard post={post} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {hasMore && onLoadMore && (
                        <div className="flex justify-center my-10">
                            <button
                                onClick={onLoadMore}
                                className="w-32 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-full hover:from-gray-800 hover:to-gray-900 transition-all duration-300 flex items-center justify-center focus:outline-none shadow-sm"
                                aria-label="加载更多内容"
                            >
                                <span className="font-normal text-sm">加载更多</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
