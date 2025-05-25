---
title: require和import的区别
excerpt: '' 
author: Sakura
publishDate: '2022-11-14'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/127757563_p0_master1200.jpg' 
slug: 'frontend-import-require'
date: 2022-11-14 18:54:00
tags:
  - NodeJS
  - ESM
category:
  - 前端
---
<!-- wp:heading -->
<h2>前言</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>这个问题也可以变为 commonjs模块和ES6模块的区别；下面就通过一些例子来说明它们的区别。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>先来一道面试题测验一下：下面代码输出什么</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// base.js<br>let count = 0;<br>setTimeout(() =&gt; {<br> &nbsp; &nbsp;console.log("base.count", ++count); // 1<br>}, 500)<br>​<br>module.exports.count = count;<br>​<br>// commonjs.js<br>const { count } = require('./base');<br>setTimeout(() =&gt; {<br> &nbsp; &nbsp; console.log("count is" + count + 'in commonjs'); // 0<br>}, 1000)<br>​<br>​<br>// base1.js<br>let count = 0;<br>setTimeout(() =&gt; {<br> &nbsp; &nbsp;console.log("base.count", ++count); // 1<br>}, 500)<br>exports const count = count;<br>​<br>// es6.js<br>import { count } from './base1';<br>setTimeout(() =&gt; {<br> &nbsp; &nbsp; console.log("count is" + count + 'in es6'); // 1<br>}, 1000)</code></pre>
<!-- /wp:code -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>注意上面的ES6模块的代码不能直接在 node 中执行。可以把文件名称后缀改为<code>.mjs</code>, 然后执行 <code>node --experimental-modules es6.mjs</code>，或者自行配置babel。</p></blockquote>
<!-- /wp:quote -->

<!-- wp:heading -->
<h2>目录</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>CommonJS</li><li>ES6模块</li><li>ES6模块和CommonJs模块两大区别</li><li>总结</li></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>CommonJs</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>CommonJS 模块的加载原理</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>CommonJs 规范规定，每个模块内部，<code>module</code>变量代表当前模块。这个变量是一个对象，它的 <code>exports</code>属性（即<code>module.exports</code>）是对外的接口，加载某个模块，其实是加载该模块的<code>module.exports</code>属性。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>const x = 5;<br>const addX = function (value) {<br> &nbsp;return value + x;<br>};<br>module.exports.x = x;<br>module.exports.addX = addX;</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码通过module.exports输出变量x和函数addX。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>require方法用于加载模块。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>const example = require('./example.js');<br>​<br>console.log(example.x); // 5<br>console.log(example.addX(1)); // 6</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>CommonJS 模块的特点如下：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>所有代码运行在模块作用域，不会污染全局作用域</li><li>模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。</li><li>模块加载的顺序，按照其在代码中出现的顺序</li></ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3>module对象</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Node内部提供一个Module构建函数。所有模块都是Module的实例。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>function Module(id, parent) {<br> &nbsp;this.id = id;<br> &nbsp;this.exports = {};<br> &nbsp;this.parent = parent;<br> &nbsp;// ...<br>}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>每个模块内部，都有一个module对象，代表当前模块。它有以下属性。</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>module.id 模块的识别符，通常是带有绝对路径的模块文件名。</li><li>module.filename 模块的文件名，带有绝对路径。</li><li>module.loaded 返回一个布尔值，表示模块是否已经完成加载。</li><li>module.parent 返回一个对象，表示调用该模块的模块。</li><li>module.children 返回一个数组，表示该模块要用到的其他模块。</li><li>module.exports 表示模块对外输出的值。</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>module.exports属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>为了方便，Node为每个模块提供一个exports变量，指向module.exports。这等同在每个模块头部，有一行这样的命令</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>const exports = module.exports;</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>注意，不能直接将exports变量指向一个值，因为这样等于切断了exports与module.exports的联系。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>exports = function(x) {console.log(x)};</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面这样的写法是无效的，因为exports不再指向module.exports了。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>下面的写法也是无效的。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>exports.hello = function() {<br> &nbsp;return 'hello';<br>};<br>​<br>module.exports = 'Hello world';</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码中，hello函数是无法对外输出的，因为module.exports被重新赋值了。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这意味着，如果一个模块的对外接口，就是一个单一的值，最好不要使用exports输出，最好使用module.exports输出。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>module.exports = function (x){ console.log(x);};</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>如果你觉得，exports与module.exports之间的区别很难分清，一个简单的处理方法，就是放弃使用exports，只使用module.exports。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>模块的缓存</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>第一次加载某个模块时，Node会缓存该模块。以后再加载该模块，就直接从缓存取出该模块的module.exports属性。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>require('./example.js');<br>require('./example.js').message = "hello";<br>require('./example.js').message<br>// "hello"</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码中，连续三次使用require命令，加载同一个模块。第二次加载的时候，为输出的对象添加了一个message属性。但是第三次加载的时候，这个message属性依然存在，这就证明require命令并没有重新加载模块文件，而是输出了缓存。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>如果想要多次执行某个模块，可以让该模块输出一个函数，然后每次require这个模块的时候，重新执行一下输出的函数。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>所有缓存的模块保存在require.cache之中，如果想删除模块的缓存，可以像下面这样写。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// 删除指定模块的缓存<br>delete require.cache&#91;moduleName];<br><br>// 删除所有模块的缓存<br>Object.keys(require.cache).forEach(function(key) {<br>  delete require.cache&#91;key];<br>})</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>注意，缓存是根据绝对路径识别模块的，如果同样的模块名，但是保存在不同的路径，require命令还是会重新加载该模块。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>ES6模块</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// CommonJS模块<br>let { stat, exists, readFile } = require('fs');<br><br>// 等同于<br>let _fs = require('fs');<br>let stat = _fs.stat;<br>let exists = _fs.exists;<br>let readfile = _fs.readfile;</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码的实质是整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），然后再从这个对象上面读取 3 个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// ES6模块<br>import { stat, exists, readFile } from 'fs';</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码的实质是从fs模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>export命令</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ES6的模块功能主要由两个命令构成：<code>export</code> 和 <code>import</code>。 export 命令用于规定模块的对外接口。import 命令用于输入 其他模块提供的功能。</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>ES6模块必须用export导出</li><li>export 必须与模块内部的变量建立一一对应关系</li></ul>
<!-- /wp:list -->

