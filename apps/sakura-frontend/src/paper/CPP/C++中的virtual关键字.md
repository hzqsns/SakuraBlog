---
title: C++中的virtual关键字
excerpt: '' 
author: Sakura
publishDate: '2024-01-29'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/126038359_p0_master1200.jpg' 
slug: 'CPP-virtual'
date: 2024-01-29 21:42:00
tags:
  - CPP
category:
  - CPP
---

<!-- wp:paragraph -->
<p><code>virtual</code> 是 C++ 中的一个关键字，它用于实现多态。多态允许基类指针或引用指向派生类对象，并且可以在运行时动态地调用实际对象的成员函数。为了更好地理解 <code>virtual</code> 关键字，让我们通过一个例子来详细说明 <code>virtual</code> 关键字、虚函数、虚函数表、动态绑定以及虚析构函数。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>假设我们有一个表示几何形状的基类 <code>Shape</code> 和两个派生类 <code>Circle</code> 和 <code>Rectangle</code>。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include &lt;iostream>

class Shape {
public:
    virtual void draw() const {
        std::cout &lt;&lt; "Drawing a shape." &lt;&lt; std::endl;
    }
    
    virtual ~Shape() {
        std::cout &lt;&lt; "Destroying Shape object." &lt;&lt; std::endl;
    }
};

class Circle : public Shape {
public:
    void draw() const override {
        std::cout &lt;&lt; "Drawing a circle." &lt;&lt; std::endl;
    }

    ~Circle() override {
        std::cout &lt;&lt; "Destroying Circle object." &lt;&lt; std::endl;
    }
};

class Rectangle : public Shape {
public:
    void draw() const override {
        std::cout &lt;&lt; "Drawing a rectangle." &lt;&lt; std::endl;
    }

    ~Rectangle() override {
        std::cout &lt;&lt; "Destroying Rectangle object." &lt;&lt; std::endl;
    }
};
</code></pre>
<!-- /wp:code -->

<!-- wp:list {"ordered":true} -->
<ol><!-- wp:list-item -->
<li>虚函数（Virtual Function）：在基类 <code>Shape</code> 中，我们声明了一个虚函数 <code>draw()</code>。这意味着，当我们通过基类指针或引用调用 <code>draw()</code> 函数时，会调用实际对象（派生类对象）的 <code>draw()</code> 函数实现。<code>Circle</code> 和 <code>Rectangle</code> 类分别覆盖了基类的 <code>draw()</code> 函数。<code>~Shape()</code> 和 <code>~Circle()</code> 也是虚析构函数。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>虚函数表（Virtual Function Table）：编译器为每个包含虚函数的类生成一个虚函数表。在这个例子中，编译器将为 <code>Shape</code>、<code>Circle</code> 和 <code>Rectangle</code> 类生成虚函数表。虚函数表包含了指向类中所有虚函数的指针。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>动态绑定（Dynamic Binding）：当我们使用基类指针或引用来调用虚函数时，编译器会在运行时动态确定应该调用哪个函数。这是通过查找实际对象（派生类对象）的虚函数表并调用相应函数来实现的。</li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>Shape *shape1 = new Circle();
Shape *shape2 = new Rectangle();

shape1->draw(); // 输出 "Drawing a circle."
shape2->draw(); // 输出 "Drawing a rectangle."
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>4. 虚析构函数（Virtual Destructor）：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>我们将基类 <code>Shape</code> 的析构函数声明为 <code>virtual</code>。这样，在通过基类指针删除派生类对象时，会先调用派生类的析构函数，然后调用基类的析构函数。这确保了资源能够正确地释放。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>delete shape1; // 输出 "Destroying Circle object." 和 "Destroying Shape object."
delete shape2; // 输出 "Destroying Rectangle object." 和 "Destroying Shape object."
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>这个例子展示了 <code>virtual</code> 关键字在 C++ 中的用法以及它如何实现多态。通过将基类 <code>Shape</code> 的成员函数 <code>draw()</code> 和析构函数声明为 <code>virtual</code>，我们可以通过基类指针或引用动态地调用派生类的相应函数。这种机制允许我们在运行时根据实际对象的类型执行不同的操作，从而实现多态。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>总之，<code>virtual</code> 关键字在 C++ 中用于实现多态，允许通过基类指针或引用动态地调用派生类的成员函数。通过使用虚函数表和动态绑定，<code>virtual</code> 关键字确保了在运行时可以找到并调用正确的函数实现。这种机制在处理涉及多态的类层次结构时非常有用。</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:paragraph -->
<p>为了更深入地分析多态和虚函数，我们将使用一个包含 <code>Employee</code> 基类和两个派生类 <code>FullTimeEmployee</code> 和 <code>PartTimeEmployee</code> 的例子。我们将从以下几个方面进行分析：虚函数、虚函数表、动态绑定以及虚析构函数。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include &lt;iostream>
#include &lt;string>

