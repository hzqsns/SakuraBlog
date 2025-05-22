import { FC, useEffect, useState } from 'react'
import { PostList } from '@/components/blog/PostList'
import { loadAllPapers } from '@/utils/loadPapers'
import { Paper } from '@/types/markdown'

// 每页显示的文章数量
const ITEMS_PER_PAGE = 5

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
    const [allPapers, setAllPapers] = useState<Paper[]>([])
    const [displayedPapers, setDisplayedPapers] = useState<Paper[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // 加载所有文章
    useEffect(() => {
        const fetchPapers = async () => {
            setIsLoading(true)
            try {
                const papers = await loadAllPapers()
                setAllPapers(papers)

                // 初始只加载第一页文章
                const initialPapers = papers.slice(0, ITEMS_PER_PAGE)
                setDisplayedPapers(initialPapers)

                // 判断是否还有更多文章
                setHasMore(papers.length > ITEMS_PER_PAGE)

                // 添加短暂延迟以便过渡动画更加平滑
                setTimeout(() => {
                    setIsLoaded(true)
                    setIsLoading(false)
                }, 100)
            } catch (error) {
                console.error('Error loading papers:', error)
                setIsLoading(false)
            }
        }

        fetchPapers()
    }, [])

    // 加载更多文章
    const loadMore = () => {
        const nextPage = currentPage + 1
        const nextPageItems = allPapers.slice(0, nextPage * ITEMS_PER_PAGE)

        setDisplayedPapers(nextPageItems)
        setCurrentPage(nextPage)

        // 判断是否还有更多文章
        setHasMore(nextPageItems.length < allPapers.length)
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
            <PostList posts={displayedPapers.map(adaptPaperToPost)} hasMore={hasMore} onLoadMore={loadMore} />
        </div>
    )
}
