---
title: 对Vue3中Reactive实现的讨论
excerpt: '' 
author: Sakura
publishDate: '2024-08-26'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/129597106_p0_master1200.jpg' 
slug: 'frontend-vue3-reactive'
date: 2024-08-26 22:20:00
tags:
  - Vue3
category:
  - 前端
---

## 概述
Vue 3 响应式系统的基本原理是在你的代码访问或修改对象属性时，它可以“监听”到这些操作并在需要的时候执行一些额外的操作，例如重新渲染视图。
这个机制的核心就是 Vue 提供的 `reactive` 函数。当你需要让一个普通的 JavaScript 对象变得"响应式"时，你可以使用这个函数。具体来说，就是这样：
```javascript
const data = reactive({ count: 0 });
```

现在，`data` 这个对象的属性，如 `count`，已经被 Vue "监听"到了。这意味着，当你在你的代码中访问或修改属性 `count` 时，Vue 能够知道你在做这些操作，并且在需要的时候根据这些操作执行其他操作。例如，如果你在一个模板中使用了 `count`，那么每次修改 `count` 时， Vue 就会自动更新这个模板。

整个响应式系统的核心就是：当访问属性时，Vue 会"记住"哪些地方用到了这个属性值；当属性值发生变化时，Vue 就会在这些地方做出相应的变化。这就实现了所谓的“数据驱动视图”，你只需要关心如何处理数据，而不需要手动更新视图，有了一个初步印象之后接下来让我们深入探讨具体的实现。

# Vue 3 中 Reactive 的原理及实现

`reactive` 是 Vue 3 响应式系统的核心之一，它用于将一个普通对象转换为响应式对象。本文尝试讲解 `reactive` 的依赖收集和触发原理，并通过一个简单示例来展示它们是如何工作的。

## 示例

在 Vue 3 中，我们通过 `reactive` 函数创建响应式对象，这个对象会对输入对象进行代理（proxy），拦截此对象的属性访问和修改操作。当我们访问对象属性时（如 `user.name`），会进行依赖收集，即如果有函数依赖于此属性，将这些依赖记录下来。当我们修改对象属性时（如 `user.name = 'Bob'`），会触发依赖重新执行（触发重新渲染），我一直对这个依赖收集和依赖触发不是很理解，下面举一个例子。


假设我们有一个简单的用户对象，如下所示：

```javascript
const user = { name: "Alice", age: 30 };
```

我们需要在访问 `user.name` 和 `user.age` 时进行依赖收集，以便在这些属性值发生变化时触发重新渲染。我们首先使用 Vue 3 中的 `reactive` 方法将 `user` 对象转换为响应式对象：

```javascript
import { reactive } from "vue";

const user = reactive({ name: "Alice", age: 30 });
```

在这个例子中，`reactive(user)` 返回一个代理对象，它代理了 `user` 的 `get` 和 `set` 操作。

### 依赖收集

依赖收集的核心思想是，在访问对象的属性时，记录使用了该属性的响应式函数（如渲染函数、计算属性或 watch 函数）。之后，当属性值发生变化时，我们可以找到并重新执行这些响应式函数。

假设我们有一个响应式渲染函数 `render`，它将 `user.name` 和 `user.age` 渲染成字符串并打印到控制台：

```javascript
function render() {
  console.log(`Name: ${user.name}, Age: ${user.age}`);
}
```

为了依赖收集，我们需要在 `render` 函数访问 `user.name` 和 `user.age` 时记录这些属性与响应式函数之间的依赖关系。这是通过调用 `track` 函数来实现的：

首先定义一个 `targetMap`，这是一个 `WeakMap` 实例，用于存储跟踪的依赖关系。在这个 `WeakMap` 实例中：
- `key`：响应性对象
- `value`：`Map` 对象
  - `key`：响应性对象的指定属性
  - `value`：指定对象的指定属性的执行函数（Effect）