class Employee {
public:
    Employee(const std::string &amp;name) : name_(name) {}

    virtual void work() const {
        std::cout &lt;&lt; name_ &lt;&lt; " is working as a generic employee." &lt;&lt; std::endl;
    }
    
    virtual ~Employee() {
        std::cout &lt;&lt; "Destroying Employee object: " &lt;&lt; name_ &lt;&lt; std::endl;
    }

protected:
    std::string name_;
};

class FullTimeEmployee : public Employee {
public:
    FullTimeEmployee(const std::string &amp;name) : Employee(name) {}

    void work() const override {
        std::cout &lt;&lt; name_ &lt;&lt; " is working as a full-time employee." &lt;&lt; std::endl;
    }

    ~FullTimeEmployee() override {
        std::cout &lt;&lt; "Destroying FullTimeEmployee object: " &lt;&lt; name_ &lt;&lt; std::endl;
    }
};

class PartTimeEmployee : public Employee {
public:
    PartTimeEmployee(const std::string &amp;name) : Employee(name) {}

    void work() const override {
        std::cout &lt;&lt; name_ &lt;&lt; " is working as a part-time employee." &lt;&lt; std::endl;
    }

    ~PartTimeEmployee() override {
        std::cout &lt;&lt; "Destroying PartTimeEmployee object: " &lt;&lt; name_ &lt;&lt; std::endl;
    }
};
</code></pre>
<!-- /wp:code -->

<!-- wp:list {"ordered":true} -->
<ol><!-- wp:list-item -->
<li>虚函数（Virtual Function）：在基类 <code>Employee</code> 中，我们声明了一个虚函数 <code>work()</code>。这意味着，当我们通过基类指针或引用调用 <code>work()</code> 函数时，会调用实际对象（派生类对象）的 <code>work()</code> 函数实现。<code>FullTimeEmployee</code> 和 <code>PartTimeEmployee</code> 类分别覆盖了基类的 <code>work()</code> 函数。<code>~Employee()</code> 也是虚析构函数。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>虚函数表（Virtual Function Table）：编译器为每个包含虚函数的类生成一个虚函数表。在这个例子中，编译器将为 <code>Employee</code>、<code>FullTimeEmployee</code> 和 <code>PartTimeEmployee</code> 类生成虚函数表。虚函数表包含了指向类中所有虚函数的指针。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>动态绑定（Dynamic Binding）：当我们使用基类指针或引用来调用虚函数时，编译器会在运行时动态确定应该调用哪个函数。这是通过查找实际对象（派生类对象）的虚函数表并调用相应函数来实现的。</li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>Employee *employee1 = new FullTimeEmployee("Alice");
Employee *employee2 = new PartTimeEmployee("Bob");

employee1->work(); // 输出 "Alice is working as a full-time employee."
employee2->work(); // 输出 "Bob is working as a part-time employee."
</code></pre>
<!-- /wp:code -->

<!-- wp:list {"ordered":true,"start":4} -->
<ol start="4"><!-- wp:list-item -->
<li>虚析构函数（Virtual Destructor）：</li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>我们将基类 <code>Employee</code> 的析构函数声明为 <code>virtual</code>。这确保了当我们使用基类指针删除派生类对象时，编译器会首先调用派生类的析构函数，然后才调用基类的析构函数。这可以确保在删除对象时正确地释放资源。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>delete employee1; 
// 输出 "Destroying FullTimeEmployee object: Alice" 
// 和 "Destroying Employee object: Alice"

delete employee2; 
// 输出 "Destroying PartTimeEmployee object: Bob" 
// 和 "Destroying Employee object: Bob"
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>这个例子展示了如何使用 <code>virtual</code> 关键字实现多态，以及如何通过基类指针或引用动态地调用派生类的成员函数。通过动态绑定和虚函数表，我们可以在运行时根据实际对象的类型调用正确的函数实现。在这个例子中，<code>Employee</code> 类型的指针可以指向 <code>FullTimeEmployee</code> 或 <code>PartTimeEmployee</code> 类型的对象，而通过 <code>work()</code> 函数，我们可以看到实际对象的行为。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>在总结中，<code>virtual</code> 关键字在 C++ 中用于实现多态，允许我们通过基类指针或引用动态地调用派生类的成员函数。在这个例子中，<code>Employee</code> 类型的指针可以用于操作 <code>FullTimeEmployee</code> 和 <code>PartTimeEmployee</code> 类型的对象，从而实现多态行为。这种多态性在面向对象编程中非常有用，因为它允许我们编写通用的代码来处理具有共同基类的不同对象。这种灵活性使得代码更易于维护和扩展。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->