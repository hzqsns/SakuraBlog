---
title: C++的explicit关键字
excerpt: '' 
author: Sakura
publishDate: '2023-12-19'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/126730700_p0_master1200.jpg' 
slug: 'CPP-explicit'
date: 2023-12-19 21:30:00
tags:
  - CPP
category:
  - CPP
---

<!-- wp:paragraph -->
<p>在 C++ 中，<code>explicit</code> 是一个关键字，用于控制隐式转换的发生。在本文中，我将对 <code>explicit</code> 关键字的每个方面进行详细的解释，并提供一些示例来帮助理解。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4>1. 防止隐式类型转换</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>如果一个类具有一个参数的构造函数，当我们将一个值传递给这个构造函数时，编译器可能会自动将传递的值转换为该类的一个对象，而这个转换过程就是隐式类型转换。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code><code>class MyClass {
public:
    MyClass(int x);
};

int main() {
    MyClass obj = 42;  // 隐式类型转换
    return 0;
}
</code></code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，编译器将整数值 <code>42</code> 转换为 <code>MyClass</code> 类型的对象，并将其分配给 <code>obj</code> 变量。然而，这种隐式类型转换可能会导致代码的行为不可预测，因此我们可以将构造函数声明为 <code>explicit</code>，以防止这种类型的转换。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    explicit MyClass(int x);
};

int main() {
    MyClass obj(42);  // 显式类型转换
    return 0;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，我们必须显式地创建一个 <code>MyClass</code> 类型的对象，这样可以避免编译器对整数值进行隐式转换。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4>2. 解决构造函数重载二义性问题</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>有时候，我们可能会为类定义多个构造函数，这些构造函数具有相同的参数类型，但是它们执行不同的操作。在这种情况下，编译器无法确定应该使用哪个构造函数。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    MyClass(int x);
    MyClass(double x);
};

int main() {
    MyClass obj = 42.0; // 编译错误
    return 0;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，编译器无法确定应该使用哪个构造函数，因为它们都可以接受 <code>double</code> 类型的参数。然而，如果我们将构造函数声明为 <code>explicit</code>，则编译器将不会进行隐式类型转换，这样就可以避免构造函数重载的二义性问题。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    explicit MyClass(int x);
    explicit MyClass(double x);
};

int main() {
    MyClass obj1(42.0); // 显式调用第二个构造函数
    MyClass obj2 = MyClass(42); // 显式调用第一个构造函数
    return 0;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，我们必须使用显式构造函数调用来创建 <code>MyClass</code> 类型的对象，这样可以避免编译器的二义性问题。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4>3. 确保转换运算符的使用不会导致意外类型转换</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>有时候，我们可能会为类定义转换运算符，以便将对象转换为其他类型。然而，如果不小心使用这些转换运算符，可能会导致意外的类型转换。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    operator int() const { return x; }
private:
    int x = 42;
};

int main() {
    MyClass obj;
    int n = obj; // 隐式类型转换
    return 0;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，<code>MyClass</code> 类型的对象被转换为一个整数类型，并分配给 <code>n</code> 变量。虽然这种类型转换可能是有意的，但是它也可能是无意的，并且可能会导致代码中的错误。因此，我们可以将转换运算符声明为 <code>explicit</code>，这样就可以确保只有显式类型转换才能使用它们。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    explicit operator int() const { return x; }
private:
    int x = 42;
};

int main() {
    MyClass obj;
    int n = static_cast&lt;int>(obj); // 显式类型转换
    return 0;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，我们必须使用显式类型转换来将 <code>MyClass</code> 类型的对象转换为整数类型，这样就可以避免意外的类型转换。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4>4. 使用 <code>explicit</code> 与 <code>const</code> 和引用类型</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>在将构造函数声明为 <code>explicit</code> 时，我们还需要考虑 <code>const</code> 和引用类型的情况。如果构造函数接受一个 <code>const</code> 或引用参数，则它的行为会与非 <code>const</code> 和非引用参数的构造函数不同。例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyClass {
public:
    explicit MyClass(int x);
    explicit MyClass(const int&amp; x);
};

int main() {
    int n = 42;
    MyClass obj1(n);   // 显式调用第二个构造函数
    MyClass obj2(42);  // 显式调用第一个构造函数
    return 0;
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>在这个例子中，<code><code>MyClass</code> 类定义了两个构造函数，一个接受一个 <code>int</code> 类型的值参数，另一个接受一个 <code>const int&amp;</code> 类型的引用参数。这两个构造函数看起来很相似，但是它们的行为有所不同。</code></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>如果我们在创建 <code>MyClass</code> 对象时传递一个整数变量，例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>int n = 42;
MyClass obj(n);
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>编译器将会调用第二个构造函数，因为它接受一个引用参数，并将 <code>n</code> 的值绑定到这个引用上。这里的关键是，<code>n</code> 是一个变量，我们可以取得它的地址，并将其绑定到一个引用上。这种方式避免了创建新的对象并复制值的开销，从而提高了代码的效率。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>然而，如果我们在创建 <code>MyClass</code> 对象时传递一个整数字面量，例如：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>MyClass obj(42);
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>编译器将会调用第一个构造函数，因为它接受一个值参数，并将整数字面量 <code>42</code> 的值复制到新创建的对象中。这里的关键是，整数字面量 <code>42</code> 是一个常量，我们无法取得它的地址，并将其绑定到一个引用上。因此，我们只能使用值传递的方式来将它传递给构造函数。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>由于第一个构造函数接受一个值参数，而不是引用参数，因此我们必须显式地创建一个 <code>MyClass</code> 对象，以避免编译器对整数字面量进行隐式转换。这个例子表明，在将构造函数声明为 <code>explicit</code> 时，还需要考虑 <code>const</code> 和引用类型的情况，以确保行为与我们的预期相符。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>综上所述，<code>explicit</code> 关键字可以帮助我们编写更加清晰和安全的代码，它可以防止隐式类型转换、解决构造函数重载的二义性问题，并确保转换运算符的使用不会导致意外的类型转换。在使用 <code>explicit</code> 关键字时，需要权衡代码的可读性和复杂性，并确保只在需要时使用它。在将构造函数声明为 <code>explicit</code> 时，还需要考虑 <code>const</code> 和引用类型的情况，以确保行为与我们的预期相符。最后，需要注意的是，<code>explicit</code> 关键字只对单参数构造函数或转换运算符有效，对于多参数构造函数或多参数转换运算符，无法使用 <code>explicit</code> 关键字来避免隐式类型转换。因此，在这种情况下，我们需要使用其他方法来确保类型转换的安全性和准确性。</p>
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
