import { useState, FormEvent, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from './input'
import { searchPapers } from '@/utils/loadPapers'
import { Paper } from '@/types/markdown'

interface SearchBoxProps {
    className?: string
    placeholder?: string
}

export function SearchBox({ className, placeholder = '搜索...' }: SearchBoxProps) {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<Paper[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const navigate = useNavigate()
    const suggestionsRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const searchTimeoutRef = useRef<NodeJS.Timeout>()

    // 处理点击外部关闭建议框
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // 搜索建议（防抖处理）
    useEffect(() => {
        // 清除之前的搜索定时器
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        if (query.trim().length >= 2) {
            setIsSearching(true)
            // 设置防抖延迟
            searchTimeoutRef.current = setTimeout(async () => {
                try {
                    // 使用优化的搜索函数，限制返回5个建议
                    const searchResults = await searchPapers(query, 5)
                    setSuggestions(searchResults)
                    setShowSuggestions(true)
                } catch (error) {
                    console.error('Error fetching search suggestions:', error)
                    setSuggestions([])
                } finally {
                    setIsSearching(false)
                }
            }, 300) // 300ms 防抖延迟
        } else {
            setSuggestions([])
            setShowSuggestions(false)
            setIsSearching(false)
        }

        // 清理函数
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [query])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        // 导航到搜索结果页面
        navigate(`/search?q=${encodeURIComponent(query.trim())}`)
        setShowSuggestions(false)
    }

    // 处理建议点击，重置搜索框
    const handleSuggestionClick = () => {
        setShowSuggestions(false)
        setQuery('')
    }

    return (
        <div className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full pr-12"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md transition-colors"
                    aria-label="搜索"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </form>

            {showSuggestions && (
                <div ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    <ul className="py-1">
                        {isSearching ? (
                            <li className="px-4 py-2 text-center text-gray-500">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                    搜索中...
                                </div>
                            </li>
                        ) : suggestions.length > 0 ? (
                            <>
                                {suggestions.map(paper => (
                                    <li key={paper.slug} className="px-4 py-2 hover:bg-gray-100">
                                        <Link to={`/post/${paper.slug}`} className="block" onClick={handleSuggestionClick}>
                                            <div className="font-medium">{paper.title}</div>
                                            <div className="text-sm text-gray-500 truncate">{paper.excerpt}</div>
                                        </Link>
                                    </li>
                                ))}
                                {query.trim() && (
                                    <li className="px-4 py-2 text-center text-gray-500 border-t">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate(`/search?q=${encodeURIComponent(query.trim())}`)
                                                setShowSuggestions(false)
                                            }}
                                            className="text-blue-500 hover:underline"
                                        >
                                            搜索所有结果 "{query}"
                                        </button>
                                    </li>
                                )}
                            </>
                        ) : query.trim().length >= 2 ? (
                            <li className="px-4 py-2 text-center text-gray-500">没有找到相关结果</li>
                        ) : null}
                    </ul>
                </div>
            )}
        </div>
    )
}
