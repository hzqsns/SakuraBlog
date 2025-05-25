---
title: 如何理解HTML的语义化？
excerpt: '' 
author: Sakura
publishDate: '2022-04-20'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/114090843_p0_master1200.jpg' 
slug: 'frontend-semantization'
date: 2022-04-20 18:22:00
tags:
  - 语义化
  - HTML
category:
  - 前端
---

<!-- wp:heading -->
<h2>Web 语义化</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>说起 HTML 语义化，我们可以先来聊聊 Web 语义化，而所谓 Web 语义化，事实上就是<strong>使用恰当语义的 HTML 标签和 CSS class 等内容，让页面具有良好的语义和结构，从而方便人类和机器都能快速理解网页内容</strong>，其核心内容可以总结为以下 4 点：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>用正确的标签做正确的事情</li><li>页面内容结构化</li><li>无 CSS 时也能进行网页阅读</li><li>方便浏览器，搜索引擎解析，利于 SEO</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>知道了 Web 语义化，我们也就可以来谈谈 HTML 语义化了。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>HTML 语义化</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>HTML 语义化的核心是<strong>反对大篇幅的使用无语义化的 div + css + span，而鼓励使用 HTML 定义好的语义化标签</strong>。那么我们应该关心的就是标签的语义以及应该是用的场景。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>header</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>header 代表网页或 section 的页眉，通常需要包含 h1~h6 或者 hgroup。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>（tip：虽然 w3c 规范中认为 header 在一个页面中可以存在一个或者多个，但是通常要头部结构信息较为复杂，包含多个导航和菜单的内容，才适合使用 header 进行包裹。）</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>hgroup</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>hgroup 代表网页或 section 的标题组，通常只有同时拥有多个 h1~h6 的时候，才会使用 hgroup 将 h1~h6 包裹起来。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>footer</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>footer 代表网页或 section 的页脚。通常包含一些基本信息，如：作者、相关文档链接、版权资料等。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>nav</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>代表页面的导航链接区域。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>（tip：规范中认为 nav 只适用于页面主要导航部分。）</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>article</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>代表一个在网页中自成一体的内容，其目的是为了方便开发者独立开发或重。通常需要包含一个 header/h1~h6 和一个 footer。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>（tip：如果在 article 内部再嵌套 article，那就代表内嵌的 article 是与它外部的内容有关联的，比如文章下面的评论。）</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>section</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>代表文档中的“节”或“段”。通常需要包含 h1~h6。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>（tip：虽然 html5 中会对 section 的标题自动降级，但建议手动对其进行降级。）</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>aside</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>代表一块独立的内容区域。通常使用分为两种情况：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>在 article 中：作为主要内容的附属内容</li><li>在 article 外：最典型的应用是侧边栏</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>到这里，相信已经将 HTML 语义化大致讲清楚了。我们接下来聊聊 CSS 语义化。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>CSS 语义化</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>如果说 HTML 语义化是给机器看的，那么 CSS 命名的语义化就是给人看的。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>在通常的开发中，CSS 命名首先要满足 W3C 的命名规范和团队的命名规范，其次是高效和可重用性。到这里，出现了一个矛盾点，见代码：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;div class="page"&gt;
  &lt;div class="header"&gt;
    &lt;div class="header-title" title-levle="1"&gt;Page Title&lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="content"&gt;
    &lt;div class="artical"&gt;
      &lt;div class="artical-title"&gt;Artical Title&lt;/div&gt;
      &lt;div class="artical-txt"&gt;
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, quisquam animi. Placeat
        dicta alias natus quibusdam quia corrupti quos nesciunt odio, cumque iste. Minima odio
        perspiciatis fuga dolorum sint maiores!
      &lt;/div&gt;
      &lt;div class="artical-footer"&gt;
        author:xxx
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="footer"&gt;
    Contact:123123
  &lt;/div&gt;
&lt;/div&gt;
复制代码</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上述代码，class 结构清晰，相信对于开发者来说，一定能够快速理解网页结构。那么日常开发中是否只要规范 class 命名就可以了？</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>事实上这样是不行的，前面已经提到过了，HTML 语义化主要是给机器看的，上述代码对于浏览器和搜索引擎来说，就是一堆毫无语义的 div 而已，非常不利于 SEO。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>所以在日常开发中，一定要同时关注 HTML 和 CSS 语义化，当然大量的使用 div + css + span 同样能完成工作，但这也会显得我们开发人员并没有什么职业素养。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>拓展：ARIA</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ARIA 即 Accessible Rich Internet Application，中文译为无障碍富互联网应用。其主要目的是为一些有功能障碍（如听力，视力）的人群通过屏幕阅读器例如 voiceover 等，提供无障碍访问动态、可交互Web内容。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>其中应用于 HTML 的有两个关键属性：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>role：标识了一个元素的作用</li><li>aria-*：描述了与之有关的事物特征及其状态</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->