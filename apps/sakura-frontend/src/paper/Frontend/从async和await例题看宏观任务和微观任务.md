---
title: 从async/await例题看宏观任务和微观任务
excerpt: '' 
author: Sakura
publishDate: '2022-09-13'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/125640742_p0_master1200.jpg' 
slug: 'frontend-promise-async-await'
date: 2022-09-13 18:40:00
tags:
  - Promise
category:
  - JavaScript
  - 前端
---

<!-- wp:paragraph -->
<p>先来看这样一道面试题：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(() =&gt; {
  console.log('setTimeout')
}, 0);
async1()
new Promise(resolve =&gt; {
    console.log('promise1')
    resolve()
  })
  .then(() =&gt; {
    console.log('promise2')
  })
console.log('script end')</code></pre>
<!-- /wp:code -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="http://www.itheima.com/images/newslistPIC/1605003946016_res1.png" alt="1605003946016_res1.png" title=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><br>这道题主要考察的是事件循环中函数执行顺序的问题，其中包括async ，await，setTimeout，Promise函数。下面来说一下本题中涉及到的知识点。<br></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>任务队列</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>首先我们需要明白以下几件事情：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>·JS分为同步任务和异步任务</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>·同步任务都在主线程上执行，形成一个执行栈</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>·主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放置一个事件。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>·一旦执行栈中的所有同步任务执行完毕(此时JS引擎空闲)，系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>根据规范，事件循环是通过任务队列的机制来进行协调的。一个 Event Loop 中，可以有一个或者多个任务队列(task queue)，一个任务队列便是一系列有序任务(task)的集合;每个任务都有一个任务源(task source)，源自同一个任务源的 task 必须放到同一个任务队列，从不同源来的则被添加到不同队列。setTimeout/Promise 等API便是任务源，而进入任务队列的是他们指定的具体执行任务。<br></p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="http://www.itheima.com/images/newslistPIC/1605003987277_%E9%98%9F%E5%88%97.png" alt="1605003987277_队列.png" title=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><strong>宏任务</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>(macro)task(又称之为宏任务)，可以理解是每次执行栈执行的代码就是一个宏任务(包括每次从事件队列中获取一个事件回调并放到执行栈中执行)。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>浏览器为了能够使得JS内部(macro)task与DOM任务能够有序的执行，会在一个(macro)task执行结束后，在下一个(macro)task 执行开始前，对页面进行重新渲染，流程如下:</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>(macro)task-&gt;渲染-&gt;(macro)task-&gt;...</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><br><strong>(macro)task主要包含：</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>1.script(整体代码)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>2.setTimeout</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>3.setInterval</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>4.I/O</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>5.UI交互事件</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>6.postMessage</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>7.MessageChannel</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>8.setImmediate(Node.js 环境)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>微任务</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>microtask(又称为微任务)，可以理解是在当前 task 执行结束后立即执行的任务。也就是说，在当前task任务后，下一个task之前，在渲染之前。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>所以它的响应速度相比setTimeout(setTimeout是task)会更快，因为无需等渲染。也就是说，在某一个macrotask执行完后，就会将在它执行期间产生的所有microtask 都 执行完毕(在渲染前)。<br></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>microtask主要包含：</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>1. Promise.then</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>2. MutaionObserver</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>3. process.nextTick(Node.js 环境)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>运行机制</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>在事件循环中，每进行一次循环操作称为 tick，每一次 tick 的任务处理模型是比较复杂的，但关键步骤如下：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>·执行一个宏任务（栈中没有就从事件队列中获取）</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>·执行过程中如果遇到微任务，就将它添加到微任务的任务队列中</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>·宏任务执行完毕后，立即执行当前微任务队列中的**所有微任务**（依次执行）</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>·当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>·渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>流程图如下：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="http://www.itheima.com/images/newslistPIC/1605004027341_%E6%B5%81%E7%A8%8B.png" alt="1605004027341_流程.png" title=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><strong><br>Promise和async中的立即执行</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>我们知道Promise中的异步体现在then和catch中，所以写在<strong>Promise中的代码是被当做同步任务立即执行的</strong>。而在async/await中，<strong>在出现await出现之前，其中的代码也是立即执行的。</strong>那么出现了await时候发生了什么呢?<br></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>await做了什么</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>从字面意思上看await就是等待，await 等待的是一个表达式，这个表达式的返回值可以是一个promise对象也可以是其他值。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>很多人以为await会一直等待之后的表达式执行完之后才会继续执行后面的代码，<strong>实际上await是一个让出线程的标志</strong>。await后面的表达式会先执行一遍，将await后面的代码加入到microtask中，然后就会跳出整个async函数来执行后面的代码。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>由于因为async await 本身就是promise+generator的语法糖。所以await后面的代码是microtask。所以对于本题中的<br></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>和</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>async function async1() {
  console.log('async1 start')
  Promise.resolve(async2()).then(() =&gt; {
    console.log('async1 end')
  })
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>以上就本道题涉及到的所有相关知识点了，下面我们再回到这道题来一步一步看看怎么回事儿。</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol><li>首先，事件循环从宏任务(macrotask)队列开始，这个时候，宏任务队列中，只有一个script(整体代码)任务;当遇到任务源(task source)时，则会先分发任务到对应的任务队列中去。所以，上面例子的第一步执行如下图所示：<br><br><br><img src="http://www.itheima.com/images/newslistPIC/1605004063642_1.png" alt="1605004063642_1.png"></li><li>然后我们看到首先定义了两个async函数，接着往下看，然后遇到了 console 语句，直接输出 script start。输出之后，script 任务继续往下执行，遇到 setTimeout，其作为一个宏任务源，则会先将其任务分发到对应的队列中：<br><br><img src="http://www.itheima.com/images/newslistPIC/1605004117246_2.png" alt="1605004117246_2.png"></li><li>script 任务继续往下执行，执行了async1()函数，前面讲过async函数中在await之前的代码是立即执行的，所以会立即输出async1 start。遇到了await时，会将await后面的表达式执行一遍，所以就紧接着输出async2，然后将await后面的代码也就是console.log('async1 end')加入到microtask中的Promise队列中，接着跳出async1函数来执行后面的代码。<br><br><img src="http://www.itheima.com/images/newslistPIC/1605004171205_3.png" alt="1605004171205_3.png"></li><li>script任务继续往下执行，遇到Promise实例。由于Promise中的函数是立即执行的，而后续的 .then 则会被分发到 microtask 的 Promise 队列中去。所以会先输出 promise1，然后执行 resolve，将 promise2 分配到对应队列。<br><br><img src="http://www.itheima.com/images/newslistPIC/1605004307649_4.png" alt="1605004307649_4.png"></li><li>script任务继续往下执行，最后只有一句输出了 script end，至此，全局任务就执行完毕了。<br>根据上述，每次执行完一个宏任务之后，会去检查是否存在 Microtasks；如果有，则执行 Microtasks 直至清空 Microtask Queue。因而在script任务执行完毕之后，开始查找清空微任务队列。此时，微任务中， Promise 队列有的两个任务async1 end和promise2，因此按先后顺序输出 async1 end，promise2。当所有的 Microtasks 执行完毕之后，表示第一轮的循环就结束了。</li><li>第二轮循环依旧从宏任务队列开始。此时宏任务中只有一个 setTimeout，取出直接输出即可，至此整个流程结束。</li></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p><strong>变式一</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>在第一个变式中我将async2中的函数也变成了Promise函数，代码如下：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  new Promise(resolve =&gt; {
      console.log('promise1')
      resolve()
    })
    .then(() =&gt; {
      console.log('promise2')
    })
}
console.log('script start')
setTimeout(() =&gt; {
  console.log('setTimeout')
}, 0);
async1()
new Promise(resolve =&gt; {
    console.log('promise3')
    resolve()
  })
  .then(() =&gt; {
    console.log('promise4')
  })
