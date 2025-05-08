import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PostList } from '@/components/blog/PostList'
import { Post } from '@/types'
import { mockPosts } from '@/lib/mockData'

export const TagResults: FC = () => {
    const { tag } = useParams<{ tag: string }>()
    const decodedTag = tag ? decodeURIComponent(tag) : ''
    const [results, setResults] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)

        // 模拟获取带有特定标签的文章
        const timer = setTimeout(() => {
            const taggedPosts = mockPosts.filter(post => post.tags.some(t => t.toLowerCase() === decodedTag.toLowerCase()))

            setResults(taggedPosts)
            setIsLoading(false)
        }, 500) // 模拟加载延迟

        return () => clearTimeout(timer)
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
                <PostList posts={results} />
            ) : (
                <div className="py-10 text-center">
                    <p className="text-lg text-gray-500">没有找到标签为 "{decodedTag}" 的文章</p>
                    <p className="mt-2 text-gray-400">请尝试查看其他标签</p>
                </div>
            )}
        </div>
    )
}
