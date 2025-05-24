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
        <div className="flex flex-col min-h-svh relative overflow-hidden">
            {/* 淡紫到淡蓝到白色的渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-100 via-sky-100 to-white">
                {/* 添加一些细微的云朵点缀 */}
                <div className="absolute top-20 right-[20%] w-28 h-10 bg-white/40 rounded-full blur-sm"></div>
                <div className="absolute top-36 left-[15%] w-36 h-12 bg-white/35 rounded-full blur-sm"></div>
                <div className="absolute top-52 right-[65%] w-32 h-11 bg-white/30 rounded-full blur-sm"></div>
                <div className="absolute top-72 left-[70%] w-24 h-8 bg-white/25 rounded-full blur-sm"></div>
            </div>

            {/* 导航栏 */}
            <Header />

            {/* 添加顶部间距，为固定导航栏腾出空间 */}
            <div className="h-16"></div>

            <main className="container mx-auto max-w-7xl flex-1 py-6 px-4 z-10 relative">
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
