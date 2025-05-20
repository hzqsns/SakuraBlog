import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { PostList } from './PostList'
import { Post } from '@/types'

interface ArticleShowProps {
    title: React.ReactNode
    subTitle?: React.ReactNode
    results: Post[]
    isLoading: boolean
    emptyMessage: {
        title: string
        suggestion: string
    }
}

export const ArticleShow: FC<ArticleShowProps> = ({ title, subTitle, results, isLoading, emptyMessage }) => {
    const navigate = useNavigate()

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-gray-800"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 relative">
            <div className="pb-4 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {subTitle || (
                        <p className="text-gray-500 mt-2">
                            找到 {results.length} {results.length > 1 ? '篇文章' : '篇文章'}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors flex items-center"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    返回
                </button>
            </div>

            {results.length > 0 ? (
                <PostList posts={results} />
            ) : (
                <div className="py-10 text-center">
                    <p className="text-lg text-gray-500">{emptyMessage.title}</p>
                    <p className="mt-2 text-gray-400">{emptyMessage.suggestion}</p>
                </div>
            )}
        </div>
    )
}
