import { FC } from 'react'
import { Post } from '@/types'
import { PostCard } from './PostCard'

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
                        className={`transform transition-all duration-500 ${
                            index % 2 === 0 ? 'translate-x-0 hover:-translate-x-2' : 'translate-x-0 hover:translate-x-2'
                        }`}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                            transitionDelay: `${index * 0.05}s`
                        }}
                    >
                        <PostCard post={post} />
                    </div>
                ))
            )}
        </div>
    )
}
