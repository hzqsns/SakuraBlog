import { ReactNode } from 'react'
import { RouteObject } from 'react-router-dom'

// 扩展RouteObject添加自定义属性
export interface AppRouteObject extends RouteObject {
    // 是否在导航菜单中显示
    showInMenu?: boolean
    // 导航菜单中的标题
    title?: string
    // 导航菜单中的图标
    icon?: ReactNode
    // 是否需要鉴权
    requireAuth?: boolean
    // 路由对应的权限角色
    roles?: Array<'admin' | 'user' | 'guest'>
    // 子路由
    children?: AppRouteObject[]
}

// 路由守卫Props类型
export interface RouteGuardProps {
    children: ReactNode
    requireAuth?: boolean
    roles?: Array<'admin' | 'user' | 'guest'>
}
