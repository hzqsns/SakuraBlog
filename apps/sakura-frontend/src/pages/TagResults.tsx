import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePosts, useTags } from '@/hooks/usePosts'
import { ArticleShow } from '@/components/blog/ArticleShow'

export const TagResults: FC = () => {
    const { tag } = useParams<{ tag: string }>()
    const decodedTag = tag ? decodeURIComponent(tag) : ''

    // 获取标签列表以找到对应的 tag_id
    const { tags, isLoading: isLoadingTags } = useTags()
    const [tagId, setTagId] = useState<number | undefined>(undefined)

    // 根据标签名查找 tag_id
    useEffect(() => {
        if (tags.length > 0 && decodedTag) {
            const foundTag = tags.find(t => t.name.toLowerCase() === decodedTag.toLowerCase())
            setTagId(foundTag?.id)
        }
    }, [tags, decodedTag])

    // 使用 tag_id 获取文章
    const { posts, isLoading: isLoadingPosts } = usePosts({
        tagId: tagId,
        pageSize: 30
    })

    const isLoading = isLoadingTags || (tagId !== undefined && isLoadingPosts)

    // 如果没找到标签，显示空结果
    const displayPosts = tagId ? posts : []

    return (
        <ArticleShow
            title={`标签: ${decodedTag}`}
            results={displayPosts}
            isLoading={isLoading}
            emptyMessage={{
                title: `没有找到标签为 "${decodedTag}" 的文章`,
                suggestion: '请尝试查看其他标签'
            }}
        />
    )
}
