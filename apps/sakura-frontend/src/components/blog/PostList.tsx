import { FC } from 'react'
import { Post } from '@/types'
import { PostCard } from './PostCard'
import './PostList.less'

interface PostListProps {
    posts: Post[]
}

export const PostList: FC<PostListProps> = ({ posts }) => {
    return (
        <div className="space-y-10">
            {posts.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">没有找到文章</p>
                </div>
            ) : (
                posts.map((post, index) => (
                    <div
                        key={post.id}
                        className={`post-list-item transform transition-all duration-500 ${index % 2 === 0 ? 'even' : 'odd'}`}
                    >
                        <PostCard post={post} />
                    </div>
                ))
            )}
        </div>
    )
}
