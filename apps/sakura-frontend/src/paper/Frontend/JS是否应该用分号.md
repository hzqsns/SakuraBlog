---
title: JavaScript有关分号风格的讨论
excerpt: '' 
author: Sakura
publishDate: '2024-11-17'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/128924866_p0_master1200.jpg' 
slug: 'frontend-js-semicolon'
date: 2024-11-17 12:29:00
tags:
  - 代码风格
category:
  - 前端
---

## 使用还是不使用分号，这是一个问题

关于 JavaScript 中的分号（即 ;）的使用，社区中存在分歧。有些人在任何情况下都喜欢使用分号，而有些人则倾向于避免使用分号。

![尤大的看法](http://www.hzqsns.com/wp-content/uploads/2023/12/Snipaste_2023-12-27_12-32-41.png)

在我刚学前端的时候我也感觉有点困惑，因为之前一直用cpp，写完一行代码自动添加分号已经成为了习惯，但是前端又跟我说可以加分号也可以不加分号就让我很疑惑了，一开始我也是所有代码都加分号，因为很明显我潜意识里面觉得加了分号的代码肯定健壮性更强，直到后续我了解到了JavaScript有Automatic Semicolon Insertion (ASI)的机制。

但是这个机制还是没让我搞明白为什么那些后端语言比如cpp和Java之类，他们为什么没有这样的机制，但是我的直觉这个问题是历史遗留形成的，引用知乎大佬的分析印证了我的猜想：
![](http://www.hzqsns.com/wp-content/uploads/2023/12/Snipaste_2023-12-27_12-45-33.png)

因此，本篇文章借此机会全面介绍一下JavaScript的Automatic Semicolon Insertion (ASI)机制

## ASI中心思想

Automatic Semicolon Insertion (ASI)机制中心思想主要有三条：
1. 当程序包含一个形式语法不允许的标记时，如果(a)在该点有一个行结束符，或者(b)意外的标记是一个右花括号}或右括号)，则插入一个分号。
2. 当源文本从左到右解析时，遇到输入标记流的结尾，而解析器无法将输入标记流解析为目标非终结符的单个实例时，则自动在输入流的结尾插入一个分号。
3. 当遇到“受限生产”(return、break、continue、throw和++和——postfix操作符)并在语法中包含注释的地方包含行终止符时，则插入分号。

但是上面思想实在是不好理解，于是人们往往进一步分解成7条相关规则

## ASI规则

### Rule No1 当下一行是别的代码开始，打断了当前的代码（代码可以在多行上）
```javascript
// EXAMPLE
const sum = 5 + 5
(sum).toFixed(3)

// Is interpreted as:
const sum = 5 + 5(sum).toFixed(3);
// ReferenceError: Cannot access 'sum' before initialization

// JavaScript parser basically assumes
// that what we want to do is a function call
// i.e.: 5(sum), calling function 5 with parameter sum


// FIX:
const sum = 5 + 5;
(sum).toFixed(3)

// Is interpreted as:
const sum = 5 + 5;
sum.toFixed(3);


// Or
// EXAMPLE
const mishmash = 13 + 'world'

[13].length
// TypeError: Cannot read property 'length' of undefined

// Is interpreted as:
const mishmash = 13 + 'world'[13].length;

// JavaScript parser basically assumes
// that we want to know the length of character on 12th index


// FIX:
const mishmash = 13 + 'world';

[13].length
// ;[13].length <= or add a semicolon before opening bracket

// Is interpreted as:
const mishmash = 13 + 'world';

[13].length;


// Or
// EXAMPLE
const mishmash = 13 + 'world'

([13].length)
// TypeError: "world" is not a function

// Is interpreted as:
const mishmash = 13 + 'world'([13].length)


// FIX:
const mishmash = 13 + 'world'; // <= Add semicolon here

([13].length)
// ;([13].length) <= or add a semicolon before opening parenthesis

// Is interpreted as:
const mishmash = 13 + 'world';
([13].length);
```

### Rule No2. 当下一行以 } 开头，闭合当前块时
```javascript
// This is not valid, but ASI will intervene nonetheless
{ 0
 2 } 8

// Is interpreted as:
{ 0;
  2; } 8;


// Or, a valid example where ASI will also intervene
{ foo: 'barr' }

// Is interpreted as:
{ foo: 'barr'; }
```

### Rule No3. 当到达源代码文件的结尾时
```javascript
// EXAMPLE
const word = 'Hello'
const date = new Date().getFullYear()

console.log(`${word} from ${date}.`)

// Is interpreted as:
const word = 'Hello';
const date = new Date().getFullYear();
console.log(`${word} from ${date}.`); // <= Rule no.3
```
### Rule No4. 当有一个 return 语句在自己的行中出现时
```javascript
// EXAMPLE
function sayHi() {
  return
  'Hello!'
}

// Is interpreted as:
function sayHi() {
  return; // <= Rule no.4 - semicolon after return statement
  'Hello!';
}

// NOTE:
// JavaScript assumes that end of line
// where return statement is is also end of the statement


// FIX:
function sayHi() {
  return 'Hello!'
}

// Or even
// NOTE: this is not recommended
function sayHi() {
  return (
    'Hello!'
  )
}

// Both are interpreted as:
function sayHi() {
  return 'Hello!';
}


// Or
// EXAMPLE
function returnObj() {
  return
  {
    name: 'John'
  }
}

// Is interpreted as:
function returnObj() {
  return;
  {
    name: 'John';
  }
}


// FIX:
function returnObj() {
  return {
    name: 'John'
  }; // <= New end of return statement
}

// Or
// NOTE: this is not recommended
function returnObj() {
  return (
    {
      name: 'John'
    }
  )
}

// Both are interpreted as:
function returnObj() {
  return {
    name: 'John'
  }; // <= New end of return statement
}
```



