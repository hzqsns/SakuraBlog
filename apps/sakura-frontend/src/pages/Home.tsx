import { FC, useState, useEffect } from 'react'
import { PostList } from '@/components/blog/PostList'
import { usePosts } from '@/hooks/usePosts'

const ITEMS_PER_PAGE = 6

export const Home: FC = () => {
    const { posts, total, isLoading, isLoadingMore, hasMore, loadMore } = usePosts({
        pageSize: ITEMS_PER_PAGE
    })

    const [isLoaded, setIsLoaded] = useState(false)

    // 初次加载完成后设置动画状态
    useEffect(() => {
        if (!isLoading && posts.length > 0) {
            setTimeout(() => setIsLoaded(true), 100)
        }
    }, [isLoading, posts.length])

    if (isLoading && !isLoaded) {
        return (
            <div className="space-y-8">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        <div className="flex gap-2 mt-4">
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div
            className={`space-y-8 transform transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
            {/* 显示文章总数 */}
            {total > 0 && (
                <div className="text-center text-gray-600 text-sm">
                    共 {total} 篇文章，已显示 {posts.length} 篇
                </div>
            )}

            <PostList posts={posts} hasMore={hasMore} onLoadMore={loadMore} isLoadingMore={isLoadingMore} />
        </div>
    )
}
