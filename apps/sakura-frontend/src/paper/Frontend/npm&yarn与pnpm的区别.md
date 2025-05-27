---
title: npm&yarn与pnpm的区别
excerpt: '' 
author: Sakura
publishDate: '2023-12-02'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/127129537_p0_master1200.jpg' 
slug: 'frontend-npm-pnpm'
date: 2023-12-02 21:26:00
tags:
  - pnpm
category:
  - 前端
---

<center>npm -- 先锋</center>

[![](http://www.hzqsns.com/wp-content/uploads/2023/02/wp_editor_md_419e1059e2934e95ae628cd63bddb677.jpg)](http://www.hzqsns.com/wp-content/uploads/2023/02/wp_editor_md_419e1059e2934e95ae628cd63bddb677.jpg)

  2010 年 1 月，一款名为 npm 的包管理器诞生。
  很多人认为 npm 是 node package manager 的缩写，其实不是，而且 npm 根本也不是任何短语的缩写。
  它的前身其实是名为 pm（pkgmakeinst） 的 bash 工具，它可以在各种平台上安装各种东西。
  硬要说缩写的话，也应该是 node pm 或者 new pm。

<font color=red>嵌套的 node_modules 结构</font>

  npm 在早期采用的是嵌套的 node_modules 结构，直接依赖会平铺在 node_modules 下，子依赖嵌套在直接依赖的 node_modules 中。

  比如项目依赖了A 和 C，而 A 和 C 依赖了不同版本的 B@1.0 和 B@2.0，node_modules 结构如下：
```cpp
node_modules
├── A@1.0.0
│   └── node_modules
│       └── B@1.0.0
└── C@1.0.0
    └── node_modules
        └── B@2.0.0
```

  如果 D 也依赖 B@1.0，会生成如下的嵌套结构：
```cpp
node_modules
├── A@1.0.0
│   └── node_modules
│       └── B@1.0.0
├── C@1.0.0
│   └── node_modules
│       └── B@2.0.0
└── D@1.0.0
    └── node_modules
        └── B@1.0.0
```
  可以看到同版本的 B 分别被 A 和 D 安装了两次。

  在真实场景下，依赖增多，冗余的包也变多，node_modules 最终会堪比黑洞，很快就能把磁盘占满。而且依赖嵌套的深度也会十分可怕，这个就是依赖地狱。

<font color=red>Dependency Hell 依赖地狱问题</font>

  现在项目里有两个依赖A和C，A和C分别依赖B的不同版本，如何处理

[![](http://www.hzqsns.com/wp-content/uploads/2023/02/wp_editor_md_3cbc922bf1c8aa71f3b052bfbfcba828.jpg)](http://www.hzqsns.com/wp-content/uploads/2023/02/wp_editor_md_3cbc922bf1c8aa71f3b052bfbfcba828.jpg)

　　  这里存在两个问题：

　　  1. 首先是B本身支持多版本共存，只要B本身没有副作用，这是很自然的，但是对于很多库如core-js会污染全局环境，本身就不支持多版本共存，因此我们需要尽早的进行报错提示（conflict的warning和运行时的conflict的check）

　　  2. 如果B本身支持多版本共存，那么需要保证A正确的加载到B v1.0和C正确的加载到B v2.0

　　  我们重点考虑第二个问题：node的解决方式是<font color=red>**依赖的node加载模块的路径查找算法和node_modules的目录结构来配合解决的**</font>

　　  如何从node_modules加载package？

　　  核心是递归向上查找node_modules里的package，如果在 '/home/ry/projects/foo.js' 文件里调用了 require('bar.js')，则 Node.js 会按以下顺序查找：

  /home/ry/projects/node_modules/bar.js
  /home/ry/node_modules/bar.js
  /home/node_modules/bar.js
  /node_modules/bar.js
　　  该算法有两个核心：（1）优先读取最近的node_modules的依赖（2）递归向上查找node_modules的依赖

　　  该算法即简化了 Dependency hell 的解决方式，也带来了非常多的问题。

扁平的 node_modules 结构<font color=red></font>
  为了将嵌套的依赖尽量打平，避免过深的依赖树和包冗余，npm v3 将子依赖「提升」(hoist)，采用扁平的 node_modules 结构，子依赖会尽量平铺安装在主依赖项所在的目录中。
```cpp
node_modules
├── A@1.0.0
├── B@1.0.0
└── C@1.0.0
    └── node_modules
        └── B@2.0.0
```

  可以看到 A 的子依赖的 B@1.0 不再放在 A 的 node_modules 下了，而是与 A 同层级。

  而 C 依赖的 B@2.0 因为版本号原因还是嵌套在 C 的 node_modules 下。

  这样不会造成大量包的重复安装，依赖的层级也不会太深，解决了依赖地狱问题，但也形成了新的问题。

幽灵依赖 Phantom dependencies
  幽灵依赖是指在 package.json 中未定义的依赖，但项目中依然可以正确地被引用到。

比如上方的示例其实我们只安装了 A 和 C：
```cpp
{
  "dependencies": {
    "A": "^1.0.0",
    "C": "^1.0.0"
  }
}
```

  由于 B 在安装时被提升到了和 A 同样的层级，所以在项目中引用 B 还是能正常工作的。

  幽灵依赖是由依赖的声明丢失造成的，如果某天某个版本的 A 依赖不再依赖 B 或者 B 的版本发生了变化，那么就会造成依赖缺失或兼容性问题。

<font color=red>不确定性 Non-Determinism</font>
  不确定性是指：同样的 package.json 文件，install 依赖后可能不会得到同样的 node_modules 目录结构。

  还是之前的例子，A 依赖 B@1.0，C 依赖 B@2.0，依赖安装后究竟应该提升 B 的 1.0 还是 2.0。
```cpp
node_modules
├── A@1.0.0
├── B@1.0.0
└── C@1.0.0
    └── node_modules
        └── B@2.0.0
```

```cpp
node_modules
├── A@1.0.0
│   └── node_modules
│       └── B@1.0.0
├── B@2.0.0
└── C@1.0.0
```

  取决于用户的安装顺序。

  如果有 package.json 变更，本地需要删除 node_modules 重新 install，否则可能会导致生产环境与开发环境 node_modules 结构不同，代码无法正常运行。

<font color=red>依赖分身 Doppelgangers</font>
  假设继续再安装依赖 B@1.0 的 D 模块和依赖 @B2.0 的 E 模块，此时：

  A 和 D 依赖 B@1.0
  C 和 E 依赖 B@2.0
  以下是提升 B@1.0 的 node_modules 结构：
```cpp
node_modules
├── A@1.0.0
├── B@1.0.0
├── D@1.0.0
├── C@1.0.0
│   └── node_modules
│       └── B@2.0.0
└── E@1.0.0
    └── node_modules
        └── B@2.0.0
```

  可以看到 B@2.0 会被安装两次，实际上无论提升 B@1.0 还是 B@2.0，都会存在重复版本的 B 被安装，这两个重复安装的 B 就叫 doppelgangers。

  而且虽然看起来模块 C 和 E 都依赖 B@2.0，但其实引用的不是同一个 B，假设 B 在导出之前做了一些缓存或者副作用，那么使用者的项目就会因此而出错。

-----------------

<center>yarn -- 创新</center>

[![](http://www.hzqsns.com/wp-content/uploads/2023/02/wp_editor_md_268bb7f8fb76c1d947dbf313631ce2b8.jpg)](http://www.hzqsns.com/wp-content/uploads/2023/02/wp_editor_md_268bb7f8fb76c1d947dbf313631ce2b8.jpg)

  2016 年，yarn 发布，yarn 也采用扁平化 node_modules 结构。它的出现是为了解决 npm v3 几个最为迫在眉睫的问题：依赖安装速度慢，不确定性。

<font color=red>提升安装速度</font>
  在 npm 中安装依赖时，安装任务是串行的，会按包顺序逐个执行安装，这意味着它会等待一个包完全安装，然后再继续下一个。

  为了加快包安装速度，yarn 采用了并行操作，在性能上有显著的提高。而且在缓存机制上，yarn 会将每个包缓存在磁盘上，在下一次安装这个包时，可以脱离网络实现从磁盘离线安装。

<font color=red>lockfile 解决不确定性</font>
  yarn 更大的贡献是发明了 yarn.lock。

  在依赖安装时，会根据 package.josn 生成一份 yarn.lock 文件。

  lockfile 里记录了依赖，以及依赖的子依赖，依赖的版本，获取地址与验证模块完整性的 hash。

  即使是不同的安装顺序，相同的依赖关系在任何的环境和容器中，都能得到稳定的 node_modules 目录结构，保证了依赖安装的确定性。

  所以 yarn 在出现时被定义为快速、安全、可靠的依赖管理。而 npm 在一年后的 v5 才发布了 package-lock.json。

<font color=red>与 npm 一样的弊端</font>
  yarn 依然和 npm 一样是扁平化的 node_modules 结构，没有解决幽灵依赖和依赖分身问题。

------------------------
<center>pnpm -- 后浪</center>

  pnpm 由 zkochan 开发，最初也是在用 npm 或者 yarn 遇到了一些不爽的地方，于是自己做了一个开源的包管理器，也为优化包管理提供了一种不同的新思路

<font color=red>为什么会有 pnpm</font>

  一句话概括就是：节约磁盘空间并提升安装速度。

  设想一下，假如公司的每个项目都用了 vue 全家桶，那么每个项目都需要安装 vue、vue-router、vuex、axios 等几乎相同的库，如果有 100 个项目，那就要重复安装 100 遍！！，要知道，现如今，硬盘虽然便宜，但也没那么多插槽啊，更别说笔记本电脑这寸土寸金的资源空间。

  因此，pnpm 的核心就是将所有的包都存放在一个资源仓库中，而每个项目的 node_modules 通过软链接的形式将包链接到资源仓库中，这样不仅节省了空间，同时也加快了安装速度

<font color=red>不止于此</font>
  pnpm 的另一个优点，在保留了非扁平化的 node_modules 文件夹，同时节省了空间

  简单回顾一下 npm 的发展历史

  1.最初，npm 只是简单的通过依赖去递归的安装包，所有的依赖放在相应的包文件夹下面，假如 A 依赖了 foo，B 也依赖了 foo，那么就会有两份 foo 安装在 node_modules
```cpp
node_modules
├── A
│   └── node_modules
│       └── foo
└── B
    └── node_modules
        └── foo
```
  2.经过一次优化， npm 为了节省空间，采用了扁平化的 node_modules，这样，假如 A 和 B 都依赖了 foo，那么 foo 会提升至顶层，也就是说 node_modules 文件夹里的包会变成 A、B、foo
```cpp
node_modules
├── A
├── B  
└── foo
```

  这样的好处是，同一个包 foo 只会有一份，节省了空间，但是引入了一个新的问题，引用混乱！！。

  试想一下，我们的项目依赖本来只有 A 和 B，假如你想 import foo，肯定是找不到的，但是扁平化的结果，将 A 和 B 的依赖层级提升到了顶级，这样，我们直接引用 foo，其实也不会报错，但实际上我们并没有指定依赖 foo，导致了使用上的混乱，假如有一天，A 和 B 都不依赖于 foo 了，那我们的项目或者说我提供的包就会报错

> 这个不良的行为其实已经默默的融入我们的开发中，当我们使用 ant-design 时，我们可以直接使用 moment，当我们使用 axios 时，我们可以直接使用 qs，当我们使用 webpack 时，我们可以直接使用 lodash，而无需额外的安装包

<font color=red>内容寻址存储</font>
  与依赖提升和扁平化的 node_modules 不同，pnpm 引入了另一套依赖管理策略：内容寻址存储。

  该策略会将包安装在系统的全局 store 中，依赖的每个版本只会在系统中安装一次。

  在引用项目 node_modules 的依赖时，会通过硬链接与符号链接在全局 store 中找到这个文件。为了实现此过程，node_modules 下会多出 .pnpm 目录，而且是非扁平化结构。

  <font color=blue>硬链接 Hard link：</font>硬链接可以理解为源文件的副本，项目里安装的其实是副本，它使得用户可以通过路径引用查找到全局 store 中的源文件，而且这个副本根本不占任何空间。同时，pnpm 会在全局 store 里存储硬链接，不同的项目可以从全局 store 寻找到同一个依赖，大大地节省了磁盘空间。

  <font color=blue>符号链接 Symbolic link：</font>也叫软连接，可以理解为快捷方式，pnpm 可以通过它找到对应磁盘目录下的依赖地址。

  还是使用上面 A，B，C 模块的示例，使用 pnpm 安装依赖后 node_modules 结构如下：
```cpp
node_modules
├── .pnpm
│   ├── A@1.0.0
│   │   └── node_modules
│   │       ├── A => <store>/A@1.0.0
│   │       └── B => ../../B@1.0.0
│   ├── B@1.0.0
│   │   └── node_modules
│   │       └── B => <store>/B@1.0.0
│   ├── B@2.0.0
│   │   └── node_modules
│   │       └── B => <store>/B@2.0.0
│   └── C@1.0.0
│       └── node_modules
│           ├── C => <store>/C@1.0.0
│           └── B => ../../B@2.0.0
│
├── A => .pnpm/A@1.0.0/node_modules/A
└── C => .pnpm/C@1.0.0/node_modules/C
```
  `<store>/xxx` 开头的路径是硬链接，指向全局 store 中安装的依赖。

  其余的是符号链接，指向依赖的快捷方式。

  pnpm 官方图片也清晰地解释了这套机制：
[![](http://www.hzqsns.com/wp-content/uploads/2023/02/wp_editor_md_50207a1a9fd8770f86b9b511af4c8f1d.jpg)](http://www.hzqsns.com/wp-content/uploads/2023/02/wp_editor_md_50207a1a9fd8770f86b9b511af4c8f1d.jpg)

<font color=red>未来可期</font>
  这套全新的机制设计地十分巧妙，不仅兼容 node 的依赖解析，同时也解决了：

  <font color=blue>幽灵依赖问题：</font>只有直接依赖会平铺在 node_modules 下，子依赖不会被提升，不会产生幽灵依赖。
  <font color=blue>依赖分身问题：</font>相同的依赖只会在全局 store 中安装一次。项目中的都是源文件的副本，几乎不占用任何空间，没有了依赖分身。
  同时，由于链接的优势，pnpm 的安装速度在大多数场景都比 npm 和 yarn 快 2 倍，节省的磁盘空间也更多。

  但也存在一些弊端：

  由于 pnpm 创建的 node_modules 依赖软链接，因此在不支持软链接的环境中，无法使用 pnpm，比如 Electron 应用。
  因为依赖源文件是安装在 store 中，调试依赖或 patch-package 给依赖打补丁也不太方便，可能会影响其他项目。


<font color=red>最后举例分析一下pnpm 的 node_modules</font>
```cpp
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>/bar
    └── foo@1.0.0
        └── node_modules
            ├── foo -> <store>/foo
            └── bar -> ../../bar@1.0.0/node_modules/bar
```
  我们分析一下这个目录结构：

  包都是从 store 软链接而来
  项目直接使用的包只有一个 foo，保证了只有依赖项中的包才能访问
  有个隐藏的文件夹 .pnpm，这里将所有的依赖进行扁平化，这样避免了循环符号链接，同时 foo 还能引用自己

  如果添加 qar@2.0.0 作为 bar 和 foo 的依赖项，那么结果会变成
```cpp
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       ├── bar -> <store>/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    ├── foo@1.0.0
    │   └── node_modules
    │       ├── foo -> <store>/foo
    │       ├── bar -> ../../bar@1.0.0/node_modules/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    └── qar@2.0.0
        └── node_modules
            └── qar -> <store>/qar
```