<!-- wp:list {"ordered":true} -->
<ol><li>一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量。</li></ol>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>export const firstName = 'Michael';<br>export function multiply(x, y) {<br>  return x * y;<br>};</code></pre>
<!-- /wp:code -->

<!-- wp:list {"ordered":true} -->
<ol><li>export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。</li></ol>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// 报错<br>export 1;<br><br>// 报错<br>const m = 1;<br>export m;</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面两种写法都会报错，因为没有提供对外的接口。第一种写法直接输出 1，第二种写法通过变量m，还是直接输出 1。1只是一个值，不是接口。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// 写法一<br>export const m = 1;<br><br>// 写法二<br>const m = 1;<br>export {m};<br><br>// 写法三<br>const n = 1;<br>export {n as m};</code></pre>
<!-- /wp:code -->

<!-- wp:heading {"level":3} -->
<h3>import命令</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>import命令输入的变量都是只读的</li><li>import命令具有提升效果</li><li>import是静态执行，所以不能使用表达式和变量</li><li>import语句是 Singleton 模式</li></ul>
<!-- /wp:list -->

<!-- wp:list {"ordered":true} -->
<ol><li>import命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。</li></ol>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>import {a} from './xxx.js'<br><br>a = {}; // Syntax Error : 'a' is read-only;</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码中，脚本加载了变量a，对其重新赋值就会报错，因为a是一个只读的接口。但是，如果a是一个对象，改写a的属性是允许的。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>import {a} from './xxx.js'<br><br>a.foo = 'hello'; // 合法操作</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码中，a的属性可以成功改写，并且其他模块也可以读到改写后的值。不过，这种写法很难查错，建议凡是输入的变量，都当作完全只读，不要轻易改变它的属性。</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol><li>import命令具有提升效果，会提升到整个模块的头部，首先执行。</li></ol>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>foo();<br><br>import { foo } from 'my_module';</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>这种行为的本质是，import命令是编译阶段执行的，在代码运行之前。</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol><li>import是静态执行，所以不能使用表达式和变量</li></ol>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// 报错<br>import { 'f' + 'oo' } from 'my_module';<br><br>// 报错<br>let module = 'my_module';<br>import { foo } from module;</code></pre>
<!-- /wp:code -->

