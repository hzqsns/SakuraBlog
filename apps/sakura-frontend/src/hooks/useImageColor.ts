import { useState, useEffect } from 'react'
// @ts-ignore
import ColorThief from 'colorthief'

interface ColorData {
    dominantColor: [number, number, number]
    gradientStyle: string
}

export const useImageColor = (imageUrl: string): ColorData | null => {
    const [colorData, setColorData] = useState<ColorData | null>(null)

    useEffect(() => {
        if (!imageUrl) return

        const extractColor = async () => {
            try {
                const img = new Image()
                img.crossOrigin = 'anonymous'

                img.onload = () => {
                    try {
                        const colorThief = new ColorThief()
                        const dominantColor = colorThief.getColor(img) as [number, number, number]

                        // 生成基于主色调的渐变背景
                        const [r, g, b] = dominantColor

                        // 创建一个非常深的版本作为主背景
                        const darkR = Math.max(0, Math.min(255, Math.floor(r * 0.15)))
                        const darkG = Math.max(0, Math.min(255, Math.floor(g * 0.15)))
                        const darkB = Math.max(0, Math.min(255, Math.floor(b * 0.15)))

                        // 创建一个稍微亮一点的版本作为中间色
                        const midR = Math.max(0, Math.min(255, Math.floor(r * 0.25)))
                        const midG = Math.max(0, Math.min(255, Math.floor(g * 0.25)))
                        const midB = Math.max(0, Math.min(255, Math.floor(b * 0.25)))

                        // 创建一个更柔和的高亮版本
                        const lightR = Math.max(0, Math.min(255, Math.floor(r * 0.35)))
                        const lightG = Math.max(0, Math.min(255, Math.floor(g * 0.35)))
                        const lightB = Math.max(0, Math.min(255, Math.floor(b * 0.35)))

                        const gradientStyle = `
                            background: linear-gradient(135deg, 
                                rgba(${darkR}, ${darkG}, ${darkB}, 0.85) 0%,
                                rgba(${midR}, ${midG}, ${midB}, 0.65) 50%,
                                rgba(${lightR}, ${lightG}, ${lightB}, 0.45) 100%);
                            backdrop-filter: blur(24px) saturate(180%);
                            -webkit-backdrop-filter: blur(24px) saturate(180%);
                        `

                        setColorData({
                            dominantColor,
                            gradientStyle
                        })
                    } catch (error) {
                        console.error('颜色提取失败:', error)
                        // 使用默认样式
                        setColorData({
                            dominantColor: [20, 20, 30],
                            gradientStyle: `
                                background: rgba(15, 15, 20, 0.8);
                                backdrop-filter: blur(24px) saturate(180%);
                                -webkit-backdrop-filter: blur(24px) saturate(180%);
                            `
                        })
                    }
                }

                img.onerror = () => {
                    // 使用默认样式
                    setColorData({
                        dominantColor: [20, 20, 30],
                        gradientStyle: `
                            background: rgba(15, 15, 20, 0.8);
                            backdrop-filter: blur(24px) saturate(180%);
                            -webkit-backdrop-filter: blur(24px) saturate(180%);
                        `
                    })
                }

                img.src = imageUrl
            } catch (error) {
                console.error('图片加载失败:', error)
                // 使用默认样式
                setColorData({
                    dominantColor: [20, 20, 30],
                    gradientStyle: `
                        background: rgba(15, 15, 20, 0.8);
                        backdrop-filter: blur(24px) saturate(180%);
                        -webkit-backdrop-filter: blur(24px) saturate(180%);
                    `
                })
            }
        }

        extractColor()
    }, [imageUrl])

    return colorData
}
