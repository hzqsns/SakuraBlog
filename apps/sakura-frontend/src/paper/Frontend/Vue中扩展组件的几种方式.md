---
title: Vue中扩展组件的几种方式
excerpt: ''
author: Sakura
publishDate: '2023-01-25'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/129869650_p0_master1200.jpg'
slug: 'frontend-vue-extend-module'
date: 2023-01-25 19:06:00
tags:
    - Vue
category:
    - 前端
---

<!-- wp:paragraph -->
<p>软件编程有一个重要的原则是 D.R.Y（Don't Repeat Yourself），讲的是尽量复用代码和逻辑，减少重复。组件扩展可以避免重复代码，更易于快速开发和维护。那么，扩展 Vue 组件的最佳方法是什么？</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Vue 提供了不少 API 和模式来支持组件复用和扩展，你可以根据自己的目的和偏好来选择。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>本文介绍几种比较常见的方法和模式，希望对你有所帮助。</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2>扩展组件是否必要</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>要知道，所有的组件扩展方法都会增加复杂性和额外代码，有时候还会增加性能消耗。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>因此，在决定扩展组件之前，最好先看看有没有其他更简单的设计模式能完成目标。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>下面几种组件设计模式通常足够替代扩展组件了：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li><code>props</code> 配合模板逻辑</li><li>slot 插槽</li><li>JavaScript 工具函数</li></ul>
<!-- /wp:list -->

<!-- wp:heading {"level":4} -->
<h4><code>props</code> 配合模板逻辑</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>最简单的方法是通过<code>props</code>结合模板条件渲染，来实现组件的多功能。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>比如通过 <code>type</code> 属性： <em>MyVersatileComponent.vue</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;template&gt;
  &lt;div class="wrapper"&gt;
    &lt;div v-if="type === 'a'"&gt;...&lt;/div&gt;
    &lt;div v-else-if="type === 'b'"&gt;...&lt;/div&gt;
    &lt;!--etc etc--&gt;
  &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
export default {
  props: { type: String },
  ...
}
&lt;/script&gt;

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>使用组件的时候传不同的<code>type</code>值就能实现不同的结果。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// *ParentComponent.vue*
&lt;template&gt;
  &lt;MyVersatileComponent type="a" /&gt;
  &lt;MyVersatileComponent type="b" /&gt;
&lt;/template&gt;
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>如果出现下面两种情况，就说明这种模式不适用了，或者用法不对：</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol><li>组件组合模式把状态和逻辑分解成原子部分，从而让应用具备可扩展性。如果组件内存在大量条件判断，可读性和可维护性就会变差。</li><li>props 和模板逻辑的本意是让组件动态化，但是也存在运行时资源消耗。如果你利用这种机制在运行时解决代码组合问题，那是一种反模式。</li></ol>
<!-- /wp:list -->

<!-- wp:heading {"level":4} -->
<h4>slot（插槽）</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>另一种可避免组件扩展的方式是利用 <a target="_blank" href="https://link.juejin.cn?target=https%3A%2F%2Fvuejs.org%2Fv2%2Fguide%2Fcomponents-slots.html" rel="noreferrer noopener">slots（插槽）</a>，就是让父组件在子组件内设置自定义内容。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// *MyVersatileComponent.vue*
&lt;template&gt;
  &lt;div class="wrapper"&gt;
    &lt;h3&gt;Common markup&lt;/div&gt;
    &lt;slot /&gt;
  &lt;/div&gt;
&lt;/template&gt;

</code></pre>
<!-- /wp:code -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// *ParentComponent.vue*
&lt;template&gt;
  &lt;MyVersatileComponent&gt;
    &lt;h4&gt;Inserting into the slot&lt;/h4&gt;
  &lt;/MyVersatileComponent&gt;
&lt;/template&gt;

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>渲染结果：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;div class="wrapper"&gt;
  &lt;h3&gt;Common markup&lt;/div&gt;
  &lt;h4&gt;Inserting into the slot&lt;/h4&gt;
