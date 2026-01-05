import { FC, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePosts, useCategories, useTags } from '@/hooks/usePosts'
import { formatDate, getPostUrl } from '@/lib/utils'
import { Calendar, FolderOpen, Tag as TagIcon, FileText } from 'lucide-react'
import type { Post } from '@/types'

export const Archive: FC = () => {
    // 获取所有已发布文章
    const { posts, total, isLoading: isLoadingPosts } = usePosts({ pageSize: 200 })
    const { categories, isLoading: isLoadingCategories } = useCategories()
    const { tags, isLoading: isLoadingTags } = useTags()

    const isLoading = isLoadingPosts || isLoadingCategories || isLoadingTags

    // 按年月分组文章
    const groupedPosts = useMemo(() => {
        const groups: Record<string, Post[]> = {}

        posts.forEach(post => {
            const date = new Date(post.publish_date || post.created_at)
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(post)
        })

        // 按时间降序排列
        return Object.entries(groups)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([key, posts]) => {
                const [year, month] = key.split('-')
                return {
                    year,
                    month,
                    label: `${year}年${parseInt(month)}月`,
                    posts: posts.sort((a, b) => {
                        const dateA = new Date(a.publish_date || a.created_at).getTime()
                        const dateB = new Date(b.publish_date || b.created_at).getTime()
                        return dateB - dateA
                    })
                }
            })
    }, [posts])

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* 页面标题 */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">文章归档</h1>
                <p className="text-gray-500">共 {total} 篇文章</p>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">{total}</div>
                        <div className="text-sm text-gray-500">篇文章</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <FolderOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">{categories.length}</div>
                        <div className="text-sm text-gray-500">个分类</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <TagIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">{tags.length}</div>
                        <div className="text-sm text-gray-500">个标签</div>
                    </div>
                </div>
            </div>

            {/* 分类列表 */}
            {categories.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FolderOpen className="w-5 h-5 mr-2 text-gray-500" />
                        分类
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <span
                                key={category.id}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                                style={{ borderLeft: `3px solid ${category.color || '#3B82F6'}` }}
                            >
                                {category.name}
                                {category.post_count !== undefined && (
                                    <span className="ml-1 text-gray-400">({category.post_count})</span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 标签云 */}
            {tags.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <TagIcon className="w-5 h-5 mr-2 text-gray-500" />
                        标签
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <Link
                                key={tag.id}
                                to={`/tag/${encodeURIComponent(tag.name)}`}
                                className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm hover:bg-purple-100 transition-colors"
                            >
                                #{tag.name}
                                {tag.post_count !== undefined && (
                                    <span className="ml-1 text-purple-400">({tag.post_count})</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* 时间线 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    时间线
                </h2>

                <div className="space-y-6">
                    {groupedPosts.map(group => (
                        <div key={`${group.year}-${group.month}`} className="relative pl-6 border-l-2 border-gray-200">
                            {/* 时间标签 */}
                            <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-700 mb-3">{group.label}</h3>

                            <ul className="space-y-2">
                                {group.posts.map(post => (
                                    <li key={post.id} className="flex items-start group">
                                        <span className="text-sm text-gray-400 min-w-[60px] mr-3">
                                            {formatDate(post.publish_date || post.created_at, 'MM-DD')}
                                        </span>
                                        <Link
                                            to={getPostUrl(post)}
                                            className="text-gray-700 hover:text-blue-600 transition-colors group-hover:underline flex-1 line-clamp-1"
                                        >
                                            {post.title}
                                        </Link>
                                        {post.category && (
                                            <span
                                                className="ml-2 px-2 py-0.5 text-xs rounded"
                                                style={{
                                                    backgroundColor: `${post.category.color || '#3B82F6'}20`,
                                                    color: post.category.color || '#3B82F6'
                                                }}
                                            >
                                                {post.category.name}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {groupedPosts.length === 0 && (
                    <div className="text-center py-10 text-gray-500">暂无文章</div>
                )}
            </div>
        </div>
    )
}
