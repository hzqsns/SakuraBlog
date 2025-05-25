---
title: 什么是 BFC？
excerpt: '' 
author: Sakura
publishDate: '2022-06-29'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/122183516_p0_master1200.jpg' 
slug: 'frontend-bfc'
date: 2022-06-29 18:28:00
tags:
  - CSS
category:
  - 前端
---

<!-- wp:heading -->
<h2>什么是 BFC？</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>BFC（Block Formatting Context），即块格式化上下文，在前端开发中也是一个老生常谈的问题了，我们首先来看看 MDN 对其的解释：</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>块格式化上下文（Block Formatting Context，BFC） 是 Web 页面的可视化 CSS 渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。</p></blockquote>
<!-- /wp:quote -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/17163034fc946e71~tplv-t2oaga2asx-watermark.awebp" alt="meme-01"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>（小声哔哔：听听，这是人说的话吗？）</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>上翻译机：事实上，BFC 的目的是<strong>形成一个相对于外界完全独立的空间，让内部的子元素不会影响到外部的元素。</strong></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>为什么会出现 BFC？</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>上面已经解释了什么是 BFC，它的作用是什么，那么为什么会出现 BFC 呢？</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>相信做过前端开发的同学都遇到过进行页面布局的时候，应该都有遇到过以下情况：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>这个元素高度怎么没了？</li><li>这两栏布局怎么没法自适应？</li><li>这两个元素的间距怎么有点奇怪的样子？</li><li>......</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>为什么会出现上面的情况呢？</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>究其原因就是因为元素之间相互的影响，导致了预料之外的情况。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>那么结合 BFC 的特性，答案就很明了了：BFC 是为了解决元素之间相互影响的问题的。所以 BFC 的功能是形成一个相对于外界独立的空间，让内部的子元素不会影响到外部元素。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>怎么创建 BFC？</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>我们知道了 BFC 是为了解决什么问题而出现的，那么怎么创建一个 BFC 呢？</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>当然，可以参考 <a target="_blank" href="https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FGuide%2FCSS%2FBlock_formatting_context" rel="noreferrer noopener">MDN</a>，但这实在是太难记了，通常我们只需要记住下面六种情况即可：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>float 不为 none</li><li>position 为 absolute 或 fixed</li><li>overflow 不为 visible</li><li>display 为 inline-block 或 table-cell</li><li>display 为 flex/inline-flex 的直接子元素</li><li>display 为 grid/inline-grid 的直接子元素</li></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>应用场景</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>父元素高度坍塌</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>我们知道，如果一个父元素里的子元素一旦设置了浮动，那么父元素就无法检测到子元素的高度，那么如果父元素里的所有子元素都浮动起来的话，父元素的高度就无法被子元素撑开，会塌陷下去，这个现象称为父元素高度塌陷。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>我们来看看代码：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;style&gt;
.futher&nbsp;{
&nbsp;&nbsp;padding:&nbsp;10px;
&nbsp;&nbsp;background-color:&nbsp;deepskyblue;
}

.child&nbsp;{
&nbsp;&nbsp;width:&nbsp;20px;
&nbsp;&nbsp;height:&nbsp;20px;
&nbsp;&nbsp;background-color:&nbsp;deeppink;
&nbsp;&nbsp;float:&nbsp;left;
}
&lt;/style&gt;
&lt;body&gt;
&lt;div&nbsp;class="futher"&gt;
&nbsp;&nbsp;&lt;div&nbsp;class="child"&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;/body&gt;
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>效果如下：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/17163524fa0b3dcc~tplv-t2oaga2asx-watermark.awebp" alt="img-01"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>显然，这并不是我们希望见到的情况，而通过 BFC 则能很好的解决这个问题：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>我们给父元素添加 <code>overflow: hidden</code>，效果如下：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/1716354014be5642~tplv-t2oaga2asx-watermark.awebp" alt="img-02"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>事实上，既然我们已经知道了父元素为什么塌陷，对于这个问题自然会有其他的解决方案：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>比如我们在子元素后面添加一个 <code>div</code>，用于清除浮动：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;style&gt;
.futher&nbsp;{
&nbsp;&nbsp;padding:&nbsp;10px;
&nbsp;&nbsp;background-color:&nbsp;deepskyblue;
}

.child&nbsp;{
&nbsp;&nbsp;width:&nbsp;20px;
&nbsp;&nbsp;height:&nbsp;20px;
&nbsp;&nbsp;background-color:&nbsp;deeppink;
&nbsp;&nbsp;float:&nbsp;left;
}

