import { FC } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePosts } from '@/hooks/usePosts'
import { ArticleShow } from '@/components/blog/ArticleShow'

export const SearchResults: FC = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''

    const { posts, isLoading } = usePosts({
        search: query.trim() || undefined,
        pageSize: 30
    })

    return (
        <ArticleShow
            title={`搜索结果: ${query}`}
            results={posts}
            isLoading={isLoading}
            emptyMessage={{
                title: `没有找到与 "${query}" 相关的结果`,
                suggestion: '请尝试使用其他关键词'
            }}
        />
    )
}
