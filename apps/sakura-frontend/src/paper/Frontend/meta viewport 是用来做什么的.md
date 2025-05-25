---
title: meta viewport 是用来做什么的?
excerpt: '' 
author: Sakura
publishDate: '2022-05-14'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/125838165_p0_master1200.jpg' 
slug: 'frontend-meta'
date: 2022-05-14 18:24:00
tags:
  - HTML
category:
  - 前端
---

<!-- wp:paragraph -->
<p><strong>前置知识</strong>：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li><strong>设备像素（device pixels）</strong>：物理像素，显示器的最小物理单位。<br>这里的一个像素，并不一定是一个小正方形区块，也没有标准的宽高，知识用于显示丰富色彩的一个 “点” 而已。</li><li><strong>设备独立像素（device independent pixels）</strong>：独立于设备的像素。<br>有一个非严谨的说法，分辨率指的就是设备独立像素。可以通过 window.screen.width / window.screen.height 查看。平时我们所说的 iPhone X 逻辑分辨率 375 × 812 指的就是设备独立像素。chrome 检查元素模拟调试手机设备时显示如 375x667 和 320x480 都是设备独立像素。</li><li><strong>像素分辨率</strong>：以手机屏幕为例，iPhone X 像素分辨率为 1125 × 2436，是指屏幕横向能显示 1125 个物理像素点，纵向能显示 2436 个物理像素点。通常所说的 4K 显示屏指的是 4096 × 2160。</li><li><strong>PPI（pic per inch）</strong>：每英寸的物理像素数。以尺寸为 5.8 英寸（屏幕对角线长度）、分辨率为 1125 × 2436 的 iPhone X 为例， <code>ppi = Math.sqrt(1125*1125 + 2436*2436) / 5.8</code>，值为 463 ppi。</li><li><strong>CSS 像素</strong>：浏览器使用的单位，用来精确度量网页上的内容，如：<code>div { width: 100px; }</code>。在一般情况下(页面缩放比为 1)，1 个 CSS 像素等于 1 个设备独立像素。</li><li><strong>devicePixelRatio</strong>：设备物理像素和设备独立像素的比例。<code>window.devicePixelRatio = 物理像素 / 设备独立像素</code>。<br>当设备像素比的比率不为 1 时，CSS 像素和设备独立像素不再对应。所以如果页面放大 200%，1 个 CSS 像素等于 4 个设备独立像素。</li><li><strong>窗口尺寸（CSS 像素）</strong>：<br>包含滚动条：<code>window.innerWidth</code> | <code>window.innerHeight</code><br>不包含滚动条：<code>document.documentElement.clientWidth | document.documentElement.clientHeight</code></li><li><strong>获取 html 元素尺寸</strong>：<br><code>document.documentElement.offsetWidth</code> | <code>document.documentElement.offsetHeight</code></li><li><strong>CSS 中的 1px 并不等于设备的 1px</strong>：<br><strong>CSS 中的像素是一个抽象单位，在不同的设备或者不同的环境中，CSS 中的 1px 所代表的设备物理像素是不同的。</strong>在为桌面浏览器设计网页时，无需对此考虑太多(往往 CSS 中的一个像素就是对应着电脑屏幕的一个物理像素)，但是在移动设备上，必须搞清楚这一点。<br>1.在早先的移动设备中，屏幕像素密度都比较低，一个像素确实是等于一个屏幕物理像素；后来随着技术的发展，移动设备的屏幕像素密度越来越高，而我们的屏幕尺寸并没有增大多少，这就意味着差不多同样大小的屏幕上，像素多了一倍甚至不止一倍之多。<br>2.会引起不同的原因还可能是因为用户缩放，当用户将页面放大一倍，CSS 中的 1px 所代表的物理像素也会增加一倍。</li></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>viewport</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>移动设备上的 viewport 是设备屏幕上用来显示网页的那部分区域，再具体一点就是浏览器上用来显示网页的那部分区域，但 viewport 又不局限于浏览器可视区域的大小，它可能比浏览器的可视区域大，也可能比浏览器的可视区域小。在默认情况下，移动设备上的 viewport 都是大于浏览器可视区域的，这是因为移动设备的分辨率相对于PC来说都比较小，所以为了能在移动设备上正常显示那些为PC浏览器设计的网站，移动设备上的浏览器都会把自己默认的 viewport 设为 980px 或 1024px（也可能是其它值，由设备本身决定），但后果是浏览器出现横向滚动条，因为浏览器可视区域的宽度比默认的 viewport 的宽度小。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>荷兰前端大神 PPK 关于三个 viewport 的理论</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>移动设备上的浏览器认为自己必须能让所有的网站都正常显示，即使是那些并不为移动设备设计的网站。因为移动设备的屏幕都不是很宽，所以那些为桌面浏览器设计的网站放到移动设备上显示时，如果以浏览器的可视区域作为 viewport 的话，必然会因为移动设备的 viewport 太窄而挤作一团，甚至布局什么的都会乱掉。</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>现如今手机分辨率越来越高，比如：768×1024 甚至 1080×1920 等等，分辨率这么高，用来显示为桌面浏览器设计的网站有没有问题呢？答案是肯定的，在前面科普前置知识的时候，我们已经知道了，1px CSS 像素并不一定代表屏幕上的 1px，分辨率越大，CSS 中的 1px 代表的物理像素就会越多，devicePixelRatio 的值也越大。以为分辨率增大了，但是屏幕尺寸并没有变大多少，必须让 CSS 中的 1px 代表更多的物理像素，才能让 1px 的东西在屏幕上的大小与那些低分辨率的设备差不多，不然就会因为太小而看不清。</p></blockquote>
<!-- /wp:quote -->