```javascript
/**
 * 收集所有依赖的 WeakMap 实例：
 */
const targetMap = new WeakMap();
```
在 Vue 的响应式系统中，使用 `WeakMap` 来存储跟踪的依赖关系有以下几个主要原因：

1. 内存优化：`WeakMap` 所持有的 `key` 是弱引用的。这意味着，当它们所引用的对象（在这里是响应式对象）不再被其他地方引用时，这些对象可以被垃圾回收器自动回收。使用 `WeakMap` 能确保内存管理得更加高效，避免因数据绑定导致的潜在的内存泄露问题。

2. 不污染原对象：在 Vue 的响应式系统中，`target` 对象会被 `Proxy` 拦截以进行依赖收集和更新触发。使用 `WeakMap` 使我们能够在不修改原始对象本身的前提下，将依赖关系与原始对象关联起来。

3. 固有特性：根据 `WeakMap` 的设计，`key` 必须是一个对象，这使得它非常适合在这种场景下被用作存储依赖关系。按照 Vue 中的源码实现，`WeakMap` 的 `key` 是响应式对象，而 `value` 是一个普通的 `Map` 实例。这样一来，`targetMap` 能很好的保存有关响应式对象以及它们的属性之间的依赖关系。

总结一下，使用 `WeakMap` 能够带来内存优化、不污染原对象以及按照其设计使用的好处，使响应式系统更加健壮可靠，接下来介绍 `track` 函数，这个函数的作用是收集依赖：

```javascript
// 收集依赖
function track(target, key) {
  // 如果当前不存在执行函数，则直接 return
  if (!activeEffect) return;
  // 尝试从 targetMap 中，根据 target 获取 map
  let depsMap = targetMap.get(target);
  // 如果获取到的 map 不存在，则生成新的 map 对象，并把该对象赋值给对应的 value
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  // 获取指定 key 的 dep
  let dep = depsMap.get(key);
  // 如果 dep 不存在，则生成一个新的 dep（一个 Set 对象），并放入到 depsMap 中
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  // 把所有的 activeEffect 方法加入到 dep 中
  dep.add(activeEffect);
}
```

`track` 函数的详细步骤如下：

1. 判断当前是否存在执行函数（Effect），如果不存在则直接返回。这意味着当前没有进行任何依赖关系的收集。

2. 从 `targetMap` 中，根据目标对象 `target` 获取它对应的 `depsMap`（一个 `Map` 实例）。`depsMap` 用于存储目标对象 `target` 的依赖关系。

3. 如果 `depsMap` 不存在，则创建一个新的 `depsMap`（一个新的 `Map` 实例），并将其与当前的目标对象 `target` 关联。

4. 从 `depsMap` 中获取与指定属性 `key` 相关联的依赖 `dep`。

5. 如果 `dep` 不存在，则创建一个新的 `dep`（一个新的 `Set` 实例），并将其与指定属性 `key` 关联。

6. 将当前执行的 Effect（响应式函数）添加到 `dep` 中，这样当属性值发生变化时，可以触发与其关联的 Effect 进行更新。

这样，通过 `track` 函数的依赖收集过程，在 Vue 应用中完成了数据绑定功能。当响应式数据发生变化时，`trigger` 函数可以运行相关的 Effect，从而更新 UI。

`track` 函数接受两个参数：要进行依赖收集的目标对象（`target`）和属性键（`key`）。在代理对象的 `get` 方法被调用时，`track` 函数也会被调用，例如：

```javascript
function get(target, key, receiver) {
  const value = Reflect.get(target, key, receiver);
  track(target, key); // 进行依赖收集
  return value;
}
```

在 `render` 函数执行过程中，它首次访问了 `user.name` 和 `user.age`。这将调用代理对象的 `get` 方法，从而调用 `track(user, 'name')` 和 `track(user, 'age')`。`track` 函数会根据当前正在执行的响应式函数来记录这些依赖关系。

