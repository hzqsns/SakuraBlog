



---
title: 循环变量与闭包
excerpt: '本文探讨几种常见编程语言中的循环变量行为，以及如何避免相关的陷阱。主要关注的是循环变量与闭包结合时的行为。'
author: 'Sakura',
publishDate: '2024-02-20',
coverImage: 'https://picsum.photos/800/600?random=1',
slug: 'loop-variables-and-closures'
date: 2021-02-17 20:15:08
tags:
- 编程语言
- 闭包
- Go
- JavaScript
category: 
- 编程
---

起因在于2023年9月19日，Go发布的1.22版本，修复了循环变量重用问题。最近在用其他语言写代码时，也遇到了类似的问题。于是意识到不同的编程语言对待循环变量的方式有所不同。

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

\`\`\`
