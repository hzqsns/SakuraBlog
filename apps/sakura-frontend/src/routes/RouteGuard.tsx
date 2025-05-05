import { Navigate } from 'react-router-dom'
import { RouteGuardProps } from '@/types/route'

/**
 * 路由守卫组件
 * 用于处理需要鉴权的路由
 */
export function RouteGuard({ children, requireAuth = false, roles = ['user', 'admin', 'guest'] }: RouteGuardProps) {
    // 这里可以添加鉴权逻辑，目前是一个简单的示例
    const isAuthenticated = true // 假设用户已登录
    const userRole = 'user' // 假设用户角色

    if (requireAuth && !isAuthenticated) {
        // 如果需要鉴权但用户未登录，重定向到首页
        return <Navigate to="/" replace />
    }

    // 如果指定了角色要求但用户角色不匹配
    if (roles.length > 0 && !roles.includes(userRole as any)) {
        return <Navigate to="/unauthorized" replace />
    }

    return <>{children}</>
}
