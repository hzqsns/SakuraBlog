import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllTags } from '@/utils/loadPapers'

interface TagCount {
    name: string
    count: number
}

export const TagCloud: FC = () => {
    const [tags, setTags] = useState<TagCount[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // 异步加载所有标签
        const fetchTags = async () => {
            setLoading(true)
            try {
                const allTags = await getAllTags()
                setTags(allTags)
            } catch (error) {
                console.error('Error loading tags:', error)
                setTags([])
            } finally {
                setLoading(false)
            }
        }

        fetchTags()
    }, [])

    // 随机生成标签背景颜色
    const getTagBgClass = (tag: string) => {
        // 使用标签名称的哈希生成颜色，保证相同标签有相同颜色
        const hash = tag.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc)
        }, 0)

        const bgClasses = [
            'bg-blue-100 hover:bg-blue-200 text-blue-800',
            'bg-green-100 hover:bg-green-200 text-green-800',
            'bg-indigo-100 hover:bg-indigo-200 text-indigo-800',
            'bg-purple-100 hover:bg-purple-200 text-purple-800',
            'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
            'bg-pink-100 hover:bg-pink-200 text-pink-800',
            'bg-gray-100 hover:bg-gray-200 text-gray-800',
            'bg-teal-100 hover:bg-teal-200 text-teal-800',
            'bg-red-100 hover:bg-red-200 text-red-800',
            'bg-orange-100 hover:bg-orange-200 text-orange-800'
        ]

        return bgClasses[Math.abs(hash) % bgClasses.length]
    }

    // 标签图标 SVG
    const TagIcon = () => (
        <svg
            className="w-3.5 h-3.5 mr-1 inline-block"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
    )

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="flex flex-wrap gap-2">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 rounded-full w-16"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (tags.length === 0) {
        return null
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                <TagIcon />
                <h3 className="text-lg font-bold">标签</h3>
            </div>

            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <button
                        key={tag.name}
                        onClick={() => navigate(`/tag/${encodeURIComponent(tag.name)}`)}
                        className={`
                            flex items-center rounded-full px-3 py-1.5 text-xs font-medium
                            transition-all duration-200 mb-1
                            cursor-pointer
                            hover:shadow-md hover:scale-105
                            active:scale-95 active:shadow-sm
                            ${getTagBgClass(tag.name)}
                        `}
                    >
                        <span className="mr-1">#</span>
                        {tag.name}
                    </button>
                ))}
            </div>
        </div>
    )
}
