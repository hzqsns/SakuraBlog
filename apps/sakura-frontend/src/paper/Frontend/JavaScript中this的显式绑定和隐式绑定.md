---
title: JavaScript中this的显式绑定和隐式绑定
excerpt: ''
author: Sakura
publishDate: '2022-08-27'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/130731902_p0_master1200.jpg'
slug: 'frontend-javascript-this'
date: 2022-08-27 18:37:00
tags:
    - this
category:
    - 前端
    - JavaScript
---

<!-- wp:paragraph -->
<p>&nbsp;javascript中的this和函数息息相关，所以今天，我就给大家详细地讲述一番：javascript函数中的this&nbsp;一谈到this，很多让人晕晕乎乎的抽象概念就跑出来了，<strong>这里我就只说最核心的一点——函数中的this总指向调用它的对象</strong>，接下来的故事都将围绕这一点展开<strong>（提醒前排的筒子们准备好茶水和西瓜，我要开始讲故事啦！！）</strong>&nbsp;&nbsp;【故事】有一个年轻人叫<strong>"迪斯"（this）,</strong>有一天，迪斯不小心穿越到一个叫<strong>&nbsp;“伽瓦斯克利”（javascript）</strong>的 异世界，此时此刻迪斯身无分文， 他首先要做的事情就是——找到他的住宿的地方<strong>——调用函数的对象</strong></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":399,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-47.png" alt="" class="wp-image-399"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>this的默认绑定</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>【故事——线路1】<strong>如果迪斯（this）直到天黑前都没有找到能收留自己的住所</strong>，他眼看就要过上非洲难民的生活， 这时候，<strong>一位乐善好施的魔法师村长——window</strong>救世主一般地出现了：先住在我家吧！</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":400,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-48.png" alt="" class="wp-image-400"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>&nbsp;【正文】<strong>当一个函数没有明确的调用对象的时候，也就是单纯作为独立函数调用的时候，将对函数的this使用默认绑定：绑定到全局的window对象</strong></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>function fire () {
&nbsp;&nbsp;&nbsp;&nbsp; console.log(this === window)
}
fire(); // 输出true</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面的例子我相信对大多数人都很简单，但有的时候我们把例子变一下就会具有迷惑性：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>function fire () {
&nbsp; // 我是被定义在函数内部的函数哦！
&nbsp;&nbsp;&nbsp;&nbsp; function innerFire() {
&nbsp; console.log(this === window)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }
&nbsp;&nbsp;&nbsp;&nbsp; innerFire(); // 独立函数调用
}
fire(); // 输出true</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>&nbsp;函数 innerFire在一个外部函数fire里面声明且调用，那么它的this是指向谁呢？ 仍然是window&nbsp;<strong>许多人可能会顾虑于fire函数的作用域对innerFire的影响，但我们只要抓住我们的理论武器——没有明确的调用对象的时候，将对函数的this使用默认绑定：绑定到全局的window对象，便可得正确的答案了</strong>&nbsp;下面这个加强版的例子也是同样的输出true</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>var obj = {
&nbsp;&nbsp; fire: function () {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; function innerFire() {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; console.log(this === window)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; innerFire();&nbsp;&nbsp; // 独立函数调用
&nbsp;&nbsp;&nbsp;&nbsp; }
}
obj.fire(); //输出 true</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>【注意】在这个例子中， obj.fire()的调用实际上使用到了this的隐式绑定，这就是下面我要讲的内容，这个例子我接下来还会继续讲解&nbsp;<strong>【总结】 凡事函数作为独立函数调用，无论它的位置在哪里，它的行为表现，都和直接在全局环境中调用无异</strong></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>this的隐式绑定</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>【故事——线路2】 迪斯（this）穿越来异世界“伽瓦斯克利”（javascript）的时候，刚好身上带了一些钱，于是他找到一个旅馆住宿了下来&nbsp;&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":401,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-49.png" alt="" class="wp-image-401"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><strong>当函数被一个对象“包含”的时候，我们称函数的this被隐式绑定到这个对象里面了</strong>，这时候，通过this可以直接访问所绑定的对象里面的其他属性，比如下面的a属性&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>var obj = {
&nbsp;&nbsp;&nbsp;&nbsp; a: 1,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; fire: function () {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; console.log(this.a)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }
}
obj.fire(); // 输出1</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>&nbsp;现在我们需要对平常司空见惯的的代码操作做一些更深的思考，首先，下面的这两段代码达到的效果是相同的：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// 我是第一段代码
function fire () {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; console.log(this.a)
}
&nbsp;&nbsp;
var obj = {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a: 1,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; fire: fire
&nbsp; }
obj.fire(); // 输出1
&nbsp;
// 我是第二段代码
var obj = {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a: 1,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; fire: function () {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; console.log(this.a)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }
}
obj.fire(); // 输出1</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><strong>fire函数并不会因为它被定义在obj对象的内部和外部而有任何区别</strong>，也就是说在上述隐式绑定的两种形式下，fire通过this还是可以访问到obj内的a属性，这告诉我们：&nbsp;<strong>1.&nbsp; this是动态绑定的，或者说是在代码运行期绑定而不是在书写期</strong><strong>2.&nbsp; 函数于对象的独立性， this的传递丢失问题</strong><strong>（下面的描述可能带有个人的情感倾向而显得不太严谨，但这是因为我希望阅读者尽可能地理解我想表达的意思）</strong></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3><strong>隐式绑定下，作为对象属性的函数，对于对象来说是独立的</strong></h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>基于this动态绑定的特点，写在对象内部，作为对象属性的函数，对于这个对象来说是独立的。（函数并不被这个外部对象所“完全拥有”）</strong>&nbsp;我想表达的意思是：在上文中，函数虽然被定义在对象的内部中，但它和“在对象外部声明函数，然后在对象内部通过属性名称的方式取得函数的引用”，这两种方式在<strong>性质上是等价的</strong>（<strong>而不仅仅是效果上</strong>）&nbsp;<strong>定义在对象内部的函数只是“恰好可以被这个对象调用”而已，而不是“生来就是为这个对象所调用的”</strong>借用下面的隐式绑定中的this传递丢失问题来说明：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>var obj = {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a: 1,&nbsp;&nbsp;&nbsp; // a是定义在对象obj中的属性   1
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; fire: function () {
&nbsp;&nbsp; console.log(this.a)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }
&nbsp;
var a = 2;&nbsp; // a是定义在全局环境中的变量 &nbsp;  2
var fireInGrobal = obj.fire; &nbsp;
fireInGrobal(); //&nbsp; 输出 2</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>&nbsp;上面这段简单代码的<strong>有趣之处在于： 这个于obj中的fire函数的引用（ fireInGrobal）在调用的时候，行为表现（输出）完全看不出来它就是在obj内部定义的</strong>，<strong>其原因在于：我们隐式绑定的this丢失了！！ 从而 fireInGrobal调用的时候取得的this不是obj，而是window</strong>&nbsp;上面的例子稍微变个形式就会变成一个可能困扰我们的bug:&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>var a = 2;
var obj = {
&nbsp;&nbsp;&nbsp; a: 1,&nbsp;&nbsp;&nbsp; // a是定义在对象obj中的属性
&nbsp;&nbsp;&nbsp; fire: function () {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; console.log(this.a)
&nbsp;&nbsp;&nbsp;&nbsp; }
} &nbsp;
function otherFire (fn) {
&nbsp;&nbsp;&nbsp;&nbsp; fn();
} &nbsp;
otherFire(obj.fire); // 输出2</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>&nbsp;在上面，我们的关键角色是otherFire函数，它接受一个函数引用作为参数，然后在内部直接调用，但它做的假设是参数fn仍然能够通过this去取得obj内部的a属性，但实际上, this对obj的绑定早已经丢失了，所以输出的是全局的a的值(2),而不是obj内部的a的值（1）&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>在一串对象属性链中，this绑定的是最内层的对象</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>在隐式绑定中，如果函数调用位置是在一串对象属性链中，this绑定的是最内层的对象</strong>。如下所示：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>var obj = {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a: 1,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; obj2: {
&nbsp;&nbsp;         a: 2,
&nbsp;&nbsp;         obj3: {
                a:3,
                getA: function () {
&nbsp;                   console.log(this.a)&nbsp;&nbsp;&nbsp;
&nbsp;                }
&nbsp;&nbsp;         }
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }
}
&nbsp;
obj.obj2.obj3.getA();&nbsp; // 输出3</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>this的显式绑定：(call和bind方法)</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>【故事——线路3】 迪斯（this）穿越来异世界“伽瓦斯克利”（javascript），经过努力的打拼，积累了一定的财富，<strong>于是他买下了自己的房子</strong></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":402,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-50.png" alt="" class="wp-image-402"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>&nbsp;上面我们提到了this的隐式绑定所存在的this绑定丢失的问题，<strong>也就是对于 “ fireInGrobal = obj.fire”</strong><strong>fireInGrobal调用和obj.fire调用的结果是不同的</strong>，<strong>因为这个函数赋值的过程无法把fire所绑定的this也传递过去</strong>。这个时候，call函数就派上用场了<strong>call的基本使用方式： fn.call(object)</strong>fn是你调用的函数，object参数是你希望函数的this所绑定的对象。<strong>fn.call(object)的作用：</strong><strong>1.</strong>即刻调用这个函数（fn）<strong>2.</strong>调用这个函数的时候函数的this指向object对象&nbsp;例子：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>var obj = {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a: 1,&nbsp;&nbsp;&nbsp; // a是定义在对象obj中的属性
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fire: function () {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(this.a)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
}
&nbsp;
var a = 2;&nbsp; // a是定义在全局环境中的变量 &nbsp;
var fireInGrobal = obj.fire;
fireInGrobal();&nbsp;&nbsp; // 输出2
fireInGrobal.call(obj); // 输出1</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>&nbsp;原本丢失了与obj绑定的this参数的fireInGrobal再次重新把this绑回到了obj&nbsp;但是，我们其实不太喜欢这种每次调用都要依赖call的方式，<strong>我们更希望：能够一次性 返回一个this被永久绑定到obj的fireInGrobal函数，这样我们就不必每次调用fireInGrobal都要在尾巴上加上call那么麻烦了。</strong>&nbsp;怎么办呢？ 聪明的你一定能想到，在fireInGrobal.call(obj)外面包装一个函数不就可以了嘛！</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>var obj = {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a: 1,&nbsp;&nbsp;&nbsp; // a是定义在对象obj中的属性
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; fire: function () {
&nbsp;       console.log(this.a)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
}
&nbsp;
var a = 2;&nbsp; // a是定义在全局环境中的变量 &nbsp;
var fn = obj.fire;
var fireInGrobal = function () {
&nbsp;&nbsp;&nbsp; fn.call(obj)&nbsp;&nbsp; //硬绑定
}
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
fireInGrobal(); // 输出1</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><strong>如果使用bind的话会更加简单</strong></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>var fireInGrobal = function () {
&nbsp;&nbsp;&nbsp; fn.call(obj)&nbsp;&nbsp; //硬绑定
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>可以简化为：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>var fireInGrobal = fn.bind(obj);</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><strong>call和bind的区别是：</strong>在绑定this到对象参数的同时：&nbsp;<strong>1.call将立即执行该函数2.bind不执行函数，只返回一个可供执行的函数</strong>&nbsp;【其他】：至于apply，因为除了使用方法，它和call并没有太大差别，这里不加赘述&nbsp;<strong>在这里，我把显式绑定和隐式绑定下，函数和“包含”函数的对象间的关系比作买房和租房的区别</strong>。</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":403,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-51.png" alt="" class="wp-image-403"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>&nbsp;因为this的缘故&nbsp;<strong>在隐式绑定下：函数和只是暂时住在“包含对象“的旅馆里面，可能过几天就又到另一家旅馆住了在显式绑定下：函数将取得在“包含对象“里的永久居住权，一直都会”住在这里“</strong></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>new绑定</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>【故事】 迪斯（this）组建了自己的家庭，并生下多个孩子（通过构造函数new了许多个对象）&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":404,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-52.png" alt="" class="wp-image-404"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>&nbsp;执行new操作的时候，将创建一个新的对象，并且将构造函数的this指向所创建的新对象&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>function foo (a) {
     this.a = a;
}
&nbsp;
var a1&nbsp; = new foo (1);
var a2&nbsp; = new foo (2);
var a3&nbsp; = new foo (3);
var a4&nbsp; = new foo (4);
&nbsp;
console.log(a1.a); // 输出1
console.log(a2.a); // 输出2
console.log(a3.a); // 输出3
console.log(a4.a); // 输出4</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><strong>谢谢大家</strong>！</p>
<!-- /wp:paragraph -->
