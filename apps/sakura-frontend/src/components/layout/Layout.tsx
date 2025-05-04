import { PropsWithChildren } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Sidebar } from "@/components/layout/Sidebar"

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-svh bg-gray-50">
      <Header />
      
      <main className="container flex-1 py-6 px-4">
        <div className="flex gap-6">
          {/* 主要内容区域 */}
          <div className="flex-1">
            {children}
          </div>
          
          {/* 侧边栏 */}
          <Sidebar />
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 