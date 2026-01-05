import { useState, useEffect, useCallback } from 'react'
import { postService, categoryService, tagService } from '@/lib/api'
import type { Post, PostListResponse, PostQuery, Category, Tag } from '@/types'

// ========== 文章列表 Hook ==========

interface UsePostsOptions {
    initialPage?: number
    pageSize?: number
    status?: string
    categoryId?: number
    tagId?: number
    search?: string
}

interface UsePostsReturn {
    posts: Post[]
    total: number
    page: number
    totalPages: number
    isLoading: boolean
    isLoadingMore: boolean
    hasMore: boolean
    error: Error | null
    loadMore: () => Promise<void>
    refresh: () => Promise<void>
}

export function usePosts(options: UsePostsOptions = {}): UsePostsReturn {
    const { initialPage = 1, pageSize = 6, status = 'published', categoryId, tagId, search } = options

    const [posts, setPosts] = useState<Post[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(initialPage)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const hasMore = page < totalPages

    const fetchPosts = useCallback(
        async (pageNum: number, append: boolean = false) => {
            try {
                const query: PostQuery = {
                    page: pageNum,
                    page_size: pageSize,
                    status,
                    category_id: categoryId,
                    tag_id: tagId,
                    search
                }

                const response = await postService.list(query)

                if (append) {
                    setPosts(prev => [...prev, ...response.posts])
                } else {
                    setPosts(response.posts)
                }

                setTotal(response.total)
                setPage(response.page)
                setTotalPages(response.total_pages)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err : new Error('获取文章失败'))
            }
        },
        [pageSize, status, categoryId, tagId, search]
    )

    // 初始加载
    useEffect(() => {
        setIsLoading(true)
        setPosts([])
        setPage(initialPage)
        fetchPosts(initialPage).finally(() => setIsLoading(false))
    }, [fetchPosts, initialPage])

    // 加载更多
    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore) return
        setIsLoadingMore(true)
        await fetchPosts(page + 1, true)
        setIsLoadingMore(false)
    }, [fetchPosts, page, hasMore, isLoadingMore])

    // 刷新
    const refresh = useCallback(async () => {
        setIsLoading(true)
        setPosts([])
        setPage(initialPage)
        await fetchPosts(initialPage)
        setIsLoading(false)
    }, [fetchPosts, initialPage])

    return {
        posts,
        total,
        page,
        totalPages,
        isLoading,
        isLoadingMore,
        hasMore,
        error,
        loadMore,
        refresh
    }
}

// ========== 单篇文章 Hook ==========

interface UsePostReturn {
    post: Post | null
    isLoading: boolean
    error: Error | null
}

export function usePost(slug: string | undefined): UsePostReturn {
    const [post, setPost] = useState<Post | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!slug) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)

        postService
            .getBySlug(slug)
            .then(data => {
                setPost(data)
            })
            .catch(err => {
                setError(err instanceof Error ? err : new Error('获取文章失败'))
                setPost(null)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [slug])

    return { post, isLoading, error }
}

// ========== 分类 Hook ==========

interface UseCategoriesReturn {
    categories: Category[]
    isLoading: boolean
    error: Error | null
}

export function useCategories(): UseCategoriesReturn {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        categoryService
            .list()
            .then(data => {
                setCategories(data)
            })
            .catch(err => {
                setError(err instanceof Error ? err : new Error('获取分类失败'))
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    return { categories, isLoading, error }
}

// ========== 标签 Hook ==========

interface UseTagsReturn {
    tags: Tag[]
    isLoading: boolean
    error: Error | null
}

export function useTags(): UseTagsReturn {
    const [tags, setTags] = useState<Tag[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        tagService
            .list()
            .then(data => {
                setTags(data)
            })
            .catch(err => {
                setError(err instanceof Error ? err : new Error('获取标签失败'))
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    return { tags, isLoading, error }
}




