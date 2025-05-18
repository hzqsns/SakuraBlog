import { useState, FormEvent, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from './input'
import { loadAllPapers } from '@/utils/loadPapers'
import { Paper } from '@/types/markdown'

interface SearchBoxProps {
    className?: string
    placeholder?: string
}

export function SearchBox({ className, placeholder = '搜索...' }: SearchBoxProps) {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<Paper[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [papers, setPapers] = useState<Paper[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const suggestionsRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // 加载所有文章
    useEffect(() => {
        const fetchPapers = async () => {
            setIsLoading(true)
            try {
                const allPapers = await loadAllPapers()
                setPapers(allPapers)
            } catch (error) {
                console.error('Failed to load papers:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPapers()
    }, [])

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

    // 搜索建议
    useEffect(() => {
        if (query.trim().length >= 1 && papers.length > 0) {
            const matchedPapers = papers
                .filter(paper => {
                    const searchableContent = [paper.title, paper.excerpt, ...(paper.tags || []), ...paper.category].join(' ').toLowerCase()
                    return searchableContent.includes(query.toLowerCase())
                })
                .slice(0, 5) // 限制显示5条结果

            setSuggestions(matchedPapers)
            setShowSuggestions(true)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }, [query, papers])

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
        <div className="relative w-full">
            <form onSubmit={handleSubmit} className="relative w-full">
                <Input
                    ref={inputRef}
                    type="search"
                    placeholder={isLoading ? '加载中...' : placeholder}
                    className={`pl-8 ${className || ''}`}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => query.trim().length > 0 && setShowSuggestions(true)}
                    disabled={isLoading}
                />
                <span className="absolute left-2 top-2.5">
                    {isLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-gray-300 rounded-full border-t-gray-500"></div>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 text-gray-500"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    )}
                </span>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    <ul className="py-1">
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
                    </ul>
                </div>
            )}
        </div>
    )
}
