import { PropsWithChildren, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Sidebar } from '@/components/layout/Sidebar'

export function Layout({ children }: PropsWithChildren) {
    // 添加平滑滚动效果
    useEffect(() => {
        // 设置全局的平滑滚动
        document.documentElement.style.scrollBehavior = 'smooth'

        return () => {
            document.documentElement.style.scrollBehavior = ''
        }
    }, [])

    return (
        <div className="flex flex-col min-h-svh bg-gray-100 relative overflow-hidden">
            {/* 背景装饰效果 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            </div>

            <Header />

            <main className="container mx-auto max-w-7xl flex-1 py-6 px-4 z-10">
                <div className="flex gap-6">
                    {/* 主要内容区域 */}
                    <div className="flex-1">{children}</div>

                    {/* 侧边栏 */}
                    <Sidebar />
                </div>
            </main>

            <Footer />
        </div>
    )
}