.clear-both&nbsp;{
&nbsp;&nbsp;clear:&nbsp;both;
}
&lt;/style&gt;
&lt;body&gt;
&lt;div&nbsp;class="futher"&gt;
&nbsp;&nbsp;&lt;div&nbsp;class="child"&gt;&lt;/div&gt;
&nbsp;&nbsp;&lt;div&nbsp;class="clear-both"&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;/body&gt;
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>当然，更好的写法可以利用伪元素：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>.child::after&nbsp;{
&nbsp;&nbsp;clear:&nbsp;both;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:heading {"level":3} -->
<h3>自适应布局</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>在日常的开发中，两栏自适应布局是非常常见的，通常一遍固定宽度，而另一边则随窗口自适应：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/17163601c7ff64ab~tplv-t2oaga2asx-watermark.awebp" alt="gif-01"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>对于上图，我们的实现通常是让左侧浮动起来，利用块会自动占满整个宽度的特性，实现右侧自适应。不过如果右侧高度大于了左侧，则会出现如下的尴尬情况：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/17163630f13e53a1~tplv-t2oaga2asx-watermark.awebp" alt="img-03"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>这个时候，利用 BFC，也能很好的解决问题：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/1716364157a2d024~tplv-t2oaga2asx-watermark.awebp" alt="img-04"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>同上一个场景，我们知道了出现问题地原因，那么通过别的方案，自然也能解决问题，比如设定一个安全的 margin-left：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>:root&nbsp;{
&nbsp;&nbsp;--safe-margin:&nbsp;100px;
}
.left&nbsp;{
&nbsp;&nbsp;width:&nbsp;var(--safe-margin);
&nbsp;&nbsp;height:&nbsp;50vh;
&nbsp;&nbsp;background-color:&nbsp;deeppink;
&nbsp;&nbsp;float:&nbsp;left;
}
.right&nbsp;{
&nbsp;&nbsp;margin-left:&nbsp;var(--safe-margin);
&nbsp;&nbsp;height:&nbsp;100vh;
&nbsp;&nbsp;background-color:&nbsp;deepskyblue;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:heading {"level":3} -->
<h3>外边距重叠（边界折叠）</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>还记得之前提到的边界折叠吗？</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>那里主要讲了父元素和子元素的重叠，这里讲一下兄弟之间的重叠。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>.one&nbsp;{
&nbsp;&nbsp;height:&nbsp;100px;
&nbsp;&nbsp;margin-bottom:&nbsp;100px;
&nbsp;&nbsp;background-color:&nbsp;deepskyblue;
}
.two&nbsp;{
&nbsp;&nbsp;height:&nbsp;100px;
&nbsp;&nbsp;margin-top:&nbsp;100px;
&nbsp;&nbsp;background-color:&nbsp;deeppink;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>知道边界折叠现象的我们应该清楚，这里两个元素之间的 margin 并不是 <code>(100 + 100 = 200)px</code>，而是取其中的大者（两者一样大）的 <code>100px</code>：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/171636f787a8c32e~tplv-t2oaga2asx-watermark.awebp" alt="img-05"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>对于这个问题，我们同样可以通过 BFC 来解决：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;style&gt;
*&nbsp;{
&nbsp;&nbsp;margin:&nbsp;0;
&nbsp;&nbsp;padding:&nbsp;0;
}
.one&nbsp;{
&nbsp;&nbsp;height:&nbsp;100px;
&nbsp;&nbsp;margin-bottom:&nbsp;100px;
&nbsp;&nbsp;background-color:&nbsp;deepskyblue;
}

.twp-wrap&nbsp;{
&nbsp;&nbsp;overflow:&nbsp;hidden;
}
.two&nbsp;{
&nbsp;&nbsp;height:&nbsp;100px;
&nbsp;&nbsp;margin-top:&nbsp;100px;
&nbsp;&nbsp;background-color:&nbsp;deeppink;
}
&lt;/style&gt;
&lt;body&gt;
&lt;div&nbsp;class="one"&gt;&lt;/div&gt;
&lt;div&nbsp;class="twp-wrap"&gt;
&nbsp;&nbsp;&lt;div&nbsp;class="two"&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;/body&gt;</code></pre>
<!-- /wp:code -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/171636ffb3126783~tplv-t2oaga2asx-watermark.awebp" alt="img-06"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->
