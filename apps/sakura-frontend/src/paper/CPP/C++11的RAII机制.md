---
title: C++11的RAII机制
excerpt: '' 
author: Sakura
publishDate: '2023-05-11'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/129487122_p0_master1200.jpg' 
slug: 'CPP-RAII'
date: 2023-05-11 19:29:00
tags:
  - C++
category:
  - C++
---

<!-- wp:heading -->
<h2>简介</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>RAII技术被认为是C++中管理资源的最佳方法，进一步引申，使用RAII技术也可以实现安全、简洁的状态管理，编写出优雅的异常安全的代码。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>资源的使用一般经历三个步骤a.获取资源 b.使用资源 c.销毁资源，但是资源的销毁往往是程序员经常忘记的一个环节，所以程序界就想如何在程序员中让资源自动销毁呢？c++之父给出了解决问题的方案：RAII，它充分的利用了C++语言局部对象自动销毁的特性来控制资源的生命周期。</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>RAII是C++的发明者Bjarne Stroustrup提出的概念，RAII全称是“Resource Acquisition is Initialization”，直译过来是“资源获取即初始化”，顾名思义，意味着任何资源的获取都应该发生在类的构造函数中，但我个人认为这个名字不太完备，有另一半的意思没有解释到，那就是资源的释放应发生在析构函数中，这意味着所有资源的life cycle都与一个 object紧紧绑定在一起所以，在RAII的指导下，我们应该使用类来管理资源，将资源和对象的生命周期绑定。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>智能指针（std::shared_ptr和std::unique_ptr）即RAII最具代表的实现，使用智能指针，可以实现自动的内存管理，再也不需要担心忘记delete造成的内存泄漏。毫不夸张的来讲，有了智能指针，代码中几乎不需要再出现delete了。同时C++11中加入了线程，引入了多线程，也就伴随着一个多线程资源互斥的操作。对于锁的使用，有一个比较头疼的问题，就是在加锁后，容易忘记解锁，这样程序中可能会造成死锁。为了解决这个问题，C++11中引入了lock_guard。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>互斥锁</h2>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>std::mutex mutex_;

