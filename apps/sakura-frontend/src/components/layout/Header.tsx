import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Link, useLocation } from 'react-router-dom'
import { SearchBox } from '@/components/ui/search-box'
import { useEffect, useState } from 'react'

export function Header() {
    const location = useLocation()
    // 用于跟踪滚动状态的状态变量
    const [scrolled, setScrolled] = useState(false)

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
        // 添加固定定位和样式
        // fixed：保持固定在视口顶部
        // transition-all：添加过渡动画
        // 滚动后添加阴影和不同的背景色
        <header
            className={`
                fixed top-0 left-0 right-0 z-50 w-full 
                transition-all duration-300 ease-in-out
                ${scrolled ? 'shadow-md bg-white/95 backdrop-blur-md' : 'bg-white/80'}
                border-b border-gray-200/70
            `}
        >
            <div className="container flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-2">
                    <Link to="/">
                        <h1 className="text-xl font-bold">Sakura</h1>
                    </Link>
                </div>

                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link to="/about">
                                <div
                                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                                        isActive('/about') ? 'bg-gray-100/50' : ''
                                    }`}
                                >
                                    关于我
                                </div>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/friends">
                                <div
                                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                                        isActive('/friends') ? 'bg-gray-100/50' : ''
                                    }`}
                                >
                                    友链
                                </div>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/archive">
                                <div
                                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                                        isActive('/archive') ? 'bg-gray-100/50' : ''
                                    }`}
                                >
                                    归档
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
