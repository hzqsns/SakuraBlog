/**
 * Waline评论组件
 * 集成Waline评论系统到React应用中
 * 支持服务端渲染和客户端渲染
 */
import React, { useEffect, useRef } from 'react'
import { type WalineInstance, type WalineInitOptions, init } from '@waline/client'

// 引入Waline默认样式
import '@waline/client/style'

/**
 * Waline组件属性类型
 * 继承自WalineInitOptions，但排除'el'参数（由组件内部提供）
 * 必须包含'path'参数，用于指定评论的唯一标识路径
 */
export type WalineOptions = Omit<WalineInitOptions, 'el'> & { path: string }

/**
 * Waline评论组件
 * 将Waline评论系统集成到React应用中
 *
 * @param props Waline配置选项，详见WalineOptions类型
 * @returns React组件，包含Waline评论系统
 */
export const Waline = (props: WalineOptions) => {
    // 引用Waline实例，用于管理和更新评论系统
    const walineInstanceRef = useRef<WalineInstance | null>(null)
    // 创建DOM引用，用于指定Waline挂载的容器元素
    const containerRef = React.createRef<HTMLDivElement>()

    // 初始化Waline实例，并在组件卸载时销毁
    useEffect(() => {
        // 初始化Waline，将配置和容器元素传递给init函数
        walineInstanceRef.current = init({
            ...props,
            el: containerRef.current
        })

        // 组件卸载时清理资源
        return () => walineInstanceRef.current?.destroy()
    }, [])

    // 当props变化时更新Waline实例配置
    useEffect(() => {
        walineInstanceRef.current?.update(props)
    }, [props])

    // 渲染一个空div容器，Waline将挂载到这个容器上
    return <div ref={containerRef} />
}
