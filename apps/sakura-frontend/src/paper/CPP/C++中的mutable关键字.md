---
title: C++中的mutable关键字
excerpt: '' 
author: Sakura
publishDate: '2023-02-27'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/129663236_p0_master1200.jpg' 
slug: 'CPP-mutable'
date: 2023-02-27 19:10:00
tags:
  - C++
category:
  - C++
---

<!-- wp:heading -->
<h2>类中的mutation</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>mutable的中文意思是“可变的，易变的”，跟constant（既C++中的const）是反义词。<br><br>　　在C++中，mutable也是为了突破const的限制而设置的。被mutable修饰的变量，将永远处于可变的状态，即使在一个const函数中。<br><br>　　我们知道，如果类的成员函数不会改变对象的状态，那么这个成员函数一般会声明成const的。但是，有些时候，我们需要在const的函数里面修改一些跟类状态无关的数据成员，那么这个数据成员就应该被mutalbe来修饰。<br><br>　　下面是一个小例子：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class ClxTest{　
public:　　
void Output() const;
}; 

void ClxTest::Output() const
{　
cout &lt;&lt; "Output for test!" &lt;&lt; endl;
} 

void OutputTest(const ClxTest&amp; lx)
{　
lx.Output();
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>　　类ClxTest的成员函数Output是用来输出的，不会修改类的状态，所以被声明为const的。<br><br>　　函数OutputTest也是用来输出的，里面调用了对象<a href="http://product.yesky.com/jssesuit/lx/logitech/">lx</a>的Output输出方法，为了防止在函数中调用<a href="http://product.yesky.com/battery/qtdc">其他</a>成员函数修改任何成员变量，所以参数也被const修饰。<br><br>　　如果现在，我们要增添一个功能：计算每个对象的输出次数。如果用来计数的变量是<a href="http://product.yesky.com/ultrabook/jingdian">普通</a>的变量的话，那么在const成员函数Output里面是不能修改该变量的值的；而该变量跟对象的状态无关，所以应该为了修改该变量而去掉Output的const属性。这个时候，就该我们的mutable出场了——只要用mutalbe来修饰这个变量，所有问题就迎刃而解了。<br><br>　　下面是修改过的代码：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class ClxTest
{
　public:
　　ClxTest();
　　~ClxTest();
 
　　void Output() const;
　　int GetOutputTimes() const;
 
　private:
　　mutable int m_iTimes;
};
 
ClxTest::ClxTest()
{
　m_iTimes = 0;
}
 
ClxTest::~ClxTest()
{}
 
void ClxTest::Output() const
{
　cout &lt;&lt; "Output for test!" &lt;&lt; endl;
　m_iTimes++;
}
 
int ClxTest::GetOutputTimes() const
{
　return m_iTimes;
}
 
void OutputTest(const ClxTest&amp; lx)
{
　cout &lt;&lt; lx.GetOutputTimes() &lt;&lt; endl;
　lx.Output();
　cout &lt;&lt; lx.GetOutputTimes() &lt;&lt; endl;
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>　　计数器m_iTimes被mutable修饰，那么它就可以突破const的限制，在被const修饰的函数里面也能被修改。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2><strong>Lambda 表达式中的</strong> <strong>mutable</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>C++11 引入了 Lambda 表达式，程序员可以凭此创建匿名函数。在 Lambda 表达式的设计中，捕获变量有几种方式；其中按值捕获（Caputre by Value）的方式不允许程序员在 Lambda 函数的函数体中修改捕获的变量。而以 mutable 修饰 Lambda 函数，则可以打破这种限制。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>int x{0};
auto f1 = &#91;=]() mutable {x = 42;};// okay, 创建了一个函数类型的实例
auto f2 = &#91;=]()         {x = 42;};// error, 不允许修改按值捕获的外部变量的值</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>需要注意的是，上述 f1 的函数体中，虽然我们给 x 做了赋值操作，但是这一操作仅只在函数内部生效——即，实际是给拷贝至函数内部的 x 进行赋值——而外部的 x 的值依旧是 0。</p>
<!-- /wp:paragraph -->