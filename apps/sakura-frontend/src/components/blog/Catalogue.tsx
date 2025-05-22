/**
 * 目录组件 (Catalogue)
 *
 * 功能：
 * 1. 提供文章内容的智能目录导航，支持多级标题嵌套显示
 * 2. 实现了"智能浮动"效果：初始正常显示，滚动到特定位置后自动固定在视口中
 * 3. 精确识别目录原始位置，实现平滑过渡，避免固定时的位置跳动
 * 4. 自动高亮当前阅读的标题，并支持点击导航
 * 5. 响应式设计：桌面端显示侧边目录，移动端提供底部按钮和侧滑菜单
 * 6. 优化的滚动和过渡效果，提供流畅的用户体验
 *
 * 核心实现特点：
 * - 通过测量目录原始位置确定最佳固定时机
 * - 使用占位元素保持页面布局稳定
 * - ResizeObserver监听尺寸变化，自适应各种场景
 */

import { FC, useRef, useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { CSSTransition } from 'react-transition-group'
import './Catalogue.less'

// 目录项接口定义，表示单个标题
interface CatalogueItem {
    id: string // 标题的唯一ID，用于定位和高亮
    text: string // 标题文本内容
    level?: number // 标题级别, h1=1, h2=2, ...
}

// 用于表示带有层级的目录项，形成树状结构
interface NestedHeading {
    item: CatalogueItem // 当前标题项
    children: NestedHeading[] // 子标题列表
}

// 组件属性接口
interface CatalogueProps {
    headings: CatalogueItem[] // 标题项列表
    activeHeading: string | null // 当前激活的标题ID
    onHeadingClick: (id: string) => void // 点击标题的回调函数
}

export const Catalogue: FC<CatalogueProps> = ({ headings, activeHeading, onHeadingClick }) => {
    // DOM引用
    const tocRef = useRef<HTMLDivElement>(null) // 目录容器引用
    const tocContainerRef = useRef<HTMLDivElement>(null) // 外层容器引用
    const mobileMenuRef = useRef<HTMLDivElement>(null) // 移动端菜单引用

    // 状态管理
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // 移动端菜单是否打开
    const [isFixed, setIsFixed] = useState(false) // 目录是否处于固定状态
    const [tocHeight, setTocHeight] = useState(0) // 目录的高度，用于占位元素
    const [tocOriginalTop, setTocOriginalTop] = useState(0) // 目录原始顶部位置（相对文档）
    const [initialPositionMeasured, setInitialPositionMeasured] = useState(false) // 是否已测量初始位置

    // 常量配置
    // 导航栏高度和目录固定的触发点
    const NAVBAR_HEIGHT = 70 // 顶部导航栏高度
    // 使用封面图片高度作为触发点，如果不可用则使用默认值
    const DEFAULT_TRIGGER_OFFSET = 400 // 默认触发偏移量

    /**
     * 计算滚动触发点 - 尝试基于封面图片高度确定最佳触发位置
     * @returns {number} 滚动触发点位置
     */
    const getScrollTriggerPoint = () => {
        // 尝试获取文章封面图片的高度
        const coverImage = document.querySelector('.article-cover-image')
        if (coverImage) {
            // 使用封面图片底部位置作为触发点
            return coverImage.getBoundingClientRect().height - NAVBAR_HEIGHT
        }
        return DEFAULT_TRIGGER_OFFSET
    }

    // 保存计算出的触发点
    const [scrollTriggerPoint, setScrollTriggerPoint] = useState(DEFAULT_TRIGGER_OFFSET)

    /**
     * 副作用：初始化时计算触发点和目录原始位置
     * 同时监听窗口大小变化，实时更新这些值
     */
    useEffect(() => {
        setScrollTriggerPoint(getScrollTriggerPoint())

        // 测量并记录目录的初始位置
        if (tocRef.current && !initialPositionMeasured) {
            // 获取目录容器相对于文档顶部的位置
            const tocRect = tocRef.current.getBoundingClientRect()
            const documentScrollTop = window.scrollY
            const originalTop = tocRect.top + documentScrollTop

            setTocOriginalTop(originalTop)
            setInitialPositionMeasured(true)
        }

        // 监听窗口大小变化，重新计算触发点和位置
        const handleResize = () => {
            setScrollTriggerPoint(getScrollTriggerPoint())

            // 重新测量目录位置
            if (tocRef.current) {
                const tocRect = tocRef.current.getBoundingClientRect()
                const documentScrollTop = window.scrollY
                const originalTop = tocRect.top + documentScrollTop

                setTocOriginalTop(originalTop)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [initialPositionMeasured])

    /**
     * 副作用：初始化时展开所有目录
     * 这是一个保留的钩子，目前只有清理函数
     */
    useEffect(() => {
        // 清理函数，避免lint警告
        return () => {
            /* 清理 */
        }
    }, [headings])

    /**
     * 副作用：计算并监听目录高度变化
     * 使用ResizeObserver观察目录大小变化，更新高度状态
     */
    useEffect(() => {
        if (tocRef.current) {
            setTocHeight(tocRef.current.offsetHeight || 0)
        }

        // 使用ResizeObserver监听元素大小变化
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === tocRef.current && tocRef.current) {
                    setTocHeight(tocRef.current.offsetHeight || 0)
                }
            }
        })

        if (tocRef.current) {
            resizeObserver.observe(tocRef.current)
        }

        return () => {
            if (tocRef.current) {
                resizeObserver.unobserve(tocRef.current)
            }
        }
    }, [headings])

    /**
     * 副作用：监听滚动事件，动态更新目录位置状态
     * 核心逻辑：基于目录原始位置决定是否固定目录
     */
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.scrollY

            // 确保我们已经测量了初始位置
            if (!initialPositionMeasured && tocRef.current) {
                const tocRect = tocRef.current.getBoundingClientRect()
                const originalTop = tocRect.top + currentScrollTop
                setTocOriginalTop(originalTop)
                setInitialPositionMeasured(true)
            }

            // 根据滚动位置决定是否固定目录
            // 现在我们比较滚动位置与目录原始位置的关系
            const shouldFix = currentScrollTop > tocOriginalTop - NAVBAR_HEIGHT - 20

            // 仅在状态需要变化时更新，避免不必要的重渲染
            if (shouldFix !== isFixed) {
                setIsFixed(shouldFix)
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // 初始检查

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [scrollTriggerPoint, isFixed, initialPositionMeasured, tocOriginalTop])

    /**
     * 副作用：处理点击外部关闭移动端菜单
     * 监听全局点击事件，判断是否需要关闭菜单
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMobileMenuOpen) {
                closeMobileMenu()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMobileMenuOpen])

    /**
     * 关闭移动端菜单的处理函数
     */
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    /**
     * 计算目录固定样式
     * 根据是否固定状态返回不同的样式对象
     * @returns {object} 样式对象
     */
    const getStickyStyle = () => {
        if (!isFixed) {
            return {} // 非固定状态返回空样式
        }

        // 计算顶部距离，确保在固定时顶部有适当的间距
        const topDistance = NAVBAR_HEIGHT + 20 // 导航栏高度 + 额外间距

        return {
            position: 'fixed',
            top: `${topDistance}px`,
            maxHeight: `calc(100vh - ${topDistance + 40}px)`, // 确保不超出视口
            width: '16rem' // 保持宽度一致
        }
    }

    // 如果没有标题，不渲染目录
    if (headings.length === 0) {
        return null
    }

    /**
     * 按层级组织标题，构建树状结构
     * @param {CatalogueItem[]} headingsList 标题列表
     * @returns {NestedHeading[]} 组织后的树状结构
     */
    const organizeHeadings = (headingsList: CatalogueItem[]): NestedHeading[] => {
        // 如果没有提供level，则按照扁平列表处理
        if (!headingsList.some(h => h.level)) {
            return headingsList.map(item => ({ item, children: [] }))
        }

        const result: NestedHeading[] = []
        let lastHeadingByLevel: { [level: number]: NestedHeading } = {}

        headingsList.forEach(heading => {
            const level = heading.level || 2 // 默认当作h2处理
            const nestedHeading: NestedHeading = { item: heading, children: [] }

            // 如果是顶级标题或者没有合适的父级，则添加到结果中
            if (level <= 2) {
                result.push(nestedHeading)
                lastHeadingByLevel = { 2: nestedHeading }
            } else {
                // 找到合适的父级
                let parentLevel = level - 1
                while (parentLevel >= 2 && !lastHeadingByLevel[parentLevel]) {
                    parentLevel--
                }

                if (parentLevel >= 2 && lastHeadingByLevel[parentLevel]) {
                    lastHeadingByLevel[parentLevel].children.push(nestedHeading)
                } else {
                    // 如果没有找到合适的父级，则作为顶级标题
                    result.push(nestedHeading)
                }
            }

            // 更新当前级别的最后一个标题
            lastHeadingByLevel[level] = nestedHeading

            // 清除所有更深层级的最后一个标题记录
            Object.keys(lastHeadingByLevel).forEach(key => {
                if (Number(key) > level) {
                    delete lastHeadingByLevel[Number(key)]
                }
            })
        })

        return result
    }

    /**
     * 获取标题文本前缀（用于编号显示，如 "2.1"）
     * @param {string} text 标题文本
     * @returns {string} 提取的前缀
     */
    const getTitlePrefix = (text: string): string => {
        // 匹配开头的数字和点，如 "1." 或 "2.1"
        const match = text.match(/^(\d+\.)+\s*/)
        return match ? match[0] : ''
    }

    /**
     * 获取标题文本内容（去除前缀）
     * @param {string} text 标题文本
     * @returns {string} 处理后的文本
     */
    const getTitleContent = (text: string): string => {
        return text.replace(/^(\d+\.)+\s*/, '')
    }

    /**
     * 递归渲染层级目录
     * @param {NestedHeading[]} nestedHeadings 嵌套的标题数据
     * @param {number} depth 当前深度
     * @returns {JSX.Element[]} 渲染的目录项
     */
    const renderNestedHeadings = (nestedHeadings: NestedHeading[], depth = 0) => {
        return nestedHeadings.map(({ item, children }) => {
            const hasChildren = children.length > 0
            const isActive = activeHeading === item.id
            const titlePrefix = getTitlePrefix(item.text)
            const titleContent = getTitleContent(item.text)

            return (
                <li key={item.id} className={`${depth > 0 ? 'mb-0' : 'mb-1'}`}>
                    <div
                        className={`flex items-center rounded transition-colors cursor-pointer ${
                            isActive ? 'bg-purple-50 text-purple-600 font-medium' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => {
                            // 点击跳转到对应位置
                            onHeadingClick(item.id)

                            // 在移动端关闭菜单
                            if (isMobileMenuOpen) {
                                setIsMobileMenuOpen(false)
                            }
                        }}
                    >
                        <div className={`flex items-center ${depth > 0 ? 'py-0.5' : 'py-1.5'} w-full toc-item-level-${depth + 1}`}>
                            {/* 标题内容 - 有数字前缀的特殊处理 */}
                            <div className="text-sm flex-grow">
                                {titlePrefix && (
                                    <span className={`mr-1 ${isActive ? 'text-purple-500' : 'text-gray-500'}`}>{titlePrefix}</span>
                                )}
                                <span>{titleContent}</span>
                            </div>
                        </div>
                    </div>

                    {/* 子标题递归渲染 */}
                    {hasChildren && <ul className="list-none pl-0 space-y-0">{renderNestedHeadings(children, depth + 1)}</ul>}
                </li>
            )
        })
    }

    // 组织标题数据为嵌套结构
    const nestedHeadings = organizeHeadings(headings)

    return (
        <>
            {/* 桌面端目录 */}
            <div className="w-full md:w-64 mb-6 md:mb-0" ref={tocContainerRef}>
                <div
                    ref={tocRef}
                    className={`hidden md:block bg-white rounded-xl p-4 shadow-md border border-gray-100 overflow-y-auto toc-container z-20 transition-all duration-300 ${
                        isFixed ? 'catalogue-fixed' : ''
                    }`}
                    style={getStickyStyle() as React.CSSProperties}
                >
                    <h3 className="text-lg font-bold mb-4 text-gray-800 px-1 sticky top-0 bg-white pt-1">目录</h3>
                    <nav className="mt-2">
                        <ul className="list-none pl-0">{renderNestedHeadings(nestedHeadings)}</ul>
                    </nav>
                </div>

                {/* 占位元素，保持布局稳定，仅在目录固定时显示 */}
                {isFixed && <div className="hidden md:block w-64" style={{ height: `${tocHeight}px` }}></div>}
            </div>

            {/* 移动端目录按钮 - 固定在右下角 */}
            <div className="md:hidden fixed right-4 bottom-4 z-40">
                <button
                    className="bg-purple-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* 移动端目录抽屉 - 使用CSSTransition实现动画效果 */}
            <CSSTransition in={isMobileMenuOpen} timeout={300} classNames="mobile-menu" unmountOnExit>
                <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex justify-end transition-all duration-300">
                    <div ref={mobileMenuRef} className="bg-white w-4/5 h-full overflow-y-auto p-4 mobile-menu-slide shadow-lg">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-gray-800">目录</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                                onClick={closeMobileMenu}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <nav>
                            <ul className="list-none pl-0">{renderNestedHeadings(nestedHeadings)}</ul>
                        </nav>
                    </div>
                </div>
            </CSSTransition>
        </>
    )
}
