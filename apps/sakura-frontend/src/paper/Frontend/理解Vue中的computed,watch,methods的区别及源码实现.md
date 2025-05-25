---
title: 理解Vue中的computed,watch,methods的区别及源码实现
excerpt: '' 
author: Sakura
publishDate: '2022-08-10'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/130792373_p0_master1200.jpg' 
slug: 'frontend-vue-computed-watch-methods'
date: 2022-08-10 18:35:00
tags:
  - Vue
category:
  - 前端
---

<!-- wp:paragraph -->
<p>一. 理解Vue中的computed用法</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>computed是计算属性的; 它会根据所依赖的数据动态显示新的计算结果, 该计算结果会被缓存起来。computed的值在getter执行后是会被缓存的。如果所依赖的数据发生改变时候, 就会重新调用getter来计算最新的结果。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>下面我们根据官网中的demo来理解下computed的使用及何时使用computed。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>computed设计的初衷是为了使模板中的逻辑运算更简单, 比如在Vue模板中有很多复杂的数据计算的话, 我们可以把该计算逻辑放入到computed中去计算。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>下面我们看下官网中的一个demo如下:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;vue&lt;/title&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="app"&gt;
    {{ msg.split('').reverse().join('') }}
  &lt;/div&gt;
  &lt;script type="text/javascript"&gt;
    new Vue({
      el: '#app',
      data: {
        msg: 'hello'
      }
    });
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上代码, 我们的data属性中的msg默认值为 'hello'; 然后我们在vue模板中会对该数据值进行反转操作后输出数据, 因此在页面上就会显示 'olleh'; 这样的数据。这是一个简单的运算, 但是如果页面中的运算比这个还更复杂的话, 这个时候我们可以使用computed来进行计算属性值, computed的目的就是能使模板中的运算逻辑更简单。因此我们现在需要把上面的代码改写成下面如下代码：</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;vue&lt;/title&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="app"&gt;
    &lt;p&gt;原来的数据: {{ msg }}&lt;/p&gt;
    &lt;p&gt;反转后的数据为: {{ reversedMsg }}&lt;/p&gt;
  &lt;/div&gt;
  &lt;script type="text/javascript"&gt;
    var vm = new Vue({
      el: '#app',
      data: {
        msg: 'hello'
      },
      computed: {
        reversedMsg() {
          // this 指向 vm 实例
          return this.msg.split('').reverse().join('')
        }
      }
    });
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上代码, 我们在computed中声明了一个计算属性 reversedMsg。我们提供的 reversedMsg 函数, 将用作属性 vm.reversedMsg 的getter函数; 我们可以在上面实例化后代码中, 打印如下信息:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">console.log(vm);</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>打印信息如下所示, 我们可以看到 vm.reversedMsg = 'olleh';&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":373,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-27-1024x738.png" alt="" class="wp-image-373"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>我们也可以打开控制台, 当我们修改 vm.msg 的值后, vm.reversedMsg 的值也会发生改变，如下控制台打印的信息可知:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":374,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-28.png" alt="" class="wp-image-374"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>如上打印的信息我们可以看得到, 我们的 vm.reversedMsg 的值依赖于 vm.msg 的值，当vm.msg的值发生改变时, vm.reversedMsg 的值也会得到更新。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>computed 应用场景</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>1. 适用于一些重复使用数据或复杂及费时的运算。我们可以把它放入computed中进行计算, 然后会在computed中缓存起来, 下次就可以直接获取了。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>2. 如果我们需要的数据依赖于其他的数据的话, 我们可以把该数据设计为computed中。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>二：computed 和 methods的区别?如上demo代码, 如果我们通过在表达式中调用方法也可以达到同样的效果, 现在我们把代码改成方法, 如下代码:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;vue&lt;/title&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="app"&gt;
    &lt;p&gt;原来的数据: {{ msg }}&lt;/p&gt;
    &lt;p&gt;反转后的数据为: {{ reversedMsg() }}&lt;/p&gt;
  &lt;/div&gt;
  &lt;script type="text/javascript"&gt;
    var vm = new Vue({
      el: '#app',
      data: {
        msg: 'hello'
      },
      /*
      computed: {
        reversedMsg() {
          // this 指向 vm 实例
          return this.msg.split('').reverse().join('')
        }
      }
      */
      methods: {
        reversedMsg() {
          // this 指向 vm 实例
          return this.msg.split('').reverse().join('')
        }
      }
    });
    console.log(vm);
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上代码, 我们反转后的数据在模板中调用的是方法 reversedMsg(); 该方法在methods中也定义了。那么也可以实现同样的效果, 那么他们之间到底有什么区别呢?</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>区别是:</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>1. computed 是基于响应性依赖来进行缓存的。只有在响应式依赖发生改变时它们才会重新求值, 也就是说, 当msg属性值没有发生改变时, 多次访问 reversedMsg 计算属性会立即返回之前缓存的计算结果, 而不会再次执行computed中的函数。但是methods方法中是每次调用, 都会执行函数的, methods它不是响应式的。<br>2. computed中的成员可以只定义一个函数作为只读属性, 也可以定义成 get/set变成可读写属性, 但是methods中的成员没有这样的。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>我们可以再看下如下demo：</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;vue&lt;/title&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="app"&gt;
    &lt;div&gt;第一次调用computed属性: {{ reversedMsg }}&lt;/div&gt;
    &lt;div&gt;第二次调用computed属性: {{ reversedMsg }}&lt;/div&gt;
    &lt;div&gt;第三次调用computed属性: {{ reversedMsg }}&lt;/div&gt;
    &lt;!-- 下面是methods调用 --&gt;
    &lt;div&gt;第一次调用methods方法: {{ reversedMsg1() }}&lt;/div&gt;
    &lt;div&gt;第二次调用methods方法: {{ reversedMsg1() }}&lt;/div&gt;
    &lt;div&gt;第三次调用methods方法: {{ reversedMsg1() }}&lt;/div&gt;
  &lt;/div&gt;
  &lt;script type="text/javascript"&gt;
    var vm = new Vue({
      el: '#app',
      data: {
        msg: 'hello'
      },
      computed: {
        reversedMsg() {
          console.log(1111);
          // this 指向 vm 实例
          return this.msg.split('').reverse().join('')
        }
      },
      methods: {
        reversedMsg1() {
          console.log(2222);
          // this 指向 vm 实例
          return this.msg.split('').reverse().join('')
        }
      }
    });
    console.log(vm);
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>执行后的结果如下所示:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":375,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-29.png" alt="" class="wp-image-375"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>如上代码我们可以看到, 在computed中有属性reversedMsg, 然后在该方法中会打印 1111; 信息出来, 在methods中的方法reversedMsg1也会打印 2222 信息出来, 但是在computed中, 我们除了第一次之后，再次获取reversedMsg值后拿得是缓存里面的数据, 因此就不会再执行该reversedMsg函数了。但是在methods中, 并没有缓存, 每次执行reversedMsg1()方法后，都会打印信息。<br>从上面截图信息我们就可以验证的。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>那么我们现在再来理解下缓存的作用是什么呢? computed为什么需要缓存呢? 我们都知道我们的http也有缓存, 对于一些静态资源, 我们nginx服务器会缓存我们的静态资源，如果静态资源没有发生任何改变的话, 会直接从缓存里面去读取,这样就不会重新去请求服务器数据, 也就是避免了一些无畏的请求, 提高了访问速度, 优化了用户体验。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>对于我们computed的也是一样的。如上面代码, 我们调用了computed中的reversedMsg方法一共有三次，如果我们也有上百次调用或上千次调用的话, 如果依赖的数据没有改变, 那么每次调用都要去计算一遍, 那么肯定会造成很大的浪费。因此computed就是来优化这件事的。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>三：Vue中的watch的用法</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>watch它是一个对data的数据监听回调, 当依赖的data的数据变化时, 会执行回调。在回调中会传入newVal和oldVal两个参数。<br>Vue实例将会在实例化时调用$watch(), 他会遍历watch对象的每一个属性。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>watch的使用场景是：</strong>当在data中的某个数据发生变化时, 我们需要做一些操作, 或者当需要在数据变化时执行异步或开销较大的操作时. 我们就可以使用watch来进行监听。<br><strong>watch普通监听和深度监听</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>如下普通监听数据的基本测试代码如下:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;vue&lt;/title&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="app"&gt;
    &lt;p&gt;空智个人信息情况: {{ basicMsg }}&lt;/p&gt;
    &lt;p&gt;空智今年的年龄: &lt;input type="text" v-model="age" /&gt;&lt;/p&gt;
  &lt;/div&gt;
  &lt;script type="text/javascript"&gt;
    var vm = new Vue({
      el: '#app',
      data: {
        basicMsg: '',
        age: 31,
        single: '单身'
      },
      watch: {
        age(newVal, oldVal) {
          this.basicMsg = '今年' + newVal + '岁' + ' ' + this.single;
        }
      }
    });
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>显示效果如下：</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":376,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-30.png" alt="" class="wp-image-376"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>如上代码, 当我们在input输入框中输入年龄后, 比如32, 那么watch就能对 'age' 这个属性进行监听，当值发生改变的时候, 就会把最新的计算结果赋值给 'basicMsg' 属性值, 因此最后在页面上就会显示 'basicMsg' 属性值了。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>理解handler方法及immediate属性</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>如上watch有一个特点是: 第一次初始化页面的时候, 是不会去执行age这个属性监听的, 只有当age值发生改变的时候才会执行监听计算. 因此我们上面第一次初始化页面的时候, 'basicMsg' 属性值默认为空字符串。那么我们现在想要第一次初始化页面的时候也希望它能够执行 'age' 进行监听, 最后能把结果返回给 'basicMsg' 值来。因此我们需要修改下我们的 watch的方法，需要引入handler方法和immediate属性, 代码如下所示:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;vue&lt;/title&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="app"&gt;
    &lt;p&gt;空智个人信息情况: {{ basicMsg }}&lt;/p&gt;
    &lt;p&gt;空智今年的年龄: &lt;input type="text" v-model="age" /&gt;&lt;/p&gt;
  &lt;/div&gt;
  &lt;script type="text/javascript"&gt;
    var vm = new Vue({
      el: '#app',
      data: {
        basicMsg: '',
        age: 31,
        single: '单身'
      },
      watch: {
        age: {
          handler(newVal, oldVal) {
            this.basicMsg = '今年' + newVal + '岁' + ' ' + this.single;
          },
          immediate: true
        }
      }
    });
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上代码, 我们给我们的age属性绑定了一个handler方法。其实我们之前的watch当中的方法默认就是这个handler方法。但是在这里我们使用了immediate: true; 属性，含义是: 如果在watch里面声明了age的话, 就会立即执行里面的handler方法。如果 immediate 值为false的话,那么效果就和之前的一样, 就不会立即执行handler这个方法的。因此设置了 immediate:true的话,第一次页面加载的时候也会执行该handler函数的。即第一次 basicMsg 有值。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>因此第一次页面初始化效果如下：</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":377,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-31.png" alt="" class="wp-image-377"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><strong>理解deep属性</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>watch里面有一个属性为deep，含义是：是否深度监听某个对象的值, 该值默认为false。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>如下测试代码:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;vue&lt;/title&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="app"&gt;
    &lt;p&gt;空智个人信息情况: {{ basicMsg }}&lt;/p&gt;
    &lt;p&gt;空智今年的年龄: &lt;input type="text" v-model="obj.age" /&gt;&lt;/p&gt;
  &lt;/div&gt;
  &lt;script type="text/javascript"&gt;
    var vm = new Vue({
      el: '#app',
      data: {
        obj: {
          basicMsg: '',
          age: 31,
          single: '单身'
        }
      },
      watch: {
        'obj': {
          handler(newVal, oldVal) {
            this.basicMsg = '今年' + newVal.age + '岁' + ' ' + this.obj.single;
          },
          immediate: true,
          deep: true // 需要添加deep为true即可对obj进行深度监听
        }
      }
    });
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上测试代码, 如果我们不把 deep: true添加的话,当我们在输入框中输入值的时候，改变obj.age值后，obj对象中的handler函数是不会被执行到的。受JS的限制, Vue不能检测到对象属性的添加或删除的。它只能监听到obj这个对象的变化,比如说对obj赋值操作会被监听到。比如在mounted事件钩子函数中对我们的obj进行重新赋值操作, 如下代码:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">mounted() {
  this.obj = {
    age: 22,
    basicMsg: '',
    single: '单身'
  };
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>最后我们的页面会被渲染到 age 为 22; 因此这样我们的handler函数才会被执行到。如果我们需要监听对象中的某个属性值的话, 我们可以使用 deep设置为true即可生效。deep实现机制是: 监听器会一层层的往下遍历, 给对象的所有属性都加上这个监听器。当然性能开销会非常大的。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>当然我们可以直接对对象中的某个属性进行监听的，比如就对 'obj.age' 来进行监听， 如下代码也是可以生效的。</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;vue&lt;/title&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="app"&gt;
    &lt;p&gt;空智个人信息情况: {{ basicMsg }}&lt;/p&gt;
    &lt;p&gt;空智今年的年龄: &lt;input type="text" v-model="obj.age" /&gt;&lt;/p&gt;
  &lt;/div&gt;
  &lt;script type="text/javascript"&gt;
    var vm = new Vue({
      el: '#app',
      data: {
        obj: {
          basicMsg: '',
          age: 31,
          single: '单身'
        }
      },
      watch: {
        'obj.age': {
          handler(newVal, oldVal) {
            this.basicMsg = '今年' + newVal + '岁' + ' ' + this.obj.single;
          },
          immediate: true,
          // deep: true // 需要添加deep为true即可对obj进行深度监听
        }
      }
    });
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p><strong>watch 和 computed的区别是：</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>相同点：他们两者都是观察页面数据变化的。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>不同点：computed只有当依赖的数据变化时才会计算, 当数据没有变化时, 它会读取缓存数据。<br>watch每次都需要执行函数。watch更适用于数据变化时的异步操作。<br></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>四：computed的基本原理及源码实现</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>computed上面我们也已经说过, 它设计的初衷是: 为了使模板中的逻辑运算更简单。它有两大优势:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>1. 使模板中的逻辑更清晰, 方便代码管理。<br>2. 计算之后的值会被缓存起来, 依赖的data值改变后会重新计算。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>因此我们要理解computed的话, 我们只需要理解如下几个问题:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>1. computed是如何初始化的, 初始化之后做了那些事情?<br>2. 为什么我们改变了data中的属性值后, computed会重新计算, 它是如何实现的?<br>3. computed它是如何缓存值的, 当我们下次访问该属性的时候, 是怎样读取缓存数据的?</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>理解Vue源码中computed实现流程</strong>&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>computed初始化</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>在理解如何初始化之前, 我们来看如下简单的demo, 然后一步步看看他们的源码是如何做的。</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;vue&lt;/title&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="app"&gt;
    &lt;p&gt;原来的数据: {{ msg }}&lt;/p&gt;
    &lt;p&gt;反转后的数据为: {{ reversedMsg }}&lt;/p&gt;
  &lt;/div&gt;
  &lt;script type="text/javascript"&gt;
    var vm = new Vue({
      el: '#app',
      data: {
        msg: 'hello'
      },
      computed: {
        reversedMsg() {
          // this 指向 vm 实例
          return this.msg.split('').reverse().join('')
        }
      }
    });
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上代码, 我们看到代码入口就是vue的实例化, new Vue({}) 作为入口, 因此会调用 vue/src/core/instance/index.js 中的init函数代码, 如下所示：</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">......... 更多代码省略
/*
 @param {options} Object
 options = {
   el: '#app',
   data: {
     msg: 'hello'
   },
   computed: {
     reversedMsg() {
       // this 指向 vm 实例
       return this.msg.split('').reverse().join('')
     }
   }
 };
*/
import { initMixin } from './init'
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &amp;&amp;
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
initMixin(Vue);

