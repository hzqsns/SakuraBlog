import { FC, useRef, useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { CSSTransition } from 'react-transition-group'
import './Catalogue.less'

interface CatalogueItem {
    id: string
    text: string
    level?: number // 标题级别, h1=1, h2=2, ...
}

// 用于表示带有层级的目录项
interface NestedHeading {
    item: CatalogueItem
    children: NestedHeading[]
}

interface CatalogueProps {
    headings: CatalogueItem[]
    activeHeading: string | null
    onHeadingClick: (id: string) => void
}

export const Catalogue: FC<CatalogueProps> = ({ headings, activeHeading, onHeadingClick }) => {
    const tocRef = useRef<HTMLDivElement>(null)
    const mobileMenuRef = useRef<HTMLDivElement>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // 初始化时展开所有目录
    useEffect(() => {
        // 清理函数，避免lint警告
        return () => {
            /* 清理 */
        }
    }, [headings])

    // 处理点击外部关闭移动端菜单
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

    // 关闭移动端菜单
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    if (headings.length === 0) {
        return null
    }

    // 按层级组织标题
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

    // 获取标题文本前缀（用于编号显示，如 "2.1"）
    const getTitlePrefix = (text: string): string => {
        // 匹配开头的数字和点，如 "1." 或 "2.1"
        const match = text.match(/^(\d+\.)+\s*/)
        return match ? match[0] : ''
    }

    // 获取标题文本内容（去除前缀）
    const getTitleContent = (text: string): string => {
        return text.replace(/^(\d+\.)+\s*/, '')
    }

    // 递归渲染层级目录
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

                    {/* 子标题 */}
                    {hasChildren && <ul className="list-none pl-0 space-y-0">{renderNestedHeadings(children, depth + 1)}</ul>}
                </li>
            )
        })
    }

    const nestedHeadings = organizeHeadings(headings)

    return (
        <>
            {/* 桌面端目录 */}
            <div className="w-full md:w-64 mb-6 md:mb-0">
                <div
                    ref={tocRef}
                    className="hidden md:block sticky top-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100 max-h-[calc(100vh-100px)] overflow-y-auto toc-container"
                >
                    <h3 className="text-lg font-bold mb-4 text-gray-800 px-1">目录</h3>
                    <nav className="mt-2">
                        <ul className="list-none pl-0">{renderNestedHeadings(nestedHeadings)}</ul>
                    </nav>
                </div>
            </div>

            {/* 移动端目录按钮 */}
            <div className="md:hidden fixed right-4 bottom-4 z-40">
                <button
                    className="bg-purple-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* 移动端目录抽屉 - 使用CSSTransition替代dangerouslySetInnerHTML */}
            <CSSTransition in={isMobileMenuOpen} timeout={300} classNames="mobile-menu" unmountOnExit>
                <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex justify-end transition-all duration-300">
                    <div ref={mobileMenuRef} className="bg-white w-4/5 h-full overflow-y-auto p-4 mobile-menu-slide shadow-lg">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b">
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