### Rule No5. 当前行有一个 break 语句时
```javascript
// EXAMPLE
for (let idx = 6; idx > 0; idx--) {
  if (idx % 2 !== 0) {
    break
  }
}

// Is interpreted as:
for (let idx = 6; idx > 0; idx--) {
  if (idx % 2 !== 0) {
    break; // <= Rule no.5 - semicolon after break statement
  }
}
```



### Rule No6. 当前行中有一个 throw 语句时
```javascript
// EXAMPLE:
function getError(message) {
  if (typeof message !== 'string') {
    throw 'Error: Message must be string.'
  }
}

// Is interpreted as:
function getError(message) {
  if (typeof message !== 'string') {
    throw 'Error: Message must be string.'; // <= Rule no.6 - semicolon after throw statement
  }
}
```



### Rule No7. 当前行中有一个 continue 语句时
```javascript
// EXAMPLE
let x = 5
while (x > 0) {
  x--
  if (x % 2 === 0) {
    continue
  }

  console.log(x)
}

// Is interpreted as:
let x = 5;
while (x > 0) {
  x--;
  if (x % 2 === 0) {
    continue; // <= Rule no.7 - semicolon after continue statement
  }

  console.log(x);
}
```

## 关于ASI的常见误解


1. ASI会修改你的代码
这种误解可能是由于对自动插入分号的工作原理的错误理解造成的。ASI会直接修改你的代码，在代码中添加分号。事实并非如此。ASI不是这样工作的。当JavaScript解析器解析代码时，ASI会在必要的地方添加分号。也就是说，JavaScript解析器不会将这些更改保存在源代码中。当运行代码时，它被存储在内存中，而且会一直存储在那里，直到你终止代码或者垃圾回收完成它的工作。当这两种情况发生时，JavaScript解析器所做的任何更改都将消失。

2. 分号是可选的
一些JavaScript开发者认为分号是可选的。是也不是，在JavaScript语言中，分号是不可选的。**在某些特定情况下需要使用分号**。这些情况由我们上面讨论的规则定义。如果分号是可选的，则这些规则将不存在。如果这些规则不存在，自动插入分号将没有任何意义。这根本行不通。这些规则确实存在，ASI也能发挥作用。所以，这是不对的。因此，分号不是可选的。也就是说，分号在你和你的代码中是可选的（比如我们解构赋值交换变量，前面一般会添加一个分号）。JavaScript允许你决定是否使用它们。如果你决定不使用它们，JavaScript或ASI会在必要时添加它们。否则，它会让你的代码保持原样。那么，分号真的是可选的吗?和往常一样，唯一正确的答案是，这取决于不同人的不同观点。

3. 严格模式会关闭ASI
关于ASI的第3个误解是，设置为严格模式会关闭ASI。这是不存在的，你可以在代码中添加任意数量的` use strict `语句，ASI不会在意。您可以关闭或避免此功能的唯一方法是确保在所有需要它们的地方添加分号。当你这样做的时候，在需要的地方添加分号，分号的自动插入将不会介入。问题是你必须确切地知道在哪里放分号。一个解决办法是学习规则。第二种选择是到处使用分号。这样就很难在分号应该出现的地方漏掉它了。第三种解决方案是使用比如VScode上面那些比较著名的插件比如jshint、jslint和eslint。当遇到需要使用分号的情况时，有些工具会发出警告。

4. 到处使用分号更安全
最后一个常见的误解是，到处使用分号都更安全。这个想法是为了帮助你避免浏览器JavaScript引擎中的bug。这也可以保护你免受浏览器之间的兼容性问题。问题是，虽然这个想法在理论上可行，但在实践中却行不通。所有现有的浏览器都实现了关于ASI如何工作的JavaScript规范。更重要的是，JavaScript和浏览器JavaScript引擎已经存在很长一段时间了，任何可能存在的bug都已经消失很久了。这意味着你不必担心所有浏览器是否都兼容ASI。你只需要知道这一点。所有实现了JavaScript引擎的浏览器也遵循我们今天讨论的相同规则。此外，请记住ASI的这些规则是由JavaScript的创建者创建的。所以，不要担心缺少分号和ASI会导致bug。不会的。

## 不管有没有分号？

现在是回答开篇问题的时候了。是否应该使用分号?答案是视情况而定。这主要取决于你的个人偏好。你的JavaScript代码可以使用分号，也可以不使用分号。了解规则有助于我们认识到什么时候需要添加分号，什么时候不需要，从而调整编写代码的方式。例如，应该在一行中停止写return语句，而在另一行中停止写返回值。

此外，永远不要在一行开头加上括号。这可能会导致JavaScript解析器将语句与函数调用或数组引用混淆。如果确实需要在行开始处使用圆括号或方括号?在左括号或方括号之前添加一个分号。

除了这些特殊情况外，是否使用分号完全取决于你和你的偏好。


