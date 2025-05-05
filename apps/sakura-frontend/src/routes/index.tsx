import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { Friends } from '@/pages/Friends'
import { Archive } from '@/pages/Archive'
import { PostDetail } from '@/pages/PostDetail'
import { RouteGuard } from './RouteGuard'
import { AppRouteObject } from '@/types/route'

// 路由配置
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
    // 未授权页面
    {
        path: '/unauthorized',
        element: <div>您没有权限访问该页面</div>,
        showInMenu: false
    },
    // 404 页面
    {
        path: '*',
        element: <div>404 - 页面不存在</div>,
        showInMenu: false
    }
]

// 需要鉴权的路由
export const protectedRoutes: AppRouteObject[] = [
    {
        path: '/admin',
        element: (
            <RouteGuard requireAuth roles={['admin']}>
                <div>管理员页面</div>
            </RouteGuard>
        ),
        title: '管理',
        showInMenu: false,
        requireAuth: true,
        roles: ['admin']
    }
]

// 合并所有路由
export const allRoutes: AppRouteObject[] = [...routes, ...protectedRoutes]
