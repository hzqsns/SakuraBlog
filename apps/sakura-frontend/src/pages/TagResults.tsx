import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PostList } from '@/components/blog/PostList'
import { Paper } from '@/types/markdown'
import { loadAllPapers } from '@/utils/loadPapers'

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

export const TagResults: FC = () => {
    const { tag } = useParams<{ tag: string }>()
    const decodedTag = tag ? decodeURIComponent(tag) : ''
    const [results, setResults] = useState<Paper[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTaggedPapers = async () => {
            setIsLoading(true)

            try {
                // 加载所有文章
                const allPapers = await loadAllPapers()

                // 过滤出包含指定标签的文章
                const taggedPapers = allPapers.filter(paper => paper.tags.some(t => t.toLowerCase() === decodedTag.toLowerCase()))

                setResults(taggedPapers)
            } catch (error) {
                console.error(`Error fetching papers with tag ${decodedTag}:`, error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTaggedPapers()
    }, [decodedTag])

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
                <h1 className="text-2xl font-bold">标签: {decodedTag}</h1>
                <p className="text-gray-500 mt-2">找到 {results.length} 篇文章</p>
            </div>

            {results.length > 0 ? (
                <PostList posts={results.map(adaptPaperToPost)} />
            ) : (
                <div className="py-10 text-center">
                    <p className="text-lg text-gray-500">没有找到标签为 "{decodedTag}" 的文章</p>
                    <p className="mt-2 text-gray-400">请尝试查看其他标签</p>
                </div>
            )}
        </div>
    )
}
