import { Navigate } from 'react-router-dom'
import { RouteGuardProps } from '@/types/route'
import { useAuth } from '@/contexts/AuthContext'

/**
 * 路由守卫组件
 * 用于处理需要鉴权的路由
 */
export function RouteGuard({ children, requireAuth = false, roles = [] }: RouteGuardProps) {
    const { isLoggedIn, user, isLoading } = useAuth()

    // 等待认证状态加载完成
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
        )
    }

    // 如果需要鉴权但用户未登录，重定向到登录页
    if (requireAuth && !isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    // 如果指定了角色要求，检查用户角色
    if (roles.length > 0 && user) {
        if (!roles.includes(user.role as any)) {
            return <Navigate to="/unauthorized" replace />
        }
    }

    return <>{children}</>
}
