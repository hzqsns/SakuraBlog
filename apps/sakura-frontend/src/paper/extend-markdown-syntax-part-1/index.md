---
title: 给你的Markdown扩展新语法吧：上篇
excerpt: '本文介绍如何基于remark.js为Markdown扩展新的语法功能，适用于Astro.js、Gatsby.js等现代前端框架。'
author: 'Sakura'
publishDate: '2023-07-29'
coverImage: 'https://picsum.photos/800/600?random=2'
slug: 'extend-markdown-syntax-part-1'
date: 2023-07-29 15:30:00
tags:
    - 前端
    - Markdown
    - Remark
    - Unified
category:
    - 前端开发
---

注意 这篇文章仅适用于基于 remark.js 的 Markdown，如 Astro.js、Gatsby.js 等等。
如果你正在使用 MDX 那么这篇文章或许也适用于你。嗯，今天我们谈聊一下怎么给你的 Markdown 扩展新的语法。

### 为什么需要扩展 Markdown 语法？

原始的 Markdown 语法虽然简洁易用，但在某些特定场景下可能不够灵活。例如，你可能需要：

1. 添加自定义组件，如警告框、提示框
2. 支持更复杂的排版需求
3. 添加特殊的交互元素

通过扩展 Markdown 语法，我们可以在保持原有简洁性的同时，增加更多表现力。

### remark.js 简介

remark 是一个强大的 Markdown 处理工具，它允许我们：

-   解析 Markdown 为抽象语法树(AST)
-   操作这个 AST
-   将修改后的 AST 重新序列化为 Markdown 或 HTML
