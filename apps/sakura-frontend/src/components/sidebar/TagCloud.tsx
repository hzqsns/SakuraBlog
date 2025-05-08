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

    // 根据标签出现次数计算字体大小
    const getFontSize = (count: number) => {
        const min = 0.85
        const max = 1.5
        const maxCount = Math.max(...tags.map(t => t.count))
        const minCount = Math.min(...tags.map(t => t.count))

        if (maxCount === minCount) return 1

        // 线性映射标签计数到字体大小范围
        return min + ((count - minCount) / (maxCount - minCount)) * (max - min)
    }

    // 随机生成标签颜色
    const getTagColor = (tag: string) => {
        // 使用标签名称的哈希生成颜色，保证相同标签有相同颜色
        const hash = tag.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc)
        }, 0)

        const colors = [
            'text-blue-500 hover:text-blue-600',
            'text-green-500 hover:text-green-600',
            'text-purple-500 hover:text-purple-600',
            'text-red-500 hover:text-red-600',
            'text-indigo-500 hover:text-indigo-600',
            'text-pink-500 hover:text-pink-600',
            'text-yellow-600 hover:text-yellow-700',
            'text-teal-500 hover:text-teal-600'
        ]

        return colors[Math.abs(hash) % colors.length]
    }

    if (tags.length === 0) {
        return null
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 pb-2 border-b">标签云</h3>

            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span
                        key={tag.name}
                        onClick={() => navigate(`/tag/${encodeURIComponent(tag.name)}`)}
                        className={`cursor-pointer transition-all duration-300 hover:underline ${getTagColor(tag.name)}`}
                        style={{ fontSize: `${getFontSize(tag.count)}rem` }}
                    >
                        {tag.name}
                        <sup className="ml-0.5 text-xs text-gray-500">({tag.count})</sup>
                    </span>
                ))}
            </div>
        </div>
    )
}
