import { useState, useEffect, useCallback } from 'react'
import { UseToggleReturn, UseLocalStorageReturn, UseLocalStorageOptions } from '@/types/hooks'
import { safeParseJSON } from './utils'

/**
 * 使用布尔切换状态的钩子
 */
export function useToggle(initialState = false): UseToggleReturn {
    const [state, setState] = useState<boolean>(initialState)
    const toggle = useCallback(() => setState(prev => !prev), [])

    return [state, toggle]
}

/**
 * 使用localStorage持久化状态的钩子
 */
export function useLocalStorage<T>(key: string, initialValue: T, options?: UseLocalStorageOptions<T>): UseLocalStorageReturn<T> {
    const serializer = options?.serializer || JSON.stringify
    const deserializer = options?.deserializer || ((value: string) => safeParseJSON<T>(value, initialValue))

    // 使用函数初始化避免重复读取localStorage
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? deserializer(item) : initialValue
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    // 更新localStorage当状态变化时
    const setValue: UseLocalStorageReturn<T>[1] = useCallback(
        value => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value
                setStoredValue(valueToStore)
                window.localStorage.setItem(key, serializer(valueToStore))
            } catch (error) {
                console.error(`Error setting localStorage key "${key}":`, error)
            }
        },
        [key, serializer, storedValue]
    )

    return [storedValue, setValue]
}

/**
 * 检测点击元素外部的钩子
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
    ref: React.RefObject<T>,
    handler: (event: MouseEvent | TouchEvent) => void,
    eventType: 'mousedown' | 'mouseup' | 'click' | 'touchstart' | 'touchend' = 'mousedown'
): void {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const el = ref?.current
            if (!el || el.contains(event.target as Node)) {
                return
            }

            handler(event)
        }

        document.addEventListener(eventType, listener)

        return () => {
            document.removeEventListener(eventType, listener)
        }
    }, [ref, handler, eventType])
}

/**
 * 媒体查询钩子
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches
        }
        return false
    })

    useEffect(() => {
        if (typeof window === 'undefined') return undefined

        const mediaQuery = window.matchMedia(query)
        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        // 添加事件监听器
        mediaQuery.addEventListener('change', handleChange)

        // 初始化
        setMatches(mediaQuery.matches)

        // 清理
        return () => {
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [query])

    return matches
}

/**
 * 检测元素是否在视口内的钩子
 */
export function useIsInViewport<T extends HTMLElement = HTMLElement>(ref: React.RefObject<T>, options?: IntersectionObserverInit): boolean {
    const [isIntersecting, setIsIntersecting] = useState<boolean>(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting)
        }, options)

        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [ref, options])

    return isIntersecting
}