&lt;/div&gt;

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>这种模式有一个潜在约束， slot 内的元素从属于父组件的上下文，在拆分逻辑和状态时可能不太自然。<code>scoped slot</code>会更灵活，后面会在无渲染组件一节里提到。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4>JavaScript 工具函数</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>如果只需要在各组件之间复用独立的函数，那么只需要抽取这些 JavaScript 模块就行了，根本不需要用到组件扩展模式。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>JavaScript 的模块系统是一种非常灵活和健壮的代码共享方式，所以你应该尽可能地依靠它。 <em>MyUtilityFunction.js</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>export default function () {
  ...
}

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><em>MyComponent.vue</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>import MyUtilityFunction from "./MyUtilityFunction";
export default {
  methods: {
    MyUtilityFunction
  }
}

</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>扩展组件的几种模式</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>如果你已经考虑过以上几种简单的模式，但这些模式还不够灵活，无法满足需求。那么就可以考虑扩展组件了。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>扩展 Vue 组件最流行的方法有以下四种：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li><a target="_blank" href="https://link.juejin.cn?target=https%3A%2F%2Fvuejsdevelopers.com%2F2017%2F06%2F11%2Fvue-js-extending-components%2F%23composition-functions" rel="noreferrer noopener">Composition 函数</a></li><li><a target="_blank" href="https://link.juejin.cn?target=https%3A%2F%2Fvuejsdevelopers.com%2F2017%2F06%2F11%2Fvue-js-extending-components%2F%23mixins" rel="noreferrer noopener">mixin</a></li><li><a target="_blank" href="https://link.juejin.cn?target=https%3A%2F%2Fvuejsdevelopers.com%2F2017%2F06%2F11%2Fvue-js-extending-components%2F%23higher-order-components" rel="noreferrer noopener">高阶组件（HOC）</a></li><li><a target="_blank" href="https://link.juejin.cn?target=https%3A%2F%2Fvuejsdevelopers.com%2F2017%2F06%2F11%2Fvue-js-extending-components%2F%23renderless-components" rel="noreferrer noopener">无渲染组件</a></li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>每一种方法都有其优缺点，根据使用场景，或多或少都有适用的部分。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Composition 函数</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>组件之间共享状态和逻辑的最新方案是 Composition API。这是 Vue 3 推出的 API，也可以在 Vue 2 里当插件使用。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>跟之前在组件定义配置对象里声明<code>data</code>，<code>computed</code>，<code>methods</code>等属性的方式不同，Composition API 通过一个 <code>setup</code> 函数声明和返回这些配置。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>比如，用 Vue 2 配置属性的方式声明 <em>Counter</em> 组件是这样的： <em>Counter.vue</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;template&gt;
  &lt;button @click="increment"&gt;
    Count is: {{ count }}, double is: {{ double }}
  &lt;/button&gt;
&lt;template&gt;
&lt;script&gt;
export default {
  data: () =&gt; ({
    count: 0
  }),
  methods: {
    increment() {
      this.count++;
    }
  },
  computed: {
    double () {
      return this.count * 2;
    }
  }
}
&lt;/script&gt;

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>用 Composition API 重构这个组件，功能完全一样： <em>Counter.vue</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;template&gt;&lt;!--as above--&gt;&lt;template&gt;
&lt;script&gt;
import { reactive, computed } from "vue";

export default {
  setup() {
    const state = reactive({
      count: 0,
      double: computed(() =&gt; state.count * 2)
    });

    function increment() {
      state.count++
    }

    return {
      count,
      double,
      increment
    }
  }
}
&lt;/script&gt;
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>用 Composition API 声明组件的主要好处之一是，逻辑复用和抽取变得非常轻松。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>进一步重构，把计数器的功能移到 JavaScript 模块 <code>useCounter.js</code>中： <em>useCounter.js</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>import { reactive, computed } from "vue";

export default function {
  const state = reactive({
    count: 0,
    double: computed(() =&gt; state.count * 2)
  });

  function increment() {
    state.count++
  }

  return {
    count,
    double,
    increment
  }
}

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>现在，计数器功能可以通过<code>setup</code>函数无缝引入到任意 Vue 组件中： <em>MyComponent.vue</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;template&gt;&lt;!--as above--&gt;&lt;/template&gt;
&lt;script&gt;
import useCounter from "./useCounter";

