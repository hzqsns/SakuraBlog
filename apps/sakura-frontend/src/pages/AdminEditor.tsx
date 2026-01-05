import { FC, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { postService, categoryService, tagService, Category, Tag, ApiError } from '@/lib/api'
import { Save, Eye, ArrowLeft, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const AdminEditor: FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const isEditing = !!id

    // 表单状态
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [content, setContent] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [categoryId, setCategoryId] = useState<number | undefined>()
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [newTag, setNewTag] = useState('')

    // 数据
    const [categories, setCategories] = useState<Category[]>([])
    const [existingTags, setExistingTags] = useState<Tag[]>([])

    // UI状态
    const [isPreview, setIsPreview] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        loadCategories()
        loadTags()

        if (isEditing) {
            loadPost()
        }
    }, [id])

    const loadCategories = async () => {
        try {
            const data = await categoryService.list()
            setCategories(data || [])
        } catch (error) {
            console.error('Failed to load categories:', error)
        }
    }

    const loadTags = async () => {
        try {
            const data = await tagService.list()
            setExistingTags(data || [])
        } catch (error) {
            console.error('Failed to load tags:', error)
        }
    }

    const loadPost = async () => {
        try {
            const post = await postService.getById(Number(id))
            setTitle(post.title)
            setSlug(post.slug || '')
            setContent(post.content)
            setExcerpt(post.excerpt || '')
            setCoverImage(post.cover_image || '')
            setCategoryId(post.category?.id)
            setSelectedTags(post.tags?.map(t => t.name) || [])
        } catch (error) {
            console.error('Failed to load post:', error)
            setError('加载文章失败')
        }
    }

    const handleAddTag = () => {
        if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
            setSelectedTags([...selectedTags, newTag.trim()])
            setNewTag('')
        }
    }

    const handleRemoveTag = (tag: string) => {
        setSelectedTags(selectedTags.filter(t => t !== tag))
    }

    const handleSelectExistingTag = (tagName: string) => {
        if (!selectedTags.includes(tagName)) {
            setSelectedTags([...selectedTags, tagName])
        }
    }

    const handleSave = async (status: 'draft' | 'published') => {
        if (!title.trim()) {
            setError('请输入文章标题')
            return
        }

        if (!content.trim()) {
            setError('请输入文章内容')
            return
        }

        const isSavingDraft = status === 'draft'
        isSavingDraft ? setIsSaving(true) : setIsPublishing(true)
        setError('')
        setSuccessMessage('')

        try {
            const postData = {
                title: title.trim(),
                slug: slug.trim() || undefined,
                content: content.trim(),
                excerpt: excerpt.trim() || undefined,
                cover_image: coverImage.trim() || undefined,
                status,
                category_id: categoryId,
                tag_names: selectedTags
            }

            if (isEditing) {
                await postService.update(Number(id), postData)
                setSuccessMessage(isSavingDraft ? '草稿已保存' : '文章已发布')
            } else {
                const newPost = await postService.create(postData)
                setSuccessMessage(isSavingDraft ? '草稿已保存' : '文章已发布')
                // 跳转到编辑页面
                navigate(`/admin/editor/${newPost.id}`, { replace: true })
            }

            // 3秒后清除成功消息
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError('保存失败，请确保后端服务已启动')
            }
        } finally {
            setIsSaving(false)
            setIsPublishing(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* 顶部工具栏 */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/admin')}
                            className="text-slate-500 hover:text-slate-700"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            返回
                        </Button>
                        <h1 className="text-lg font-medium text-slate-800">
                            {isEditing ? '编辑文章' : '写文章'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsPreview(!isPreview)}
                            className="text-slate-600"
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            {isPreview ? '编辑' : '预览'}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSave('draft')}
                            disabled={isSaving || isPublishing}
                        >
                            <Save className="w-4 h-4 mr-1" />
                            {isSaving ? '保存中...' : '保存草稿'}
                        </Button>

                        <Button
                            size="sm"
                            onClick={() => handleSave('published')}
                            disabled={isSaving || isPublishing}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            {isPublishing ? '发布中...' : '发布文章'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 消息提示 */}
            {(error || successMessage) && (
                <div className="max-w-7xl mx-auto px-4 mt-4">
                    <div
                        className={`p-3 rounded-lg text-sm flex items-center justify-between ${
                            error ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'
                        }`}
                    >
                        <span>{error || successMessage}</span>
                        <button onClick={() => { setError(''); setSuccessMessage(''); }}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* 主编辑区域 */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 左侧：编辑器 */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            {/* 标题输入 */}
                            <div className="border-b border-slate-100 p-4">
                                <Input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="文章标题..."
                                    className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                                />
                            </div>

                            {/* 内容区域 */}
                            <div className="p-4" style={{ minHeight: '500px' }}>
                                {isPreview ? (
                                    <div className="prose prose-slate max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <textarea
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        placeholder="开始写作...（支持 Markdown）"
                                        className="w-full h-full min-h-[500px] resize-none border-none outline-none text-slate-700 leading-relaxed font-mono text-sm"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 右侧：设置面板 */}
                    <div className="space-y-4">
                        {/* Slug */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                            <h3 className="font-medium text-slate-800 mb-3 text-sm">URL 别名 (Slug)</h3>
                            <Input
                                value={slug}
                                onChange={e => setSlug(e.target.value)}
                                placeholder="留空自动生成"
                                className="text-sm"
                            />
                            <p className="text-xs text-slate-400 mt-1">用于文章URL，如：/post/your-slug</p>
                        </div>

                        {/* 摘要 */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                            <h3 className="font-medium text-slate-800 mb-3 text-sm">文章摘要</h3>
                            <textarea
                                value={excerpt}
                                onChange={e => setExcerpt(e.target.value)}
                                placeholder="简短的文章描述（可选，留空将自动生成）"
                                rows={3}
                                maxLength={500}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                            />
                        </div>

                        {/* 封面图片 */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                            <h3 className="font-medium text-slate-800 mb-3 text-sm">封面图片</h3>
                            <Input
                                value={coverImage}
                                onChange={e => setCoverImage(e.target.value)}
                                placeholder="输入图片URL"
                                className="text-sm"
                            />
                            {coverImage && (
                                <img
                                    src={coverImage}
                                    alt="封面预览"
                                    className="mt-3 rounded-lg w-full h-32 object-cover"
                                    onError={e => (e.currentTarget.style.display = 'none')}
                                />
                            )}
                        </div>

                        {/* 分类 */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                            <h3 className="font-medium text-slate-800 mb-3 text-sm">分类</h3>
                            <select
                                value={categoryId || ''}
                                onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="">选择分类</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 标签 */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                            <h3 className="font-medium text-slate-800 mb-3 text-sm">标签</h3>

                            {/* 已选标签 */}
                            {selectedTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedTags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center gap-1"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-blue-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* 添加标签 */}
                            <div className="flex gap-2 mb-3">
                                <Input
                                    value={newTag}
                                    onChange={e => setNewTag(e.target.value)}
                                    placeholder="输入标签"
                                    className="text-sm flex-1"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                />
                                <Button size="sm" variant="outline" onClick={handleAddTag}>
                                    添加
                                </Button>
                            </div>

                            {/* 现有标签 */}
                            {existingTags.length > 0 && (
                                <div>
                                    <p className="text-xs text-slate-500 mb-2">快速选择：</p>
                                    <div className="flex flex-wrap gap-1">
                                        {existingTags
                                            .filter(t => !selectedTags.includes(t.name))
                                            .slice(0, 10)
                                            .map(tag => (
                                                <button
                                                    key={tag.id}
                                                    onClick={() => handleSelectExistingTag(tag.name)}
                                                    className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs hover:bg-slate-200 transition-colors"
                                                >
                                                    {tag.name}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}




