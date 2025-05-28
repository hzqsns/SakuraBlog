import { FC, useEffect, useState } from 'react'
import { PostList } from '@/components/blog/PostList'
import { loadPapersPaginated } from '@/utils/loadPapers'
import { Paper } from '@/types/markdown'

// 每页显示的文章数量
const ITEMS_PER_PAGE = 6

// 将Paper类型转换为PostList组件所需的Post类型
const adaptPaperToPost = (paper: Paper) => ({
    id: paper.slug,
    title: paper.title,
    content: paper.content,
    excerpt: paper.excerpt,
    author: paper.author,
    publishDate: paper.publishDate,
    tags: paper.tags,
    category: paper.category[0] || '',
    coverImage: paper.coverImage,
    slug: paper.slug
})

export const Home: FC = () => {
    const [papers, setPapers] = useState<Paper[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [totalCount, setTotalCount] = useState(0)

    // 初始加载第一页文章
    useEffect(() => {
        const fetchInitialPapers = async () => {
            setIsLoading(true)
            try {
                const result = await loadPapersPaginated(1, ITEMS_PER_PAGE)
                setPapers(result.papers)
                setHasMore(result.hasMore)
                setTotalCount(result.total)
                setCurrentPage(1)

                // 添加短暂延迟以便过渡动画更加平滑
                setTimeout(() => {
                    setIsLoaded(true)
                    setIsLoading(false)
                }, 100)
            } catch (error) {
                console.error('Error loading initial papers:', error)
                setIsLoading(false)
            }
        }

        fetchInitialPapers()
    }, [])

    // 加载更多文章
    const loadMore = async () => {
        if (isLoadingMore || !hasMore) return

        setIsLoadingMore(true)
        try {
            const nextPage = currentPage + 1
            const result = await loadPapersPaginated(nextPage, ITEMS_PER_PAGE)

            // 追加新的文章到现有列表
            setPapers(prevPapers => [...prevPapers, ...result.papers])
            setHasMore(result.hasMore)
            setCurrentPage(nextPage)
        } catch (error) {
            console.error('Error loading more papers:', error)
        } finally {
            setIsLoadingMore(false)
        }
    }

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
            {totalCount > 0 && (
                <div className="text-center text-gray-600 text-sm">
                    共 {totalCount} 篇文章，已显示 {papers.length} 篇
                </div>
            )}

            <PostList posts={papers.map(adaptPaperToPost)} hasMore={hasMore} onLoadMore={loadMore} isLoadingMore={isLoadingMore} />
        </div>
    )
}