<!-- wp:paragraph -->
<p>如果把移动设备上的浏览器的可视区域设为 viewport 的话，某些网站就会因为 viewport 太窄而显示错乱。所以在默认情况下，移动设备将 viewport 设为一个较宽的值，比如 980px，这样的话即使是那些为桌面浏览器设计的网站也能在移动设备浏览器显示正常了，这个默认的 viewport 值叫做 <strong>layout viewport</strong>。<code>document.documentElement.clientWidth</code></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>layout viewport 的宽度是大于浏览器可视区域宽度的，所以我们需要一个 viewport 来代表浏览器可视区域的大小：<strong>visual viewport</strong>。<code>window.innerWidth</code> Android 2,Oprea mini 和 UC 8 中无法获取。</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>移动网络普及大众，现在越来越多的网站都会为移动设备进行单独的设计，此时必须有一个能够完美适配移动设备的 viewport。</p></blockquote>
<!-- /wp:quote -->

<!-- wp:paragraph -->
<p>完美适配：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>不需要用户缩放以及滚动横向滚动条就能正常查看网站内容；</li><li>显示的文字大小合适，不会因为在一个高密度像素的屏幕显示得太小而无法看清（图片亦是如此）。</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>浏览器所需要的完美适配 viewport，PPK 将它称之为 <strong>ideal viewport</strong>（移动设备的理想 viewport）。它没有固定尺寸，因为它的宽度就是移动设备的屏幕宽度，不同的设备拥有不同的 ideal viewport。</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>无论在何种分辨率的屏幕下，针对 ideal viewport 设计的网站，不需要用户手动缩放，也不需要出现横向滚动条，都可以完美得将页面呈现给用户。</p></blockquote>
<!-- /wp:quote -->

<!-- wp:heading -->
<h2>meta viewport</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>要实现 ideal viewport ，需要用到 meta 标签。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>在 head 标签中加入 viewport 的 meta 标签：<em></em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"&gt;
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>该meta标签的作用是让当前viewport的宽度等于设备的宽度，同时不允许用户手动缩放。当然maximum-scale=1.0, user-scalable=0不是必需的，是否允许用户手动播放根据网站的需求来定，但把width设为width-device基本是必须的，这样能保证不会出现横向滚动条。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>meta viewport 的六个属性</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li><strong>width</strong>：控制 viewport 的大小，可以给它指定一个值(正整数)，或者是一个特殊的值(如：device-width 设备独立像素宽度，单位缩放为 1 时)；</li><li><strong>initial-scale</strong>：初始缩放比例，即当页面第一次加载时的缩放比例，为一个数字(可以带小数)；</li><li><strong>maximum-scale</strong>：允许用户缩放到的最大比例，为一个数字(可以带小数)；</li><li><strong>minimum-scale</strong>：允许用户缩放到的最小比例，为一个数字(可以带小数)；</li><li><strong>user-scalable</strong>：是否允许用户手动缩放，值为 "no"(不允许) 或 "yes"(允许)；<ul><li><strong>height</strong>：与 width 相对应(很少使用)。</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3>总结</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>meta viewport 是用于适配移动设备的，为了使不管是什么宽度的页面都能在移动设备端得到完美适配（不需要用户缩放和滚动横向滚动条并且字体图片等显示正常）。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>如果不知道设备的理想宽度就用特殊值 device-width，同时 initial-scale=1 来的到一个理想的 viewport (ideal viewport)。</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>实际上，现在市面上虽然有那么多不同种类不同品牌不同分辨率的手机，但它们的理想viewport宽度归纳起来无非也就 320、360、384、400等几种，都是非常接近的，理想宽度的相近也就意味着我们针对某个设备的理想viewport而做出的网站，在其他设备上的表现也不会相差非常多甚至是表现一样的。</p></blockquote>
<!-- /wp:quote -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->