..... 更多代码省略

export default Vue;</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上代码, 会执行 this._init(options); 方法内部，因此会调用 vue/src/core/instance/init.js 文件中的_init方法, 基本代码如下所示:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">import { initState } from './state';
export function initMixin (Vue: Class&lt;Component&gt;) {
  Vue.prototype._init = function (options?: Object) {
    .... 更多代码省略
    initState(vm);
    .... 更多代码省略
  }
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>因此继续执行 initState(vm); 中的代码了, 因此会调用 vue/src/core/instance/state.js 中的文件代码, 基本代码如下:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">import config from '../config'
import Watcher from '../observer/watcher'
import Dep, { pushTarget, popTarget } from '../observer/dep'

..... 更多代码省略
/*
 @param {vm}
 vm = {
   $attrs: {},
   $children: [],
   $listeners: {},
   $options: {
     components: {},
     computed: {
       reversedMsg() {
         // this 指向 vm 实例
         return this.msg.split('').reverse().join('')
       }
     },
     el: '#app',
     ..... 更多属性值
   },
   .... 更多属性
 };
*/
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch &amp;&amp; opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}

..... 更多代码省略</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上代码, 形参上的vm参数值基本值如上注释。代码内部先判断 vm.options.props是否有该属性,有的话,就调用initProps()方法进行初始化,接着会判断vm.options.props是否有该属性,有的话,就调用initProps()方法进行初始化,接着会判断vm.options.methods; 是否有该方法, 有的话，调用 initMethods() 方法进行初始化。这些所有的我们先不看, 我们这边最主要的是看 if (opts.computed) initComputed(vm, opts.computed) 这句代码; 判断 vm.$options.computed 是否有, 如果有的话, 就执行 initComputed(vm, opts.computed); 函数。因此我们找到 initComputed函数代码如下：</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">/*
 @param {vm} 值如下:
 vm = {
   $attrs: {},
   $children: [],
   $listeners: {},
   $options: {
     components: {},
     computed: {
       reversedMsg() {
         // this 指向 vm 实例
         return this.msg.split('').reverse().join('')
       }
     },
     el: '#app',
     ..... 更多属性值
   },
   .... 更多属性
 };
 @param {computed} Object
 computed = {
   reversedMsg() {
     // this 指向 vm 实例
     return this.msg.split('').reverse().join('')
   }
 };
