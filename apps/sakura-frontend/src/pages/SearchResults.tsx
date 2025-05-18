import { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PostList } from '@/components/blog/PostList'
import { Paper } from '@/types/markdown'
import { loadAllPapers } from '@/utils/loadPapers'

// 将Paper类型转换为PostList组件所需的Post类型
const adaptPaperToPost = (paper: Paper) => ({
    id: paper.slug, // 使用slug作为id
    title: paper.title,
    content: paper.content,
    excerpt: paper.excerpt,
    author: paper.author,
    publishDate: paper.publishDate,
    tags: paper.tags,
    category: paper.category[0] || '', // 取第一个分类
    coverImage: paper.coverImage,
    slug: paper.slug
})

export const SearchResults: FC = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    const [results, setResults] = useState<Paper[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true)

            try {
                // 加载所有文章
                const allPapers = await loadAllPapers()

                // 按照查询词过滤文章
                const searchResults = allPapers.filter(paper => {
                    const searchableContent = [paper.title, paper.content, paper.excerpt, paper.author, ...paper.tags, ...paper.category]
                        .join(' ')
                        .toLowerCase()

                    return searchableContent.includes(query.toLowerCase())
                })

                setResults(searchResults)
                setIsLoading(false)
            } catch (error) {
                console.error('Error searching papers:', error)
                setIsLoading(false)
            }
        }

        // 当查询字符串变化时执行搜索
        if (query) {
            fetchResults()
        } else {
            setResults([])
            setIsLoading(false)
        }
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
                <PostList posts={results.map(adaptPaperToPost)} />
            ) : (
                <div className="py-10 text-center">
                    <p className="text-lg text-gray-500">没有找到与 "{query}" 相关的结果</p>
                    <p className="mt-2 text-gray-400">请尝试使用其他关键词</p>
                </div>
            )}
        </div>
    )
}
