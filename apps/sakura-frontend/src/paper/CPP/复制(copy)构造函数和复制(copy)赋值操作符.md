---
title: 复制(copy)构造函数和复制(copy)赋值操作符
excerpt: '' 
author: Sakura
publishDate: '2023-12-28'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/126594326_p0_master1200.jpg' 
slug: 'CPP-copy'
date: 2023-12-28 21:32:00
tags:
  - CPP
category:
  - CPP
---
<!-- wp:heading {"level":4} -->
<h4>复制构造函数</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>复制构造函数是一个特殊的构造函数，用于创建一个新对象，并将其初始化为与现有对象相同的值。复制构造函数的语法如下：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    MyClass(const MyClass&amp; other);
};
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在创建新对象时，复制构造函数需要另一个对象的引用作为参数，并将该对象的值复制到新对象中。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>MyClass obj1;          // 创建一个对象
MyClass obj2 = obj1;   // 使用复制构造函数复制对象
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，<code>obj2</code> 对象是通过调用 <code>MyClass</code> 的复制构造函数来创建的，并将 <code>obj1</code> 对象的值复制到 <code>obj2</code> 中。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>复制构造函数常常用于以下情况：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>在传递参数时，如果参数的类型是对象，则将调用对象的复制构造函数来传递参数。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>在创建对象时，如果使用了另一个对象来初始化该对象，则将调用该对象的复制构造函数。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>当对象被返回时，将调用对象的复制构造函数来返回该对象的副本。</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading {"level":4} -->
<h4>复制赋值操作符</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>复制赋值操作符是一个成员函数，用于将一个对象的值赋给另一个对象。复制赋值操作符的语法如下：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    MyClass&amp; operator=(const MyClass&amp; other);
};
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在执行复制赋值操作时，需要将一个对象的值赋给另一个对象。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>MyClass obj1;       // 创建一个对象
MyClass obj2;       // 创建另一个对象
obj2 = obj1;        // 使用复制赋值操作符复制对象
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，<code>obj2</code> 对象是通过调用 <code>MyClass</code> 的复制赋值操作符来创建的，并将 <code>obj1</code> 对象的值赋给 <code>obj2</code>。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>复制赋值操作符常常用于以下情况：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>在将一个对象的值复制到另一个对象时，将调用复制赋值操作符。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>在返回对象时，将调用对象的复制赋值操作符来返回该对象的副本。</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":4} -->
<h4>区别</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>虽然复制构造函数和复制赋值操作符都可以用于复制对象，但它们之间有一个重要的区别：复制构造函数用于创建新的对象，而复制赋值操作符用于将一个对象的值复制到另一个对象中。因此，复制构造函数需要一个现有对象的引用作为参数，并将其用作初始化值，而复制赋值操作符需要两个对象，一个用作源对象，另一个用作目标对象。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>另外，复制构造函数和复制赋值操作符的行为也有所不同，复制构造函数用于创建一个新的对象，并将其初始化为与现有对象相同的值。它通常用于以下情况：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>在传递参数时，如果参数的类型是对象，则将调用对象的复制构造函数来传递参数。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>在创建对象时，如果使用了另一个对象来初始化该对象，则将调用该对象的复制构造函数。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>当对象被返回时，将调用对象的复制构造函数来返回该对象的副本。</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>而复制赋值操作符则用于将一个对象的值复制到另一个对象中。它通常用于以下情况：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>在将一个对象的值复制到另一个对象时，将调用复制赋值操作符。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>在返回对象时，将调用对象的复制赋值操作符来返回该对象的副本。</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>此外，复制构造函数和复制赋值操作符在使用时还需要注意以下几点：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>复制构造函数通常应该声明为 <code>const</code>，以确保不会修改被复制对象的状态。</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>在 C++ 中，如果一个成员函数没有修改对象的状态，应该将它声明为 <code>const</code>，以便编译器在编译时进行检查，并防止不必要的错误和副作用。因此，在定义复制构造函数时，应该将它声明为 <code>const</code>，以确保不会修改被复制对象的状态。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>例如，假设有一个 <code>MyClass</code> 类，它包含一个整型成员变量 <code>x</code>。在定义复制构造函数时，应该将它声明为 <code>const</code>，以确保不会修改被复制对象的状态。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    MyClass(const MyClass&amp; other) {
        x = other.x;   // 复制整型变量的值
    }
