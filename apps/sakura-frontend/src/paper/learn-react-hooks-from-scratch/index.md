---
title: 从零开始学习React Hooks
excerpt: '本文从零开始介绍React Hooks的基本概念和使用方法，包括useState、useEffect等核心Hook的详细讲解和实例。'
author: 'Sakura'
publishDate: '2022-05-15'
coverImage: 'https://picsum.photos/800/600?random=5'
slug: 'learn-react-hooks-from-scratch'
date: 2022-05-15 09:30:00
tags:
    - React
    - 前端
    - JavaScript
    - Hooks
category:
    - 前端开发
---

React Hooks 是 React 16.8 引入的特性，它允许我们在函数组件中使用状态和其他 React 特性。本文将从零开始介绍 React Hooks 的基本概念和使用方法。

### useState: 状态管理的基础

```jsx
import React, { useState } from 'react'

function Counter() {
    const [count, setCount] = useState(0)

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    )
}
```

### useEffect: 处理副作用

useEffect 允许我们在函数组件中执行副作用操作：

```jsx
import React, { useState, useEffect } from 'react'

function Example() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        document.title = `You clicked ${count} times`

        // 清理函数
        return () => {
            document.title = 'React App'
        }
    }, [count]) // 仅在count更改时重新执行

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    )
}
```
