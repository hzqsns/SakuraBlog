import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ImgHTMLAttributes } from 'react'

// 基础组件Props类型，包含常见的共同属性
export interface BaseComponentProps {
    className?: string
    children?: ReactNode
    id?: string
}

// 按钮组件Props类型
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseComponentProps {
    variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    isLoading?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
}

// 输入框组件Props类型
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'>, BaseComponentProps {
    label?: string
    error?: string
    prefix?: ReactNode
    suffix?: ReactNode
}

// 文本区域组件Props类型
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseComponentProps {
    label?: string
    error?: string
}

// 卡片组件Props类型
export interface CardProps extends BaseComponentProps {
    title?: string
    description?: string
    footer?: ReactNode
    image?: string
}

// 头像组件Props类型
export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement>, BaseComponentProps {
    name?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    status?: 'online' | 'offline' | 'busy' | 'away'
    shape?: 'circle' | 'square'
    fallback?: ReactNode
}

// 模态框组件Props类型
export interface ModalProps extends BaseComponentProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    footer?: ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

// 导航项组件Props类型
export interface NavItemProps extends BaseComponentProps {
    href: string
    title: string
    icon?: ReactNode
    isActive?: boolean
    isExternal?: boolean
}