private:
    int x;
};
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，复制构造函数 <code>MyClass(const MyClass&amp; other)</code> 被声明为 <code>const</code>，以确保不会修改被复制对象的状态。因此，在复制 <code>MyClass</code> 对象时，只会复制对象的值，而不会修改它的状态。</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>在执行复制操作时，需要注意对象的赋值顺序和异常处理等问题，以确保复制操作的正确性和安全性。</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading {"level":4} -->
<h4>对象赋值顺序问题</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>在执行复制操作时，需要注意对象的赋值顺序。如果对象的成员变量之间存在依赖关系，那么在复制对象时，应该按照依赖顺序进行赋值，以确保对象的值得到正确的复制。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>例如，假设有一个 <code>Date</code> 类和一个 <code>Person</code> 类，其中 <code>Person</code> 类包含一个 <code>Date</code> 类型的成员变量 <code>birthday</code>，并且 <code>Date</code> 类包含三个整型成员变量 <code>year</code>、<code>month</code> 和 <code>day</code>。在复制 <code>Person</code> 对象时，需要按照 <code>Date</code> 对象的成员变量的顺序进行复制，以确保复制的正确性和安全性。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class Date {
public:
    Date(int y, int m, int d) : year(y), month(m), day(d) {}
private:
    int year;
    int month;
    int day;
};

class Person {
public:
    Person(const Person&amp; other) : name(other.name), birthday(other.birthday) {}
private:
    std::string name;
    Date birthday;
};
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，<code>Person</code> 类的复制构造函数使用了 <code>Date</code> 类的复制构造函数来复制 <code>birthday</code> 成员变量，确保复制的顺序是按照依赖关系进行的，即先复制 <code>Date</code> 类的成员变量，然后再复制 <code>Person</code> 类的成员变量。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4>异常处理问题</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>在执行复制操作时，还需要注意异常处理问题。如果出现了内存不足、文件读写失败等异常情况，需要正确处理异常并抛出异常，以避免出现未知的错误和数据损坏。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>在 C++ 中，可以使用 <code>try-catch</code> 语句来处理异常。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    MyClass(const MyClass&amp; other) {
        // 创建动态数组
        try {
            data = new int&#91;other.length];
            length = other.length;
        } catch (std::bad_alloc&amp; e) {
            // 处理内存不足的异常
            std::cerr &lt;&lt; "Out of memory: " &lt;&lt; e.what() &lt;&lt; std::endl;
            throw;
        }
        // 复制数组的值
        for (int i = 0; i &lt; length; i++) {
            data&#91;i] = other.data&#91;i];
        }
    }
private:
    int* data;
    int length;
};

int main() {
    MyClass obj1(10000000);     // 创建一个对象，分配大量内存
    try {
        MyClass obj2 = obj1;    // 使用复制构造函数复制对象
    } catch (...) {
        // 处理异常
    }
    return 0;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，<code>MyClass</code> 类的复制构造函数使用了异常处理机制，当出现内存不足的异常时，会打印错误信息并抛出异常，以便在上层调用者中正确处理异常。在 <code>main</code> 函数中，我们通过使用 <code>try-catch</code> 语句来捕获可能出现的异常，并在出现异常时进行相应的处理。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>需要注意的是，在处理异常时，应该正确释放已经分配的内存，以避免出现内存泄漏和数据损坏。在本例中，如果在创建对象时出现异常，<code>MyClass</code> 类的析构函数将负责释放已经分配的内存，以确保程序的正确性和安全性。</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>在执行复制操作时，如果对象包含指针成员变量，则需要注意深拷贝和浅拷贝的问题，以避免出现内存泄漏和数据损坏的问题。</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>浅拷贝是指复制对象时，只复制对象的值，而不复制指向对象的指针。在浅拷贝中，多个对象可以共享同一个指针，这可能会导致内存泄漏、数据损坏和不可预测的行为。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    MyClass(int size) {
        data = new int&#91;size];   // 创建动态数组
        length = size;
    }
    ~MyClass() {
        delete&#91;] data;          // 释放动态数组
    }
private:
    int* data;
    int length;
};