*/

const computedWatcherOptions = { lazy: true };
function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' &amp;&amp; getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }
    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }
    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props &amp;&amp; key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上代码, 首先使用 Object.create(null); 创建一个空对象, 分别赋值给 watchers; 和 vm._computedWatchers； 接着执行代码:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>const isSSR = isServerRendering(); 判断是否是服务器端渲染, 我们这边肯定不是服务器端渲染，因此 const isSSR = false;</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>接着使用 for in 循环遍历 computed; 代码：for (const key in computed) { const userDef = computed[key] };</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>接着判断 userDef 该值是否是一个函数, 或者也可以是一个对象, 因此我们可以推断我们的 computed 可以如下编写代码:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">computed: {
  reversedMsg() {
    // this 指向 vm 实例
    return this.msg.split('').reverse().join('')
  }
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>或如下初始化代码也是可以的：</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">computed: {
  reversedMsg: {
    get() {
      // this 指向 vm 实例
      return this.msg.split('').reverse().join('')
    }
  }
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>当我们拿不到我们的getter的时候, vue会报出一个警告信息。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>接着代码, 如下所示:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">if (!isSSR) {
  // create internal watcher for the computed property.
  watchers[key] = new Watcher(
    vm,
    getter || noop,
    noop,
    computedWatcherOptions
  )
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上代码, 我们会根据computed中的key来实例化watcher，因此我们可以理解为其实computed就是watcher的实现, 通过一个发布订阅模式来监听的。给Watch方法传递了四个参数, 分别为VM<strong>实例</strong>, 上面我们获取到的getter方法, noop 是一个回调函数。computedWatcherOptions参数我们在源码初始化该值为：const computedWatcherOptions = { lazy: true }; 我们再来看下 Watcher函数代码, 该函数代码在:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>vue/src/core/observer/watcher.js 中; 基本源码如下：</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">/*
 vm = {
   $attrs: {},
   $children: [],
   $listeners: {},
   $options: {
     components: {},
     computed: {
       reversedMsg() {
         // this 指向 vm 实例
         return this.msg.split('').reverse().join('')
       }
     },
     el: '#app',
     ..... 更多属性值
   },
   .... 更多属性
 };
 expOrFn = function reversedMsg() {}; expOrFn 是我们上面获取到的getter函数.
 cb的值是一个回调函数。
 options = {lazy: true};
 isRenderWatcher = undefined;
