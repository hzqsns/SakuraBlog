import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Link, useLocation } from 'react-router-dom'
import { SearchBox } from '@/components/ui/search-box'
import { useEffect, useState } from 'react'

export function Header() {
    const location = useLocation()
    // 用于跟踪滚动状态的状态变量
    const [scrolled, setScrolled] = useState(false)
    // 用于跟踪悬停状态的状态变量
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

    const isActive = (path: string) => location.pathname === path

    // 监听滚动事件，只更新滚动状态用于样式变化
    useEffect(() => {
        // 处理滚动事件的函数
        const handleScroll = () => {
            // 判断是否已滚动超过一定距离（这里设为20px）
            const isScrolled = window.scrollY > 20

            // 更新滚动状态，仅用于更改样式（添加阴影等）
            setScrolled(isScrolled)
        }

        // 添加滚动事件监听器
        window.addEventListener('scroll', handleScroll, { passive: true })

        // 组件卸载时移除监听器
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, []) // 空依赖数组，只在组件挂载和卸载时运行

    return (
        <header
            className={`
                fixed top-0 left-0 right-0 z-50 w-full 
                transition-all duration-500 ease-out
                ${
                    scrolled
                        ? 'shadow-lg bg-white/80 backdrop-blur-xl border-b border-purple-100/40'
                        : 'bg-white/30 backdrop-blur-sm border-b border-purple-100/20'
                }
            `}
        >
            <div className="container flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-2">
                    <Link to="/">
                        <h1 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors duration-300">Sakura</h1>
                    </Link>
                </div>

                <NavigationMenu>
                    <NavigationMenuList className="flex items-center space-x-1">
                        <NavigationMenuItem>
                            <Link
                                to="/"
                                className="nav-link-item"
                                onMouseEnter={() => setHoveredItem('home')}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <div
                                    className={`
                                        relative px-4 py-2 text-sm font-medium text-gray-700 
                                        transition-all duration-300 ease-out
                                        hover:text-gray-900
                                        ${isActive('/') ? 'text-gray-900 font-semibold' : ''}
                                    `}
                                >
                                    首页
                                    {/* 下划线效果 - 根据悬停状态显示 */}
                                    <div
                                        className={`
                                            absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400
                                            transition-all duration-300 ease-out transform -translate-x-1/2
                                            ${hoveredItem === 'home' ? 'w-full opacity-100' : 'w-0 opacity-0'}
                                        `}
                                    />
                                </div>
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link
                                to="/about"
                                className="nav-link-item"
                                onMouseEnter={() => setHoveredItem('about')}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <div
                                    className={`
                                        relative px-4 py-2 text-sm font-medium text-gray-700 
                                        transition-all duration-300 ease-out
                                        hover:text-gray-900
                                        ${isActive('/about') ? 'text-gray-900 font-semibold' : ''}
                                    `}
                                >
                                    关于我
                                    {/* 下划线效果 - 根据悬停状态显示 */}
                                    <div
                                        className={`
                                            absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400
                                            transition-all duration-300 ease-out transform -translate-x-1/2
                                            ${hoveredItem === 'about' ? 'w-full opacity-100' : 'w-0 opacity-0'}
                                        `}
                                    />
                                </div>
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link
                                to="/friends"
                                className="nav-link-item"
                                onMouseEnter={() => setHoveredItem('friends')}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <div
                                    className={`
                                        relative px-4 py-2 text-sm font-medium text-gray-700 
                                        transition-all duration-300 ease-out
                                        hover:text-gray-900
                                        ${isActive('/friends') ? 'text-gray-900 font-semibold' : ''}
                                    `}
                                >
                                    友链
                                    {/* 下划线效果 - 根据悬停状态显示 */}
                                    <div
                                        className={`
                                            absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400
                                            transition-all duration-300 ease-out transform -translate-x-1/2
                                            ${hoveredItem === 'friends' ? 'w-full opacity-100' : 'w-0 opacity-0'}
                                        `}
                                    />
                                </div>
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link
                                to="/archive"
                                className="nav-link-item"
                                onMouseEnter={() => setHoveredItem('archive')}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <div
                                    className={`
                                        relative px-4 py-2 text-sm font-medium text-gray-700 
                                        transition-all duration-300 ease-out
                                        hover:text-gray-900
                                        ${isActive('/archive') ? 'text-gray-900 font-semibold' : ''}
                                    `}
                                >
                                    归档
                                    {/* 下划线效果 - 根据悬停状态显示 */}
                                    <div
                                        className={`
                                            absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400
                                            transition-all duration-300 ease-out transform -translate-x-1/2
                                            ${hoveredItem === 'archive' ? 'w-full opacity-100' : 'w-0 opacity-0'}
                                        `}
                                    />
                                </div>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <SearchBox placeholder="搜索文章..." />
                    </div>
                </div>
            </div>
        </header>
    )
}
