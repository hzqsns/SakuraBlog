---
title: Get和Post的区别
excerpt: '' 
author: Sakura
publishDate: '2022-09-29'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/124481360_p0_master1200.jpg' 
slug: 'frontend-get-post'
date: 2022-09-29 18:45:00
tags:
  - http
category:
  - 前端
---

<!-- wp:heading {"level":1} -->
<h1 id="一、概念">一、概念</h1>
<!-- /wp:heading -->

<!-- wp:heading -->
<h2 id="1-Http">1.Http</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>​&nbsp;&nbsp; &nbsp; 首先我们先来看看W3School中对于Http的定义:超文本传输协议（HTTP）的设计目的是保证客户机与服务器之间的通信。HTTP 的工作方式是客户机与服务器之间的请求-应答协议。web 浏览器可能是客户端，而计算机上的网络应用程序也可能作为服务器端。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>​&nbsp;&nbsp; 举例：客户端（浏览器）向服务器提交 HTTP 请求；服务器向客户端返回响应。响应包含关于请求的状态信息以及可能被请求的内容。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 id="2-Get-Post">2.Get/Post</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>在客户机和服务器之间进行请求-响应时，两种最常被用到的方法是：GET 和 POST。</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li><strong>GET - 从指定的资源请求数据。</strong></li><li><strong>POST - 向指定的资源提交要被处理的数据.</strong></li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>有关 GET 请求的其他一些注释：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li><strong>GET 请求可被缓存</strong></li><li><strong>GET 请求保留在浏览器历史记录中</strong></li><li><strong>GET 请求可被收藏为书签</strong></li><li><strong>GET 请求不应在处理敏感数据时使用</strong></li><li><strong>GET 请求有长度限制</strong></li><li><strong>GET 请求只应当用于取回数据</strong></li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>有关 POST请求的其他一些注释：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li><strong>POST 请求不会被缓存</strong></li><li><strong>POST 请求不会保留在浏览器历史记录中</strong></li><li><strong>POST 不能被收藏为书签</strong></li><li><strong>POST 请求对数据长度没有要求</strong></li></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 id="3-区别">3.区别</h2>
<!-- /wp:heading -->

<!-- wp:table {"align":"center"} -->
<figure class="wp-block-table aligncenter"><table><thead><tr><th class="has-text-align-center" data-align="center"></th><th class="has-text-align-center" data-align="center">Get</th><th class="has-text-align-center" data-align="center">Post</th></tr></thead><tbody><tr><td class="has-text-align-center" data-align="center">后退按钮/刷新</td><td class="has-text-align-center" data-align="center">无害，没有影响</td><td class="has-text-align-center" data-align="center">数据会被重新提交（浏览器告知用户）</td></tr><tr><td class="has-text-align-center" data-align="center">书签</td><td class="has-text-align-center" data-align="center">可收藏为书签</td><td class="has-text-align-center" data-align="center">不能被收藏为书签</td></tr><tr><td class="has-text-align-center" data-align="center">缓存</td><td class="has-text-align-center" data-align="center">能被缓存</td><td class="has-text-align-center" data-align="center">不能被缓存</td></tr><tr><td class="has-text-align-center" data-align="center">编码类型</td><td class="has-text-align-center" data-align="center">application/x-www-form-urlencoded</td><td class="has-text-align-center" data-align="center">application/x-www-form-urlencoded 或 multipart/form-data。为二进制数据使用多重编码。</td></tr><tr><td class="has-text-align-center" data-align="center">历史</td><td class="has-text-align-center" data-align="center">参数保留在浏览器历史中。</td><td class="has-text-align-center" data-align="center">参数不会保存在浏览器历史中，比较安全</td></tr><tr><td class="has-text-align-center" data-align="center">对数据长度的限制</td><td class="has-text-align-center" data-align="center">当发送数据时，GET 方法向 URL 添加数据；URL 的长度是受限制的（URL 的最大长度是 2048 个字符）。</td><td class="has-text-align-center" data-align="center">无限制</td></tr><tr><td class="has-text-align-center" data-align="center">对数据类型的限制</td><td class="has-text-align-center" data-align="center">只允许 ASCII 字符。</td><td class="has-text-align-center" data-align="center">没有限制。也允许二进制数据。</td></tr><tr><td class="has-text-align-center" data-align="center">安全性</td><td class="has-text-align-center" data-align="center">GET 的安全性较差，因为所发送的数据是 URL 的一部分，并且对所有人都可见，所以发送密码等数据时绝对不能使用get</td><td class="has-text-align-center" data-align="center">POST 比 GET 更安全，因为参数不会被保存在浏览器历史或 web 服务器日志中。</td></tr><tr><td class="has-text-align-center" data-align="center">可见性</td><td class="has-text-align-center" data-align="center">数据在 URL 中对所有人都是可见的。</td><td class="has-text-align-center" data-align="center">数据不会显示在 URL 中。</td></tr></tbody></table></figure>
<!-- /wp:table -->

