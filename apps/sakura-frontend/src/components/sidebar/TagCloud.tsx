import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockPosts } from '@/lib/mockData'

interface TagCount {
    name: string
    count: number
}

export const TagCloud: FC = () => {
    const [tags, setTags] = useState<TagCount[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        // 统计所有标签及其出现次数
        const tagCounts: Record<string, number> = {}
        mockPosts.forEach(post => {
            post.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1
            })
        })

        // 转换为数组并排序
        const tagArray = Object.entries(tagCounts).map(([name, count]) => ({
            name,
            count
        }))

        // 按出现次数排序
        tagArray.sort((a, b) => b.count - a.count)

        setTags(tagArray)
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

    if (tags.length === 0) {
        return null
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                <TagIcon />
                <h3 className="text-lg font-bold">标签云</h3>
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
