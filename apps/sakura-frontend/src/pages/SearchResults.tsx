import { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PostList } from '@/components/blog/PostList'
import { Post } from '@/types'
import { mockPosts } from '@/lib/mockData'

export const SearchResults: FC = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    const [results, setResults] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)

        // 模拟搜索请求
        const timer = setTimeout(() => {
            const searchResults = mockPosts.filter(post => {
                const searchableContent = [post.title, post.content, post.excerpt, post.author, ...(post.tags || []), post.category]
                    .join(' ')
                    .toLowerCase()

                return searchableContent.includes(query.toLowerCase())
            })

            setResults(searchResults)
            setIsLoading(false)
        }, 500) // 模拟加载延迟

        return () => clearTimeout(timer)
    }, [query])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-gray-800"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b">
                <h1 className="text-2xl font-bold">搜索结果: {query}</h1>
                <p className="text-gray-500 mt-2">找到 {results.length} 个结果</p>
            </div>

            {results.length > 0 ? (
                <PostList posts={results} />
            ) : (
                <div className="py-10 text-center">
                    <p className="text-lg text-gray-500">没有找到与 "{query}" 相关的结果</p>
                    <p className="mt-2 text-gray-400">请尝试使用其他关键词</p>
                </div>
            )}
        </div>
    )
}
