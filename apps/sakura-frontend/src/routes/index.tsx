import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { Friends } from '@/pages/Friends'
import { Archive } from '@/pages/Archive'
import { PostDetail } from '@/pages/PostDetail'
import { SearchResults } from '@/pages/SearchResults'
import { TagResults } from '@/pages/TagResults'
import { Admin } from '@/pages/Admin'
import { AdminEditor } from '@/pages/AdminEditor'
import { AppRouteObject } from '@/types/route'

// 公开路由配置
export const routes: AppRouteObject[] = [
    {
        path: '/',
        element: <Home />,
        title: '首页',
        showInMenu: true
    },
    {
        path: '/about',
        element: <About />,
        title: '关于我',
        showInMenu: true
    },
    {
        path: '/friends',
        element: <Friends />,
        title: '友链',
        showInMenu: true
    },
    {
        path: '/archive',
        element: <Archive />,
        title: '归档',
        showInMenu: true
    },
    {
        path: '/post/:slug',
        element: <PostDetail />,
        showInMenu: false
    },
    {
        path: '/search',
        element: <SearchResults />,
        showInMenu: false
    },
    {
        path: '/tag/:tag',
        element: <TagResults />,
        showInMenu: false
    },
    // 后台管理
    {
        path: '/admin',
        element: <Admin />,
        title: '管理后台',
        showInMenu: false
    },
    {
        path: '/admin/editor',
        element: <AdminEditor />,
        title: '写文章',
        showInMenu: false
    },
    {
        path: '/admin/editor/:id',
        element: <AdminEditor />,
        title: '编辑文章',
        showInMenu: false
    },
    // 404 页面
    {
        path: '*',
        element: <div className="text-center py-20 text-gray-500">404 - 页面不存在</div>,
        showInMenu: false
    }
]

// 合并所有路由
export const allRoutes: AppRouteObject[] = [...routes]