console.log('script end')</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><br>运行结果入下：<br></p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="http://www.itheima.com/images/newslistPIC/1605004336136_res2.png" alt="1605004336136_res2.png" title=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>在第一次macrotask执行完之后，也就是输出script end之后，会去清理所有microtask。所以会相继输出promise2， async1 end ，promise4，其余不再多说。<br></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>变式二</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>在第二个变式中，我将async1中await后面的代码和async2的代码都改为异步的，代码如下：<br></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>async function async1() {
  console.log('async1 start')
  await async2()
  setTimeout(() =&gt; {
    console.log('setTimeout1')
  }, 0)
}
async function async2() {
  setTimeout(() =&gt; {
    console.log('setTimeout2')
  }, 0)
}
console.log('script start')
setTimeout(() =&gt; {
  console.log('setTimeout3')
}, 0);
async1()
new Promise(resolve =&gt; {
    console.log('promise1')
    resolve()
  })
  .then(() =&gt; {
    console.log('promise2')
  })
console.log('script end')</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>执行结果如下：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="http://www.itheima.com/images/newslistPIC/1605004360270_res3.png" alt="1605004360271_res3.png" title=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>在输出为promise2之后，接下来会按照加入setTimeout队列的顺序来依次输出，通过代码我们可以看到加入顺序为3 2 1，所以会按3，2，1的顺序来输出。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>只要前面的原理看懂了，任何的变式题都不会有问题。</p>
<!-- /wp:paragraph -->