<!-- wp:list {"ordered":true} -->
<ol><li>如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次。</li></ol>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>import { foo } from 'my_module';<br>import { bar } from 'my_module';<br><br>// 等同于<br>import { foo, bar } from 'my_module';</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码中，虽然foo和bar在两个语句中加载，但是它们对应的是同一个my_module实例。也就是说，import语句是 <code>Singleton</code> 模式。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>export default 命令</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li><code>export default</code>就是输出一个叫做default的变量或方法</li><li><code>export default</code> 所以它后面不能跟变量声明语句</li></ul>
<!-- /wp:list -->

<!-- wp:list {"ordered":true} -->
<ol><li>本质上，<code>export default</code>就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字。</li></ol>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// modules.js<br>function sayHello() {<br>  console.log('哈哈哈')<br>}<br>export { sayHello as default};<br>// 等同于<br>// export default sayHello;<br><br>// app.js<br>import { default as sayHello } from 'modules';<br>// 等同于<br>// import sayHello from 'modules';</code></pre>
<!-- /wp:code -->

<!-- wp:list {"ordered":true} -->
<ol><li>正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句。</li></ol>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// 正确<br>export const a = 1;<br><br>// 正确<br>const a = 1;<br>export default a;<br><br>// 错误<br>export default const a = 1;</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码中，export default a的含义是将变量a的值赋给变量default。所以，最后一种写法会报错。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>同样地，因为export default命令的本质是将后面的值，赋给default变量，所以可以直接将一个值写在export default之后。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// 正确<br>export default 42;<br><br>// 报错<br>export 42;</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码中，后一句报错是因为没有指定对外的接口，而前一句指定对外接口为default。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>export 和 import 的复合写法</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>在一个模块里导入同时导出模块</li></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>export { foo, bar } from 'my_module';<br><br>// 可以简单理解为<br>import { foo, bar } from 'my_module';<br>export { foo, bar };</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>写成一行以后，foo和bar实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用foo和bar。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>export { es6 as default } from './someModule';<br><br>// 等同于<br>import { es6 } from './someModule';<br>export default es6;</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在平常开发中这种常被用到，有一个utils目录，目录下面每个文件都是一个工具函数，这时候经常会创建一个index.js文件作为 utils的入口文件，index.js中引入utils目录下的其他文件，其实这个index.js其的作用就是一个对外转发 utils 目录下 所有工具函数的作用，这样其他在使用 utils 目录下文件的时候可以直接 通过 <code>import { xxx } from './utils'</code> 来引入。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>ES6模块和CommonJs模块主要有以下两大区别</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>CommonJs模块输出的是一个值的拷贝，ES6模块输出的是值的引用。</li><li>CommonJs模块是运行时加载，ES6模块是编译时输出接口。</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>第二个差异是因为 CommonJS 加载的是一个对象（即module.exports属性）。该对象只有在脚本运行完才会生成。而ES6模块不是对象，它的对外接口只是一种静态定义，在代码静态编译阶段就会生成。</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>在传统编译语言的流程中，程序中的一段源代码在执行之前会经历三个步骤，统称为编译。”分词/词法分析“ -&gt; ”解析/语法分析“ -&gt; "代码生成"。</p></blockquote>
<!-- /wp:quote -->

