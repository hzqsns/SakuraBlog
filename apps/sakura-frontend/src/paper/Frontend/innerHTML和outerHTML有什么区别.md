---
title: innerHTML和outerHTML有什么区别？
excerpt: '' 
author: Sakura
publishDate: '2023-08-25'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/128345777_p0_master1200.jpg' 
slug: 'frontend-innerHTML-outerHTML'
date: 2023-08-25 19:44:00
tags:
  - HTML
category:
  - 前端
---

<!-- wp:list -->
<ul><li>innerHTML<ul><li>从对象的起始位置到终止位置的全部内容, 不包括HTML标签。</li></ul></li><li>outerHTML<ul><li>除了包含innerHTML的全部内容外, 还包含对象标签本身。</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:list -->
<ul><li><code>outerHTML</code> 是一个 JavaScript 属性，允许你获取和设置元素的 HTML。例如，如果你有一个如下的 HTML 标签，那么使用 <code>outerHTML</code> 属性你会得到 <code>&lt;div> &lt;/div></code> 作为输出</li></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;div>Hello,World&lt;/div></code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><li>如果 <code>div</code> 具有 <code>class</code> 或 <code>id</code> 之类的属性，你将使用 HTML 获得所有此类详细信息。<code>outerHTML</code> 用于返回或设置元素的 HTML。</li><li>与此相反的是 <code>innerHTML</code> 属性，它设置或返回标签中存在的文本。在这种情况下，<code>innerHTML</code> 属性将返回包含在 <code>div</code> HTML 标记中的单词<strong>Hello,World</strong></li></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>举例</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>我们在 <code>div</code> 元素中添加了一些文本。首先，我们将看到如何使用 <code>outerHTML</code> 属性获取上述元素的 HTML，然后我们将看到如何用不同的 HTML 元素替换或设置这个 HTML <code>div</code></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>在 JavaScript 中使用 outerHTML 获取元素的 HTML</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>要获取 <code>div</code> 元素的 HTML，我们首先必须使用其 <code>class</code> 属性将 <code>div</code> 的引用存储在 JavaScript 代码中，并使用 <code>getElementsByClassName()</code> 方法，这是 DOM API 的一部分</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;!DOCTYPE html>
&lt;html>
    &lt;body>
        &lt;div class="oldElement">This is an old element.&lt;/div>
    &lt;/body>

    &lt;script>
        let oldElement = document.getElementsByClassName('oldElement')&#91;0];
        console.log(oldElement.outerHTML)
    &lt;/script>
&lt;/html></code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>由于我们使用其类名访问元素，因此我们还必须在末尾使用&nbsp;<code>[0]</code>，因为&nbsp;<code>getElementsByClassName()</code>&nbsp;返回一个数组，因为我们的 DOM 中只有一个具有该类名的元素。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>因此，我们将访问数组的&nbsp;<code>[0]</code>&nbsp;元素。然后我们将该元素存储在&nbsp;<code>oldElement</code>&nbsp;变量中。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>要获取存储在&nbsp;<code>oldElement</code>&nbsp;变量中的该元素的 HTML，我们将在该变量上使用&nbsp;<code>outerHTML</code>，如上所示的代码在控制台上打印它。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>输出：</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":670,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/10/image-1024x235.png" alt="" class="wp-image-670"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>在 JavaScript 中使用 outerHTML 设置元素的 HTML</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>现在让我们看看如何为相同的&nbsp;<code>div</code>&nbsp;元素设置 HTML，我们已经使用&nbsp;<code>outerHTML</code>&nbsp;属性将其存储在&nbsp;<code>oldElement</code>&nbsp;变量中。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>我们将使用赋值 (<code>=</code>) 运算符；由于我们想为这个元素设置或赋值，我们将使用赋值（<code>=</code>）运算符。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><code>outerHTML</code> 只接受字符串形式的 HTML 元素。因此，我们使用 <code>outerHTML</code> 属性将 <code>h1</code> 标记作为包含一些文本的字符串分配给 <code>oldElement</code> 变量。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;!DOCTYPE html>
&lt;html>
     &lt;body>
         &lt;div class="oldElement">This is an old element.&lt;/div>
     &lt;/body>

     &lt;script>
         let oldElement = document.getElementsByClassName('oldElement')&#91;0];
         oldElement.outerHTML = "&lt;h1>This is an new element.&lt;/h1>";
     &lt;/script>
&lt;/html></code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>这将用这个新的 HTML 元素替换整个&nbsp;<code>div</code>&nbsp;元素及其值。如果你查看 DOM 树，你会看到&nbsp;<code>div</code>&nbsp;HTML 元素已替换为&nbsp;<code>h1</code>&nbsp;HTML 元素。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>有关详细信息，请参见下图。</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":671,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/10/image-1-1024x403.png" alt="" class="wp-image-671"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>结论</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>要获取任何元素的 HTML，我们使用 <code>outerHTML</code> 属性。此属性返回元素的外部 HTML。它可以用一个新的 HTML 元素替换一个 HTML 元素，只是将新的 HTML 元素作为字符串绕过该属性。</p>
<!-- /wp:paragraph -->