int main() {
    MyClass obj1(10);           // 创建一个对象
    MyClass obj2 = obj1;        // 使用复制构造函数复制对象
    obj1.~MyClass();            // 销毁对象1
    obj2.~MyClass();            // 销毁对象2
    return 0;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，<code>MyClass</code> 类包含一个指向动态数组的指针 <code>data</code>，在创建对象时会为它分配内存。当使用复制构造函数复制对象时，如果使用了浅拷贝，那么两个对象将共享同一个指针，当其中一个对象被销毁时，指针指向的内存将被释放，从而导致另一个对象的指针无法访问。因此，在使用复制构造函数时，必须使用深拷贝来复制指向对象的指针，以避免出现这种情况。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>深拷贝是指复制对象时，不仅复制对象的值，而且还复制指向对象的指针。在深拷贝中，每个对象都有自己的指针和内存空间，它们不会相互影响。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    MyClass(const MyClass&amp; other) {
        data = new int&#91;other.length];   // 创建动态数组
        length = other.length;
        // 复制数组的值
        for (int i = 0; i &lt; length; i++) {
            data&#91;i] = other.data&#91;i];
        }
    }
    ~MyClass() {
        delete&#91;] data;                  // 释放动态数组
    }
private:
    int* data;
    int length;
};

int main() {
    MyClass obj1(10);           // 创建一个对象
    MyClass obj2 = obj1;        // 使用复制构造函数复制对象
    obj1.~MyClass();            // 销毁对象1
    obj2.~MyClass();            // 销毁对象2
    return 0;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，<code>MyClass</code> 类的复制构造函数使用了深拷贝的方式，</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>通过创建一个新的动态数组来复制指向对象的指针，可以避免浅拷贝的问题，并确保每个对象都有自己的指针和内存空间，它们不会相互影响。这个过程称为深拷贝。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>在进行深拷贝时，需要注意以下问题：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>动态内存的分配和释放：在创建新的动态数组时，需要正确分配内存，并在使用完成后及时释放内存，以避免内存泄漏的问题。在释放内存时，需要使用 <code>delete[]</code> 操作符，而不是 <code>delete</code> 操作符，以确保释放的是动态数组的内存空间，而不是单个对象的内存空间。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>数组的大小和数据类型：在创建新的动态数组时，需要确保数组的大小和数据类型与原始数组相同，以确保复制的数据能够正确地被使用和处理。在 C++11 中，可以使用 <code>std::vector</code> 类来代替动态数组，它能够自动管理数组的大小和内存分配，并提供了许多有用的操作和方法，使代码更加简洁和易于维护。</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>例如，假设有一个 <code>MyClass</code> 类，它包含一个指向动态数组的指针 <code>data</code> 和一个整型成员变量 <code>length</code>。在复制 <code>MyClass</code> 对象时，需要进行深拷贝，以确保每个对象都有自己的指针和内存空间。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    MyClass(const MyClass&amp; other) {
        // 创建动态数组
        data = new int&#91;other.length];
        length = other.length;
        // 复制数组的值
        for (int i = 0; i &lt; length; i++) {
            data&#91;i] = other.data&#91;i];
        }
    }
    ~MyClass() {
        delete&#91;] data;   // 释放动态数组
    }
private:
    int* data;
    int length;
};
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，<code>MyClass</code> 类的复制构造函数使用了深拷贝的方式来复制指向对象的指针，创建了一个新的动态数组，并将原始数组的值复制到新数组中。在 <code>MyClass</code> 类的析构函数中，使用 <code>delete[]</code> 操作符释放动态数组的内存空间，以确保对象的正确释放和内存管理。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>需要注意的是，在进行深拷贝时，应该尽量避免复制大量的数据和复杂的数据结构，以避免出现性能问题和代码复杂度的问题。在实际开发中，应该根据实际情况选择合适的方法和策略，并进行充分的测试和验证，以确保代码的质量和可靠性。</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:paragraph -->
<p>综上所述，复制构造函数和复制赋值操作符是 C++ 中用于复制对象的两个重要方法，它们有着不同的语法和行为。在使用这些方法时，需要根据实际情况选择合适的方式，并注意处理各种异常和错误情况，以确保代码的正确性和可靠性。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->