<!-- wp:paragraph -->
<p>下面来解释一下第一个区别 CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。请看下面这个模块文件lib.js的例子。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// lib.js<br>const counter = 3;<br>function incCounter() {<br>  counter++;<br>}<br>module.exports = {<br>  counter: counter,<br>  incCounter: incCounter,<br>};</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码输出内部变量counter和改写这个变量的内部方法incCounter。然后，在main.js里面加载这个模块。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// main.js<br>const mod = require('./lib');<br><br>console.log(mod.counter);  // 3<br>mod.incCounter();<br>console.log(mod.counter); // 3</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码说明，lib.js 模块加载以后，它的内部变化就影响不到输出的 mod.counter了。这是因为 mod.counter是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// lib.js<br>const counter = 3;<br>function incCounter() {<br>  counter++;<br>}<br>module.exports = {<br>  get counter() {<br>    return counter<br>  },<br>  incCounter: incCounter,<br>};</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码中，输出的counter属性实际上是一个取值器函数。现在再执行main.js，就可以正确读取内部变量counter的变动了。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>3<br>4</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>还是举上面的例子。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// lib.js<br>export let counter = 3;<br>export function incCounter() {<br>  counter++;<br>}<br><br>// main.js<br>import { counter, incCounter } from './lib';<br>console.log(counter); // 3<br>incCounter();<br>console.log(counter); // 4</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码说明，ES6 模块输入的变量counter是活的，完全反应其所在模块lib.js内部的变化。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>再举一个出现在export一节中的例子。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// m1.js<br>export const foo = 'bar';<br>setTimeout(() =&gt; foo = 'baz', 500);<br><br>// m2.js<br>import {foo} from './m1.js';<br>console.log(foo);<br>setTimeout(() =&gt; console.log(foo), 500);</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码中，m1.js的变量foo，在刚加载时等于bar，过了 500 毫秒，又变为等于baz。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>让我们看看，m2.js能否正确读取这个变化。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>bar<br>baz</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码表明，ES6 模块不会缓存运行结果，而是动态地去被加载的模块取值，并且变量总是绑定其所在的模块。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// lib.js<br>export let obj = {};<br><br>// main.js<br>import { obj } from './lib';<br><br>obj.prop = 123; // OK<br>obj = {}; // TypeError</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面代码中，<code>main.js</code>从lib.js输入变量obj，可以对obj添加属性，但是重新赋值就会报错。因为变量obj指向的地址是只读的，不能重新赋值，这就好比main.js创造了一个名为obj的const变量。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>最后，export通过接口，输出的是同一个值。不同的脚本加载这个接口，得到的都是同样的实例。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// mod.js<br>function C() {<br>  this.sum = 0;<br>  this.add = function () {<br>    this.sum += 1;<br>  };<br>  this.show = function () {<br>    console.log(this.sum);<br>  };<br>}<br><br>export let c = new C();</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面的脚本mod.js，输出的是一个C的实例。不同的脚本加载这个模块，得到的都是同一个实例。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// x.js<br>import {c} from './mod';<br>c.add();<br><br>// y.js<br>import {c} from './mod';<br>c.show();<br><br>// main.js<br>import './x';<br>import './y';</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>现在执行main.js，输出的是1。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这就证明了x.js和y.js加载的都是C的同一个实例。</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>在平常开发中这种常被用到，有一个utils目录，目录下面每个文件都是一个工具函数，这时候经常会创建一个index.js文件作为 utils的入口文件，index.js中引入utils目录下的其他文件，其实这个index.js其的作用就是一个对外转发 utils 目录下 所有工具函数的作用，这样其他在使用 utils 目录下文件的时候可以直接 通过 import { xxx } from './utils' 来引入。</p></blockquote>
<!-- /wp:quote -->

<!-- wp:heading -->
<h2>总结</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>CommonJs模块输出的是一个值的拷贝，ES6模块输出的是值的引用。</li><li>CommonJs模块是运行时加载，ES6模块是编译时输出接口。</li></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>再来几道题检查一下</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>下面代码输出什么</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// index.js<br>console.log('running index.js');<br>import { sum } from './sum.js';<br>console.log(sum(1, 2));<br><br>// sum.js<br>console.log('running sum.js');<br>export const sum = (a, b) =&gt; a + b;</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>答案: <code>running sum.js, running index.js, 3</code>。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>import命令是编译阶段执行的，在代码运行之前。因此这意味着被导入的模块会先运行，而导入模块的文件会后执行。 这是CommonJS中require（）和import之间的区别。使用require()，您可以在运行代码时根据需要加载依赖项。 如果我们使用require而不是import，running index.js，running sum.js，3会被依次打印。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// module.js <br>export default () =&gt; "Hello world"<br>export const name = "Lydia"<br><br>// index.js <br>import * as data from "./module"<br><br>console.log(data)</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>答案：<code>{ default: function default(), name: "Lydia" }</code></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>使用import * as name语法，我们将module.js文件中所有export导入到index.js文件中，并且创建了一个名为data的新对象。 在module.js文件中，有两个导出：默认导出和命名导出。 默认导出是一个返回字符串“Hello World”的函数，命名导出是一个名为name的变量，其值为字符串“Lydia”。 data对象具有默认导出的default属性，其他属性具有指定exports的名称及其对应的值。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// counter.js<br>let counter = 10;<br>export default counter;<br>// index.js<br>import myCounter from "./counter";<br>​<br>myCounter += 1;<br>​<br>console.log(myCounter);</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>答案：<code>Error</code></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>引入的模块是 只读 的: 你不能修改引入的模块。只有导出他们的模块才能修改其值。 当我们给myCounter增加一个值的时候会抛出一个异常： myCounter是只读的，不能被修改。</p>
<!-- /wp:paragraph -->