export default {
  setup() {
    const { count, double, increment } = useCounter();
    return {
      count,
      double,
      increment
    }
  }
}
&lt;/script&gt;
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Composition 函数让功能模块化、可重用，是扩展组件最直接和低成本的方式。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4>Composition API 的缺点</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Composition API 的缺点其实不算什么——可能就是看起来有点啰嗦，并且新的用法对一些 Vue 开发者来说有点陌生。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>关于 Composition API 优缺点的讨论，推荐阅读：<a target="_blank" href="https://link.juejin.cn?target=https%3A%2F%2Fvuejsdevelopers.com%2F2020%2F02%2F17%2Fvue-composition-api-when-to-use" rel="noreferrer noopener">When To Use The New Vue Composition API (And When Not To)</a></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>mixin</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>如果你还在用 Vue 2，或者只是喜欢用配置对象的方式定义组件功能，可以用 mixin 模式。mixin 把公共逻辑和状态抽取到单独的对象，跟使用 mixin 的组件内部定义对象合并。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>我们继续用之前的<em>Counter</em>组件例子，把公共逻辑和状态放到<em>CounterMixin.js</em>模块中。 <em>CounterMixin.js</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>export default {
  data: () =&gt; ({
    count: 0
  }),
  methods: {
    increment() {
      this.count++;
    }
  },
  computed: {
    double () {
      return this.count * 2;
    }
  }
}

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>使用 mixin 也很简单，只要导入对应模块并在<code>mixins</code>数组里加上变量就行。组件初始化时会把 mixin 对象与组件内部定义对象合并。 <em>MyComponent.vue</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>import CounterMixin from "./CounterMixin";

export default {
  mixins: &#91;CounterMixin],
  methods: {
    decrement() {
      this.count--;
    }
  }
}
</code></pre>
<!-- /wp:code -->

<!-- wp:heading {"level":4} -->
<h4>选项合并</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>如果组件内的选项跟 mixin 冲突怎么办？</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>比如，给组件定义一个自带的<code>increment</code>&nbsp;方法，哪个优先级更高呢？ <em>MyComponent.vue</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>import CounterMixin from "./CounterMixin";

export default {
  mixins: &#91;CounterMixin],
  methods: {
    // 自带的 `increment`` 方法会覆盖 mixin 的`increment` 吗？
    increment() { ... }
  }
}

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>这个时候就要说到 Vue 的合并策略了。Vue 有一系列的规则，决定了如何处理同名选项。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>通常，组件自带的选项会覆盖来自 mixin 的选项。但也有例外，比如同类型的生命周期钩子，不是直接覆盖，而是都放进数组，按顺序执行。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>你也可以通过 <a target="_blank" href="https://link.juejin.cn?target=https%3A%2F%2Fvuejs.org%2Fv2%2Fguide%2Fmixins.html%23Custom-Option-Merge-Strategies" rel="noreferrer noopener">自定义合并策略</a> 改变默认行为。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4>mixin 的缺点</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>作为扩展组件的一种模式，mixin 对于简单的场景还算好用，一旦规模扩大，问题就来了。不仅需要注意命名冲突问题（尤其是第三方 mixin），使用了多个 mixin 的组件，很难搞清楚某个功能到底来自于哪里，定位问题也比较困难。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>高阶组件</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>高阶组件（HOC）是从 React 借用的概念，Vue 也能使用。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>为了理解这个概念，我们先抛开组件，看看两个简单的 JavaScript 函数，<code>increment</code>&nbsp;和 <code>double</code>。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>function increment(x) {
  return x++;
}

function double(x) {
  return x * 2;
}

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>假设我们想给这两个函数都加一个功能：在控制台输出结果。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>为此，我们可以用<em>高阶函数</em>模式，新建一个&nbsp;<code>addLogging</code>函数，接受函数作为参数，并返回一个带有新增功能的函数。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>function addLogging(fn) {
  return function(x) {
    const result = fn(x);
    console.log("The result is: ", result);
    return result;
  };
}

