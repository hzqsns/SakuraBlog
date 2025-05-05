import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { allRoutes } from '@/routes'
import { Layout } from '@/components/layout/Layout'
import { FC } from 'react'
import { AppRouteObject } from '@/types/route'

export const Router: FC = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {allRoutes.map((route: AppRouteObject) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}