为了表示正在执行的响应式函数，我们可以使用一个 `effect` 函数作为包装器：

```javascript
function effect(eff) {
  activeEffect = eff; // 设置当前正在执行的响应式函数
  eff(); // 执行响应式函数
  activeEffect = null; // 清空当前正在执行的响应式函数
}

let activeEffect = null;
```

调用 `effect(render)` 会设置 `activeEffect` 为 `render` 函数，并执行 `render` 函数。在 `render` 函数执行期间，`track` 函数会将当前 `activeEffect` （即 `render`） 与访问的属性（`user.name` 和 `user.age`）关联起来。

此时，依赖收集已完成。

### 依赖触发

当 `user.name` 或 `user.age` 的值发生变化时，我们希望重新执行依赖于这些属性的所有响应式函数。为此，我们需要一个 `trigger` 函数用于触发这些依赖关系：



```javascript
/**
 * 触发依赖
 */
function trigger(target, key) {
  // 依据 target 获取存储的 map 实例
  const depsMap = targetMap.get(target);
  // 如果 map 不存在，则直接 return
  if (!depsMap) {
    return;
  }
  // 依据指定的 key，获取 dep 实例
  let dep = depsMap.get(key);
  // dep 不存在则直接 return
  if (!dep) {
    return;
  }
  // 触发 dep
  triggerEffects(dep);
}

/**
 * 依次触发 dep 中保存的依赖
 */
function triggerEffects(dep) {
  // 把 dep 构建为一个数组
  const effects = Array.isArray(dep) ? dep : [...dep];
  // 依次触发
  for (const effect of effects) {
    effect.run();
  }
}
```


下面逐步解释这两个函数的功能：

`trigger` 函数：

1. 根据目标对象 (`target`) 从 `targetMap` 中获取保存的依赖映射实例 (`depsMap`)。
2. 如果 `depsMap` 不存在，直接返回。
3. 根据指定的属性 (`key`) 从 `depsMap` 中获取依赖实例 (`dep`)。
4. 如果 `dep` 不存在，直接返回。
5. 触发 `dep` 中保存的所有副作用 `Effect`，调用 `triggerEffects(dep)` 函数。

`triggerEffects` 函数：

1. 将 `dep` 构建为一个数组（如果 `dep` 本身就是数组则直接使用，否则将其转换为数组）。
2. 遍历数组中的所有副作用 `Effect`，并依次调用它们的 `run` 方法执行。

Vue 3.x 的响应式系统是基于 Proxy API 构建的。所以 `trigger` 的具体实现与之前的版本有所不同，但核心思想（在数据发生改变时触发依赖更新）仍然相同。

`trigger` 函数接受 `target` 和 `key` 两个参数，分别表示发生变化的目标对象和属性键。在代理对象的 `set` 方法中调用 `trigger` 函数，例如：

```javascript
function set(target, key, value, receiver) {
  const oldValue = target[key];
  const result = Reflect.set(target, key, value, receiver);

  if (result && oldValue !== value) {
    trigger(target, key); // 触发依赖
  }

  return result;
}
```

当我们修改 `user.name` 或 `user.age` 的值时，代理对象的 `set` 方法会被调用，随后调用 `trigger(user, 'name')` 或 `trigger(user, 'age')`。`trigger` 函数会查找之前通过 `track` 收集的依赖，并重新执行这些依赖。

例如，假设我们修改 `user.name` 的值：

```javascript
user.name = "Bob";
```

这将调用 `trigger(user, 'name')`，`trigger` 函数会找到之前通过 `track` 收集的与 `user.name` 关联的 `render` 函数，并重新执行它。因此，控制台将输出新的值：`Name: Bob, Age: 30`。

这就是 Vue 3 中的响应式系统（以 `reactive` 函数为基础）如何实现对对象属性变化的动态相应。通过依赖收集和触发，我们可以确保只有在属性值发生变化时，相关的响应式函数才被执行。