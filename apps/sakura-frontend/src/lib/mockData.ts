import { Post } from '@/types'

// 模拟文章数据
export const mockPosts: Post[] = [
    {
        id: '1',
        title: '循环变量与闭包',
        content: `起因在于2023年9月19日，Go发布的1.22版本，修复了循环变量重用问题。最近在用其他语言写代码时，也遇到了类似的问题。于是意识到不同的编程语言对待循环变量的方式有所不同。

本文将探讨几种常见编程语言中的循环变量行为，以及如何避免相关的陷阱。主要关注的是循环变量与闭包结合时的行为。

### JavaScript中的循环变量

在ES6之前，JavaScript中的for循环只有var声明，这会导致一个经典问题：

\`\`\`javascript
for (var i = 0; i < 5; i++) {
    setTimeout(() => console.log(i), 0);
}
// 输出: 5, 5, 5, 5, 5
\`\`\`

这是因为var声明在函数作用域内，而不是块级作用域。循环结束后，i的值为5，而setTimeout中的回调函数引用的是同一个i变量。

ES6引入了let关键字，提供块级作用域：

\`\`\`javascript
for (let i = 0; i < 5; i++) {
    setTimeout(() => console.log(i), 0);
}
// 输出: 0, 1, 2, 3, 4
\`\`\``,
        excerpt: '本文探讨几种常见编程语言中的循环变量行为，以及如何避免相关的陷阱。主要关注的是循环变量与闭包结合时的行为。',
        author: 'Sakura',
        publishDate: '2024-02-20',
        tags: ['编程语言', '闭包', 'Go', 'JavaScript'],
        category: '编程',
        coverImage: 'https://picsum.photos/800/600?random=1',
        slug: 'loop-variables-and-closures'
    },
    {
        id: '2',
        title: '给你的Markdown扩展新语法吧：上篇',
        content: `注意 这篇文章仅适用于基于 remark.js 的 Markdown，如 Astro.js、Gatsby.js 等等。
如果你正在使用 MDX 那么这篇文章或许也适用于你。嗯，今天我们谈聊一下怎么给你的Markdown扩展新的语法。

### 为什么需要扩展Markdown语法？

原始的Markdown语法虽然简洁易用，但在某些特定场景下可能不够灵活。例如，你可能需要：

1. 添加自定义组件，如警告框、提示框
2. 支持更复杂的排版需求
3. 添加特殊的交互元素

通过扩展Markdown语法，我们可以在保持原有简洁性的同时，增加更多表现力。

### remark.js简介

remark是一个强大的Markdown处理工具，它允许我们：

- 解析Markdown为抽象语法树(AST)
- 操作这个AST
- 将修改后的AST重新序列化为Markdown或HTML`,
        excerpt: '本文介绍如何基于remark.js为Markdown扩展新的语法功能，适用于Astro.js、Gatsby.js等现代前端框架。',
        author: 'Sakura',
        publishDate: '2023-07-29',
        tags: ['前端', 'Markdown', 'Remark', 'Unified'],
        category: '前端开发',
        coverImage: 'https://picsum.photos/800/600?random=2',
        slug: 'extend-markdown-syntax-part-1'
    },
    {
        id: '3',
        title: 'TensorRT踩坑教程',
        content: `0. 前言 在部署深度学习模型时需要用到TensorRT，看了一遍文档，我发现对于初学者来说，官方文档实在是太抽象了。文档里既没有接口的应用示例，也没有及时更新新版本的API... 下面就来记录一下我踩过的坑。

### 1. 环境配置

首先，TensorRT的版本需要与CUDA、cuDNN版本匹配。一般的对应关系为：

- TensorRT 8.x 需要 CUDA 11.x
- TensorRT 7.x 需要 CUDA 10.x

安装方式有几种：
- pip安装（最简单）：\`pip install tensorrt\`
- 通过NVIDIA官网下载安装包
- 使用Docker镜像（推荐）

### 2. 常见错误

#### 2.1 找不到共享库

\`\`\`
ImportError: libnvinfer.so.8: cannot open shared object file: No such file or directory
\`\`\`

解决方案：添加库路径到LD_LIBRARY_PATH
\`\`\`bash
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib/python3.8/dist-packages/tensorrt/
\`\`\`

#### 2.2 层不支持

\`\`\`
[TensorRT] ERROR: Layer not supported
\`\`\`

这通常意味着你的模型包含TensorRT不支持的操作。解决方案包括：
- 使用自定义插件
- 修改模型结构
- 使用最新版本的TensorRT`,
        excerpt: '本文记录了在使用TensorRT部署深度学习模型时遇到的各种问题和解决方案，帮助初学者避开常见陷阱。',
        author: 'Sakura',
        publishDate: '2023-07-10',
        tags: ['深度学习习', '模型部署', 'PyTorch', 'TensorRT'],
        category: '深度学习',
        coverImage: 'https://picsum.photos/800/600?random=3',
        slug: 'tensorrt-pitfalls-and-solutions'
    },
    {
        id: '4',
        title: 'SQL简明手册进阶篇',
        content: `在上一篇《SQL简明手册基础篇》中，我们介绍了SQL的基本语法和常用命令。本篇将进一步探讨一些进阶概念和技巧。

### 1. 高级连接操作

除了基本的INNER JOIN和LEFT/RIGHT JOIN，SQL还提供了：

#### FULL OUTER JOIN
返回两个表中的所有记录，即使它们没有匹配项：

\`\`\`sql
SELECT * FROM employees
FULL OUTER JOIN departments
ON employees.department_id = departments.id;
\`\`\`

#### CROSS JOIN
生成两个表的笛卡尔积：

\`\`\`sql
SELECT * FROM employees
CROSS JOIN departments;
\`\`\`

### 2. 窗口函数

窗口函数允许你在查询中对结果集进行分区处理：

\`\`\`sql
SELECT 
    name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as salary_rank
FROM employees;
\`\`\`

### 3. 公用表表达式(CTE)

使用WITH子句创建临时结果集：

\`\`\`sql
WITH high_salary_employees AS (
    SELECT * FROM employees WHERE salary > 50000
)
SELECT * FROM high_salary_employees
WHERE department = 'Engineering';
\`\`\``,
        excerpt: '本文介绍SQL进阶知识，包括高级连接操作、窗口函数、公用表表达式等概念，帮助读者提升数据库查询和管理技能。',
        author: 'Sakura',
        publishDate: '2021-02-18',
        tags: ['数据库', 'SQL', '编程'],
        category: '数据库',
        coverImage: 'https://picsum.photos/800/600?random=4',
        slug: 'sql-advanced-handbook'
    },
    {
        id: '5',
        title: '从零开始学习React Hooks',
        content: `React Hooks是React 16.8引入的特性，它允许我们在函数组件中使用状态和其他React特性。本文将从零开始介绍React Hooks的基本概念和使用方法。

### useState: 状态管理的基础

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### useEffect: 处理副作用

useEffect允许我们在函数组件中执行副作用操作：

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
    
    // 清理函数
    return () => {
      document.title = 'React App';
    };
  }, [count]); // 仅在count更改时重新执行
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\``,
        excerpt: '本文从零开始介绍React Hooks的基本概念和使用方法，包括useState、useEffect等核心Hook的详细讲解和实例。',
        author: 'Sakura',
        publishDate: '2022-05-15',
        tags: ['React', '前端', 'JavaScript', 'Hooks'],
        category: '前端开发',
        coverImage: 'https://picsum.photos/800/600?random=5',
        slug: 'learn-react-hooks-from-scratch'
    }
]
