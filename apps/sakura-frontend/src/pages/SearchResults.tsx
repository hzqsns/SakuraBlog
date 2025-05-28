import { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Paper } from '@/types/markdown'
import { searchPapers } from '@/utils/loadPapers'
import { ArticleShow } from '@/components/blog/ArticleShow'
import { Post } from '@/types'

// 将Paper类型转换为PostList组件所需的Post类型
const adaptPaperToPost = (paper: Paper): Post => ({
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
    const [results, setResults] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true)

            try {
                if (query.trim()) {
                    // 使用优化的搜索函数，限制返回30个结果
                    const searchResults = await searchPapers(query, 30)
                    setResults(searchResults.map(adaptPaperToPost))
                } else {
                    setResults([])
                }
            } catch (error) {
                console.error('Error searching papers:', error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [query])

    return (
        <ArticleShow
            title={`搜索结果: ${query}`}
            results={results}
            isLoading={isLoading}
            emptyMessage={{
                title: `没有找到与 "${query}" 相关的结果`,
                suggestion: '请尝试使用其他关键词'
            }}
        />
    )
}