<!-- wp:paragraph -->
<p>（本标准答案参考自w3schools）</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":1} -->
<h1 id="二、原理">二、原理</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>&nbsp; &nbsp; &nbsp;当然上面的只是官方的解释，接下来我们透过现象看本质，看看get和post到底是怎么回事，首先我们知道不管是get还是post都是http的通信方式，但是http是什么呢，如果学过计算机网络的小伙伴应该会知道，http是TCP/IP的关于数据如何在万维网中如何通信的协议，工作在应用层，由传输层给它提供服务，也就是说get和post也是基于TCP/Ip来工作的，理论上二者实现的功能都是一致的，这也就是为什么我们有时候即使用post发送数据，也可以强行在url中捎带一些数据的原因，那么这么说，岂不是上面的结论都是错的嘛？</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>&nbsp; &nbsp; 在我大万维网世界中，TCP就像汽车，我们用TCP来运输数据，它很可靠，从来不会发生丢件少件的现象。但是如果路上跑的全是看起来一模一样的汽车，那这个世界看起来是一团混乱，送急件的汽车可能被前面满载货物的汽车拦堵在路上，整个交通系统一定会瘫痪。为了避免这种情况发生，交通规则HTTP诞生了。HTTP给汽车运输设定了好几个服务类别，有GET, POST, PUT, DELETE等等，HTTP规定，当执行GET请求的时候，要给汽车贴上GET的标签（设置method为GET），而且要求把传送的数据放在车顶上（url中）以方便记录。如果是POST请求，就要在车上贴上POST的标签，并把货物放在车厢里（这样做的好处是安全，试想如果你是一辆运钞车，你能把所有的钱放到车顶嘛）当然，你也可以在GET的时候往车厢内偷偷藏点货物，但是这是很不光彩；也可以在POST的时候在车顶上也放一些数据，HTTP只是个行为准则（就像红绿灯一样，规则在那，但依然有人不遵守一样），而TCP才是GET和POST怎么实现的基本。。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>​</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>&nbsp; &nbsp; &nbsp;这里我们想一想对于携带参数大小是如何限制的，这里我们引入另一个重要的角色：运输公司。不同的浏览器（发起http请求）和服务器（接受http请求）就是不同的运输公司。 虽然理论上，你可以在车顶上无限的堆货物（url中无限加参数）。但是运输公司可不傻，装货和卸货也是有很大成本的，他们会限制单次运输量来控制风险，数据量太大对浏览器和服务器都是很大负担。不成文的规定是，（大多数）浏览器通常都会限制url长度在2K个字节，而（大多数）服务器最多处理64K大小的url。超过的部分，恕不处理。如果你用GET服务，在车厢内（request&nbsp; body）偷偷藏了数据，不同服务器的处理方式也是不同的，有些服务器会帮你卸货，读出数据，有些服务器直接忽略，所以，虽然GET可以在车厢内装数据，但是接收方却不一定能接收到。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>&nbsp; &nbsp; &nbsp; 最后一个区别是在发送数据的时候GET方法会产生一个TCP数据包；POST则会产生两个TCP数据包，对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200（返回数据），而对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok（返回数据）。也就是说，GET只需要汽车跑一趟就把货送到了，而POST得跑两趟，第一趟，先去和服务器打个招呼“嗨，我等下要送一批货来，你们打开门迎接我”，然后再回头把货送过去。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>&nbsp; &nbsp; &nbsp; 那是不是说post比get更高效呢，我们是不是应该多使用get呢，这个应该是视情况而定，在不同的场景下运用不同的方法，比如上面举的例子，你在运送重要数据，比如密码（大额钞票）等，你不能用get方法让所有人都看到吧！不仅如此据研究，在网络环境好的情况下，发一次包的时间和发两次包的时间差别基本可以无视。而在网络环境差的情况下，两次包的TCP在验证数据包完整性上，有非常大的优点。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>​&nbsp;对了还有并不是所有浏览器都会在POST中发送两次包，Firefox就只发送一次。</p>
<!-- /wp:paragraph -->
