import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService, categoryService, tagService, Post, Category, Tag, ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, Eye, Search, RefreshCw } from 'lucide-react'

export const Admin: FC = () => {
    const navigate = useNavigate()
    const [posts, setPosts] = useState<Post[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStatus, setSelectedStatus] = useState<string>('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [error, setError] = useState('')

    useEffect(() => {
        loadData()
    }, [currentPage, selectedStatus])

    const loadData = async () => {
        setIsLoading(true)
        setError('')
        try {
            const [postsResult, categoriesResult, tagsResult] = await Promise.all([
                postService.list({
                    page: currentPage,
                    page_size: 15,
                    status: selectedStatus || undefined,
                    search: searchQuery || undefined
                }),
                categoryService.list(),
                tagService.list()
            ])

            setPosts(postsResult.posts || [])
            setTotalPages(postsResult.total_pages)
            setTotal(postsResult.total)
            setCategories(categoriesResult || [])
            setTags(tagsResult || [])
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError('加载数据失败，请确保后端服务已启动')
            }
            console.error('Failed to load data:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = () => {
        setCurrentPage(1)
        loadData()
    }

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`确定要删除文章「${title}」吗？`)) {
            return
        }

        try {
            await postService.delete(id)
            loadData()
        } catch (err) {
            if (err instanceof ApiError) {
                alert(err.message)
            }
        }
    }

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-'
        return new Date(dateStr).toLocaleDateString('zh-CN')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* 顶部导航 */}
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-slate-800">📝 文章管理</h1>
                        <span className="text-sm text-slate-500">共 {total} 篇文章</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/')}
                        >
                            返回首页
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => navigate('/admin/editor')}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            写文章
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* 错误提示 */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={loadData}
                            className="ml-4 text-red-600"
                        >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            重试
                        </Button>
                    </div>
                )}

                {/* 筛选栏 */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <Input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="搜索文章标题..."
                                className="max-w-xs"
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            />
                            <Button variant="outline" size="sm" onClick={handleSearch}>
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>

                        <select
                            value={selectedStatus}
                            onChange={e => {
                                setSelectedStatus(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">全部状态</option>
                            <option value="published">已发布</option>
                            <option value="draft">草稿</option>
                        </select>

                        <Button variant="outline" size="sm" onClick={loadData}>
                            <RefreshCw className="w-4 h-4 mr-1" />
                            刷新
                        </Button>
                    </div>
                </div>

                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="text-2xl font-bold text-blue-600">{total}</div>
                        <div className="text-sm text-slate-500">文章总数</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="text-2xl font-bold text-green-600">{categories.length}</div>
                        <div className="text-sm text-slate-500">分类数量</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="text-2xl font-bold text-purple-600">{tags.length}</div>
                        <div className="text-sm text-slate-500">标签数量</div>
                    </div>
                </div>

                {/* 文章列表 */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">
                            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                            加载中...
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            暂无文章
                            <Button
                                size="sm"
                                onClick={() => navigate('/admin/editor')}
                                className="ml-4 bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                写第一篇文章
                            </Button>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">标题</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 hidden md:table-cell">分类</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 hidden lg:table-cell">状态</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 hidden lg:table-cell">浏览</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 hidden md:table-cell">日期</th>
                                    <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {posts.map(post => (
                                    <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-800 line-clamp-1">{post.title}</div>
                                            <div className="text-xs text-slate-400 mt-1 hidden sm:block">
                                                {post.reading_time} · {post.word_count} 字
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                                {post.category?.name || '未分类'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    post.status === 'published'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-yellow-100 text-yellow-600'
                                                }`}
                                            >
                                                {post.status === 'published' ? '已发布' : '草稿'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-500 hidden lg:table-cell">
                                            {post.view_count}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">
                                            {formatDate(post.publish_date)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(`/post/${post.slug}`, '_blank')}
                                                    title="查看"
                                                >
                                                    <Eye className="w-4 h-4 text-slate-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/admin/editor/${post.id}`)}
                                                    title="编辑"
                                                >
                                                    <Edit className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(post.id, post.title)}
                                                    title="删除"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* 分页 */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
                            <div className="text-sm text-slate-500">
                                第 {currentPage} / {totalPages} 页
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    上一页
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    下一页
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}




