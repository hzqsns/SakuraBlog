import { Input } from '@/components/ui/input'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
    const location = useLocation()
    const isActive = (path: string) => location.pathname === path

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
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
                        <Input type="search" placeholder="搜索..." className="pl-8" />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-2 top-2.5 h-4 w-4 text-gray-500"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                </div>
            </div>
        </header>
    )
}