const incrementWithLogging = addLogging(increment);
const doubleWithLogging = addLogging(double);

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>组件如何利用这种模式呢？类似地，我们创建一个高阶组件来渲染<em>Counter</em>组件，同时添加一个<code>decrement</code>方法作为实例属性。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>实际代码比较复杂，这里只给出伪代码作为示意：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>import Counter from "./Counter";

// 伪代码
const CounterWithDecrement =&gt; ({
  render(createElement) {
    const options = {
      decrement() {
        this.count--;
      }
    }
    return createElement(Counter, options);
  }
});

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>HOC 模式比 mixin 更简洁，扩展性更好，但是代价是增加了一个包裹组件，实现起来也需要技巧。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>无渲染组件</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>如果需要在多个组件上使用相同的逻辑和状态，只是展示方式不同，那么就可以考虑<em>无渲染组件</em>模式。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>该模式需要用到两类组件：<em>逻辑</em>组件用于声明逻辑和状态，<em>展示</em>组件用于展示数据。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4>逻辑组件</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>还是回到<em>Counter</em>的例子，假设我们需要在多个地方重用这个组件，但是展示方式不同。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>创建一个<em>CounterRenderless.js</em>&nbsp;用于定义逻辑组件，包含逻辑和状态，但是不包含模板，而是通过 <code>render</code>函数声明 <code>scoped slot</code>。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><code>scoped slot</code>暴露三个属性给父组件使用：状态<code>count</code>，方法<code>increment</code> 和计算属性 <code>double</code>。 <em>CounterRenderless.js</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>export default {
  data: () =&gt; ({
    count: 0
  }),
  methods: {
    increment() {
      this.count++;
    }
  },
  computed: {
    double () {
      return this.count * 2;
    }
  },
  render() {
    return this.$scopedSlots.default({
      count: this.count,
      double: this.double,
      increment: this.toggleState,
    })
  }
}

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>这里的<code>scoped slot</code>是这种模式里逻辑组件的关键所在。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4>展示组件</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>接下来是<em>展示组件</em>，作为无渲染组件的使用方，提供具体的展示方式。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>所有的元素标签都包含在<code>scoped slot</code>里。可以看到，这些属性在使用上跟模板直接放在逻辑组件里没什么两样。 <em>CounterWithButton.vue</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;template&gt;
  &lt;counter-renderless slot-scope="{ count, double, increment }"&gt;
    &lt;div&gt;Count is: {{ count }}&lt;/div&gt; 
    &lt;div&gt;Double is: {{ double }}&lt;/div&gt;
    &lt;button @click="increment"&gt;Increment&lt;/button&gt;
  &lt;/counter-renderless&gt;
&lt;/template&gt;
&lt;script&gt;
import CounterRenderless from "./CountRenderless";
export default {
  components: {
    CounterRenderless
  }
}
&lt;/script&gt;

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>无渲染组件模式非常灵活，也容易理解。但是，它没有前面那几种方法那么通用，可能只有一种应用场景，那就是用于开发组件库。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>模板扩展</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>上面的 API 也好，设计模式也罢，都有一种局限性，就是无法扩展组件的<strong>模板</strong>。Vue 在逻辑和状态方面有办法重用，但是对于模板标签就无能为力了。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>有一种比较 hack 的方式，就是利用 HTML 预处理器，比如 Pug，来处理模板扩展。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>第一步是创建一个基础模板*.pug*文件，包含公共的页面元素。还要包含一个&nbsp;<code>block input</code>&nbsp;，作为模板扩展的占位符。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><em>BaseTemplate.pug</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>div.wrapper
  h3 {{ myCommonProp }} &lt;!--common markup--&gt;
  block input &lt;!--extended markup outlet --&gt;

</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>为了能扩展这个模板，需要安装 Vue Loader 的 Pug 插件。然后就可以引入基础模板并利用<code>block input</code>语法替换占位部分了： <em>MyComponent.vue</em></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;template lang="pug"&gt;
  extends BaseTemplate.pug
  block input
    h4 {{ myLocalProp }} &lt;!--gets included in the base template--&gt;
&lt;/template&gt;
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->
