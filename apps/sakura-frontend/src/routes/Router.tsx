import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { allRoutes } from '@/routes'
import { Layout } from '@/components/layout/Layout'
import { FC } from 'react'
import { AppRouteObject } from '@/types/route'

export const Router: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {allRoutes.map((route: AppRouteObject) => {
                    // 后台管理页面不使用 Layout
                    if (route.path?.startsWith('/admin')) {
                        return <Route key={route.path} path={route.path} element={route.element} />
                    }
                    // 其他页面使用 Layout
                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<Layout>{route.element}</Layout>}
                        />
                    )
                })}
            </Routes>
        </BrowserRouter>
    )
}