*/
export default class Watcher {
  ....
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    /*
     当前的watcher添加到vue的<strong>实例</strong>上, 因此:
     vm._watchers = [
      Watcher 
     ];
     即 vm._watchers[0].vm = {
       $attrs: {},
       $children: [],
       $listeners: {},
       $options: {
         components: {},
         computed: {
           reversedMsg() {}
         }
       }
     }
     ....
    */
    vm._watchers.push(this);
    // options
    /*
      options = {lazy: true};
      因此：
      // 如果deep为true的话，会对getter返回的对象再做一次深度的遍历
      this.deep = !!options.deep;　即　this.deep = false; 
      // user 是用于标记这个监听是否由用户通过$watch调用的
      this.user = !!options.user;　即: this.user = false;
      
      // lazy用于标记watcher是否为懒执行,该属性是给 computed data 用的，当 data 中的值更改的时候，不会立即计算 getter 
      // 获取新的数值，而是给该 watcher 标记为dirty，当该 computed data 被引用的时候才会执行从而返回新的 computed 
      // data，从而减少计算量。
      
      this.lazy = !!options.lazy; 即: this.lazy = true;
      
      // 表示当 data 中的值更改的时候，watcher 是否同步更新数据，如果是 true，就会立即更新数值，否则在 nextTick 中更新。
      
      this.sync = !!options.sync; 即: this.sync = false;
      this.before = options.before; 即: this.before = undefined;
    */
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    // cb 为回调函数
    this.cb = cb
    this.id = ++uid // uid for batching 
    this.active = true
    // this.dirty = true;
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set();
    /*
     把函数转换成字符串的形式(不是正式环境下)
     this.expression = "reversedMsg() { return this.msg.split('').reverse().join('') }"
    */
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    /*
     判断expOrFn是否是一个函数, 如果是一个函数, 直接赋值给　this.getter;
     否则的话, 它是一个表达式的话, 比如 'a.b.c' 这样的，因此调用　this.getter = parsePath(expOrFn); 
     parsePath函数的代码在：vue/src/core/util/lang.js 中。
    */
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' &amp;&amp; warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    // 不是懒加载类型调用get
    this.value = this.lazy
      ? undefined
      : this.get()
  }
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>因此如上代码执行完成后, 我们的　vue/src/core/instance/state.js　中的　initComputed() 函数中，如下这句代码执行后：</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">watchers[key] = new Watcher(
    vm,
    getter || noop,
    noop,
    computedWatcherOptions
  );</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>watchers["reversedMsg"] 的值变为如下:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">watchers["reversedMsg"] = {
  active: true,
  before: false,
  cb: f noop(a, b, c) {},
  deep: false,
  depIds: Set,
  deps: [],
  dirty: true,
  expression: 'reversedMsg() { return this.msg.split('').reverse().join('') }',
  getter: f reversedMsg() { return this.msg.split('').reverse().join('') },
  id: 1,
  lazy: true,
  newDepIds: Set,
  newDeps: [],
  sync: false,
  user: false,
  value: undefined,
  vm: {
    // Vue的<strong>实例</strong>对象
  }
};</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如果computed中有更多的方法的话, 就会返回更多的　watchers['xxxx'] 这样的对象了。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>现在我们再回到　vue/src/core/instance/state.js　中的　initComputed() 函数中，继续执行如下代码:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">// component-defined computed properties are already defined on the
// component prototype. We only need to define computed properties defined
// at instantiation here.
// 如果 computed中的key没有在vｍ中, 则通过defineComputed挂载上去。第一次执行的时候, vm中没有该属性的
if (!(key in vm)) {
  defineComputed(vm, key, userDef)
} else if (process.env.NODE_ENV !== 'production') {
  // 如果我们的 computed中的key在data中或在props有同名的属性的话，则直接发出警告。
  if (key in vm.$data) {
    warn(`The computed property "${key}" is already defined in data.`, vm)
  } else if (vm.$options.props &amp;&amp; key in vm.$options.props) {
    warn(`The computed property "${key}" is already defined as a prop.`, vm)
  }
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>现在我们继续查看defineComputed函数代码如下：</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache &amp;&amp; userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  if (process.env.NODE_ENV !== 'production' &amp;&amp;
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上代码, 首先执行 const shouldCache = !isServerRendering(); 判断是不是服务器端渲染, 我们这边肯定不是的, 因此　shouldCache　为 true, 该参数的作用是否需要被缓存数据, 为true是需要被缓存的。也就是说我们的这里的computed只要不是服务器端渲染的话, 默认会缓存数据的。<br>接着会判断　userDef　是否是一个函数, 如果是函数的话，说明是我们的computed的用法。因此　sharedPropertyDefinition.get = createComputedGetter(key); 的返回值。如果不是函数, 有可能就是表达式, 比如　watch　中的监听　'a.b.c' 这样的话, 就执行else语句代码了。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>现在我们来看下　createComputedGetter　函数代码如下：</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">/*
 @param key = "reversedMsg"
*/
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers &amp;&amp; this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>因此　sharedPropertyDefinition.get，其实返回的是　computedGetter()函数的，即: function computedGetter() {};<br>最后我们再回到　export function defineComputed() 函数代码中：执行代码：Object.defineProperty(target, key, sharedPropertyDefinition); 使用Object.defineProperty来监听对象属性值的变化;</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">/*
 @param {target} vm<strong>实例</strong>对象
 @param {key} "reversedMsg"
 @param {sharedPropertyDefinition}
 sharedPropertyDefinition = {
   configurable: true,
   enumerable: true,
   get: function computedGetter () {
      var watcher = this._computedWatchers &amp;&amp; this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    },
    set: function noop(a, b, c) {}
 }
*/
Object.defineProperty(target, key, sharedPropertyDefinition); </pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>如上代码我们可以看到, 我们会使用　Object.defineProperty来监听Vue<strong>实例</strong>上的　reversedMsg　属性. 然后会执行sharedPropertyDefinition中的get或set函数的。因此只要我们的data对象中的某个属性发生改变的话, 我们的reversedMsg方法中依赖了该属性的话, 也会调用sharedPropertyDefinition方法中的get/set方法的。<br>但是在我们的页面第一次初始化的时候, 我们要如何初始化执行　computed中的对应方法呢？<br>因此我们现在需要再回到 vue/src/core/instance/init.js 中的_init()方法中，接着需要看下面的代码; 如下代码:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">Vue.prototype._init = function (options?: Object) {
  ...... 更多的代码已省略
  /*
   vm = {
     $attrs: {},
     $children: [],
     $listeners: {},
     $options: {
       components: {},
       computed: {
         reversedMsg: f reversedMsg(){}
       },
       data: function mergedInstanceDataFn () {
          .....
      　},
       el: '#app',
       ..... 更多参数
     }
   };
  */
  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
  ...... 更多的代码已省略
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>因此执行　vm.mount(vm.mount(vm.options.el); 这句代码了; 该代码的作用是对我们的页面中的模板进行编译操作。<br>该代码在　vue/src/platforms/web/entry-runtime-with-compiler.js 中。具体的内部代码我们先不看, 在下一个章节中我们会有讲解该内部代码的。我们只需要看该js中的最后一句代码即可, 如下代码:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
  ): Component{
  ..... 省略很多很多代码
  return mount.call(this, el, hydrating);
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>最后一句代码, 会调用　mount.call(this, el, hydrating);　这句代码; 因此会找到　vue/src/platforms/web/runtime/index.js　中的代码:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el &amp;&amp; inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>接着执行代码　mountComponent(this, el, hydrating); 会找到　vue/src/core/instance/lifecycle.js 中代码</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">export function mountComponent() {
  ..... 省略很多代码

  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted &amp;&amp; !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)

  .... 省略很多代码
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>在这里我们就可以看到, 我们对Watcher进行<strong>实例</strong>化了, new Watcher(); 因此我们又回到了vue/src/core/observer/watcher.js 中对代码进行初始化;</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">export default class Watcher {
  ..... 省略很多代码
  constructor() {
    .... 省略很多代码
  this.value = this.lazy　? undefined　: this.get();
  }
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>此时this.lazy = false; 因此会执行 this.get()函数, 该函数代码如下：</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">get () {
  pushTarget(this)
  let value
  const vm = this.vm
  try {
    value = this.getter.call(vm, vm)
  } catch (e) {
    if (this.user) {
      handleError(e, vm, `getter for watcher "${this.expression}"`)
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value)
    }
    popTarget()
    this.cleanupDeps()
  }
  return value
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>也就是说执行了 this.getter.call(vm, vm)方法; 最后就执行到 vue/src/core/instance/state.js中如下代码:</p>
<!-- /wp:paragraph -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers &amp;&amp; this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>因此最后就返回 watcher.value 值了, 就是我们的computed的reversedMsg返回的值了。如上就是整个computed执行的过程，它最主要也是通过事件的发布-订阅模式来监听对象数据的变化实现的。如上只是简单的理解下源码如何做到的, 等稍后会有章节 讲解 new Vue({}) <strong>实例</strong>话，到底做了那些事情, 我们会深入讲解到的。<br>对于methods及watcher也是一样的，后续会更深入的讲解到。</p>
<!-- /wp:paragraph -->