//删除缓冲池中的指定ID的frame
void LRUReplacer::Pin(frame_id_t frame_id) {
  if (LRUReplacer::mp&#91;frame_id] == nullptr) return;
  _mutex.lock();
  Node *tmp = LRUReplacer::mp&#91;frame_id];
  tmp-&gt;left-&gt;right = tmp-&gt;right;
  tmp-&gt;right-&gt;left = tmp-&gt;left;
  nowsize--;
  mp&#91;frame_id] = nullptr;
  delete tmp;
  _mutex.unlock();
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在互斥量lock和unlock之间的代码很可能会出现异常，或者有return语句，这样的话，互斥量就不会正确的unlock，会导致线程的死锁。比如以上代码功能是删除缓冲池中指定frame_id对应的frame，这个函数会被很多线程并行调用，因此这个共用的函数必须用一个互斥锁保护起来，否则不同线程可能会同时对一个页面进行delete操作从而抛出异常。这段代码看起来仿佛没有问题，但是如果当写IO时是抛出了异常，call stack会被直接释放，也就意味着 <code>unlock</code>方法不会执行，造成永久的死锁。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这个问题虽然可以像java一样用一个try-catch语句来避免但是也会让代码变得臃肿和难看。并且在复杂的逻辑中，往往很可能会忘了解锁，或者花很多精力来管理锁的获得和释放(如果在一个函数调用中有多处返回，每个return statement之前都需要 <code>unlock</code>)。这就是RAII发挥其威力的时候了，下面一段代码将展示如何用 <code>lock_guard</code>来使我们的代码异常安全并且整洁。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code><a href="std::mutex mutex_;

//删除缓冲池中的指定ID的frame
void LRUReplacer::Pin(frame_id_t frame_id) {
  if (LRUReplacer::mp&#91;frame_id] == nullptr) return;
  _mutex.lock();
  Node *tmp = LRUReplacer::mp&#91;frame_id];
  tmp->left->right = tmp->right;
  tmp->right->left = tmp->left;
  nowsize--;
  mp&#91;frame_id] = nullptr;
  delete tmp;
  _mutex.unlock();
}">
</a>std::mutex mutex_;

//删除缓冲池中的指定ID的frame
void LRUReplacer::Pin(frame_id_t frame_id) {
  if (LRUReplacer::mp&#91;frame_id] == nullptr) return;
  <strong>std::lock_guard&lt;std::mutex&gt; lock(mutex_);</strong>
  Node *tmp = LRUReplacer::mp&#91;frame_id];
  tmp-&gt;left-&gt;right = tmp-&gt;right;
  tmp-&gt;right-&gt;left = tmp-&gt;left;
  nowsize--;
  mp&#91;frame_id] = nullptr;
  delete tmp;

}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><code>lock_guard</code>保证在函数返回之后释放互斥锁，因此使得开发人员不需要为抛出异常的情况担心且不需手动释放锁。但是 <code>lock_guard</code>是如何做到的呢？不妨尝试自己手动实现一个 <code>lock_guard</code></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>template &lt;typename T&gt;
class lock_guard
{
private:
    T _mutex;
public:
    explicit lock_guard(T &amp;mutex) : _mutex(mutex) 
    {
        _mutex.lock();
    }
    ~lock_guard() 
    {
        _mutex.unlock();
    }
};</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>从以上实现中可看出， <code>lock_guard</code>在构造函数中锁住了引用传入的mutex (resource acquisition is initialisation)，并且在析构函数中释放锁。其异常安全的保障就是析构函数一定会在对象归属的scope退出时自动被调用（在本例中在函数返回前执行）。如果你用过golang的话会知道golang的defer机制，这与C++的析构函数十分相似，但是golang的defer只能保证在函数返回前执行，而C++的析构函数可以保证在当前scope退出前执行（个人感觉golang的defer相比之下比较鸡肋）。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>智能指针</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>C++中一个非常常见的应用场景就是调用一个函数来产生一个对象，然后消费这个对象，最后手动释放指针。如以下代码所示。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class A
{
public:
    A() = default;
};

template &lt;typename T&gt;
T* get_object()
{
    return new T();
}

int main()
{
    auto obj = get_object&lt;A&gt;();
    // consume the object
    // ...
    // consume finish
    delete obj;
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在大型应用程序中，指针的产生和消费错综复杂，写到后面程序员根本不记得自己有没有释放指针，或者某处地方读取一个已经释放的指针直接导致segmentation fault程序崩溃。而这就是C/C++各种内存泄漏的万恶之源。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>而自从C++11推出智能指针后，其极大地减轻了C++开发者们内存管理的压力。通过在裸指针上包一层智能指针，再也不用通过手动 <code>delete</code>来释放内存了。下面的代码将展示如何用 <code>std::unique_ptr</code>来管理指针。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class A
{
public:
    A() = default;
};

template &lt;typename T&gt;
std::unique_ptr&lt;T&gt; get_object()
{
    return std::unique_ptr&lt;T&gt;(new T());
}

int main()
{
    auto obj = get_object&lt;A&gt;();
    // consume the object
    // ...
    // consume finish
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>智能指针的方便之处在于它会在自己的析构函数中执行 <code>delete</code>操作而不需程序员手动释放。在上述代码中，当main函数退出时， <code>std::unique_ptr</code>在自己的析构函数中释放指针，而为了防止有别的 <code>std::unique_ptr</code>指向自己管理的对象而导致的提早释放与空指针访问， <code>std::unique_ptr</code>禁止了 <code>copy constructor</code>与 <code>copy assignment</code>。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>总结</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>RAII的核心思想是将资源或者状态与对象的生命周期绑定，通过C++的语言机制，实现资源和状态的安全管理。理解和使用RAII能使软件设计更清晰，代码更健壮。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>个人感觉，简单地说就是RAII的思想就是把对象继续封装到一个类中，借助类中的构造函数和析构函数会自动调用这个特性，从而解决了资源的释放问题。</strong></p>
<!-- /wp:paragraph -->

