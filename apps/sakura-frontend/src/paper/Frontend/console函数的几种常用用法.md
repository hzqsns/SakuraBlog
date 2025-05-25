---
title: console函数的几种常用用法
excerpt: '' 
author: Sakura
publishDate: '2022-12-31'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/130081677_p0_master1200.jpg' 
slug: 'frontend-console'
date: 2022-12-31 19:02:00
tags:
  - console
category:
  - JavaScript
---

<!-- wp:paragraph -->
<p>学习前端开发时，几乎最先学习的就是<code>console.log()</code>。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>毕竟多数人的第一行代码都是：<code>console.log('Hello World');</code></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><code>console</code>对象提供了对于浏览器调试控制台的访问，可以从任何全局对象中访问到console对象。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>灵活运用<code>console</code>对象所提供的方法，可以让开发变得更简单。<br></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>常见控制台的几种方法</h2>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>console.log()– 打印内容的通用方法。
-支持的占位符格式如下：
    -字符串：%s
    -整数：%d
    -浮点数：%f
    -对象：%o或%O
    -CSS样式：%c
console.info()– 打印资讯类说明信息。
console.debug()– 在控制台打印一条 "debug" 级别的消息。
console.warn()– 打印一个警告信息。
-它的用法和console.log是完全一样的，只是显示的样式不太一样，信息最前面加一个黄色三角，表示警告
console.error()– 可以用于在控制台输出错误信息</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>console.dir()</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>使用<code>console.dir()</code>可以打印对象的属性，在控制台中逐级查看对象的详细信息。</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":464,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/05/image-8.png" alt="" class="wp-image-464"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>console.trace();</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><code>console.trace()</code>方法将堆栈跟踪输出到控制台。</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":465,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/05/image-9.png" alt="" class="wp-image-465"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>console.table();</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>在<code>console</code>中还可以打印表格</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":466,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/05/image-10.png" alt="" class="wp-image-466"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":467,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/05/image-11.png" alt="" class="wp-image-467"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>console.time() &amp; console.timeEnd()</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>如果我们想要获取一段代码的执行时间，就可以使用console对象的console.time() 和console.timeEnd()方法，来看下面的例子：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>console.time();

setTimeout(() => {
	console.timeEnd();
}, 1000);

// default: 1015.27294921875 ms</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>它们都可以传递一个参数，该参数是一个字符串，用来标记唯一的计时器。如果页面只有一个计时器时，就不需要传这个参数 ，如果有多个计时器，就需要使用这个标签来标记每一个计时器：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>console.time("timer1");
console.time("timer2");

setTimeout(() => {
	console.timeEnd("timer1");
}, 1000);

setTimeout(() => {
	console.timeEnd("timer2");
}, 2000);

//timer1: 1002.89599609375 ms
//timer2: 2002.27880859375 ms
</code></pre>
<!-- /wp:code -->