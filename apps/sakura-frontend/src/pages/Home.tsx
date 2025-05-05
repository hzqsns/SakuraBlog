import { FC, useEffect, useState } from 'react'
import { PostList } from '@/components/blog/PostList'
import { mockPosts } from '@/lib/mockData'

export const Home: FC = () => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // 页面加载动画
        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            className={`space-y-8 transform transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
            <PostList posts={mockPosts} />
        </div>
    )
}
