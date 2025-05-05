import { Dispatch, SetStateAction, DependencyList } from 'react'
import { User } from './index'

// 自定义钩子返回类型
export type UseToggleReturn = [boolean, () => void]

export type UseCounterReturn = [
    number,
    {
        increment: (step?: number) => void
        decrement: (step?: number) => void
        reset: (value?: number) => void
        setValue: Dispatch<SetStateAction<number>>
    }
]

export interface UseLocalStorageOptions<T> {
    serializer?: (value: T) => string
    deserializer?: (value: string) => T
}

export type UseLocalStorageReturn<T> = [T, Dispatch<SetStateAction<T>>]

export interface UseClickOutsideOptions {
    enabled?: boolean
    eventType?: 'mousedown' | 'mouseup' | 'click' | 'touchstart' | 'touchend'
}

export type UseClickOutsideReturn = void

export interface UseFetchOptions<T> {
    initialData?: T
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    deps?: DependencyList
}

export interface UseFetchReturn<T> {
    data: T | null
    error: Error | null
    isLoading: boolean
    isError: boolean
    refetch: () => Promise<void>
}

export interface UseAuthReturn {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (credentials: { username: string; password: string }) => Promise<void>
    logout: () => Promise<void>
    register: (userData: Partial<User> & { password: string }) => Promise<void>
}

export interface UseFormOptions<T> {
    initialValues: T
    onSubmit: (values: T) => void | Promise<void>
    validate?: (values: T) => Partial<Record<keyof T, string>>
}

export interface UseFormReturn<T> {
    values: T
    errors: Partial<Record<keyof T, string>>
    touched: Partial<Record<keyof T, boolean>>
    isSubmitting: boolean
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    setFieldValue: (field: keyof T, value: any) => void
    resetForm: () => void
}
