import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Paper } from '@/types/markdown'
import { loadAllPapers } from '@/utils/loadPapers'
import { ArticleShow } from '@/components/blog/ArticleShow'
import { Post } from '@/types'

// 将Paper类型转换为PostList组件所需的Post类型
const adaptPaperToPost = (paper: Paper): Post => ({
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

export const TagResults: FC = () => {
    const { tag } = useParams<{ tag: string }>()
    const decodedTag = tag ? decodeURIComponent(tag) : ''
    const [results, setResults] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTaggedPapers = async () => {
            setIsLoading(true)

            try {
                // 加载所有文章
                const allPapers = await loadAllPapers()

                // 过滤出包含指定标签的文章
                const taggedPapers = allPapers.filter(paper => paper.tags.some(t => t.toLowerCase() === decodedTag.toLowerCase()))

                setResults(taggedPapers.map(adaptPaperToPost))
            } catch (error) {
                console.error(`Error fetching papers with tag ${decodedTag}:`, error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTaggedPapers()
    }, [decodedTag])

    return (
        <ArticleShow
            title={`标签: ${decodedTag}`}
            results={results}
            isLoading={isLoading}
            emptyMessage={{
                title: `没有找到标签为 "${decodedTag}" 的文章`,
                suggestion: '请尝试查看其他标签'
            }}
        />
    )
}
