---
title: static_cast和dynamic_cast
excerpt: '' 
author: Sakura
publishDate: '2023-04-18'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/129576168_p0_master1200.jpg' 
slug: 'CPP-cast'
date: 2023-04-18 19:14:00
tags:
  - C++
category:
  - C++
---

<!-- wp:image {"id":495,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-7.png" alt="" class="wp-image-495"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>我们不难看出，派生类不仅有自己的方法和属性，还包括从父类继承来的方法与属性。那么当从派生类往基类进行转换是没有安全问题的。但是如果从基类向派生类转换的话，会出现安全问题。很显然基类有的派生类都有，但是派生类都有的父类不一定有，所以向下转型显而易见会出现安全问题。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>于是乎，C++为了解决这一类问题推出了static_cast和dynamic_cast</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>static_cast</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>语法：</p>
<!-- /wp:paragraph -->

<!-- wp:table -->
<figure class="wp-block-table"><table><tbody><tr><td><code>static_cast&lt; new_type >(expression)</code> <br>//备注：new_type为目标数据类型，expression为原始数据类型变量或者表达式。</td></tr></tbody></table></figure>
<!-- /wp:table -->

<!-- wp:paragraph -->
<p>作用：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>static_cast相当于传统的C语言里的强制转换，该运算符把expression转换为new_type类型，用来强迫隐式转换如non-const对象转为const对象，编译时检查，用于非多态的转换，可以转换指针及其他，但没有运行时类型检查来保证转换的安全性。它主要有如下几种用法：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>风险较低的用法：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>原有的自动类型转换，例如 short 转 int、int 转 double、const 转非 const、向上转型等；</li><li>void 指针和具体类型指针之间的转换，例如<code>void *</code>转<code>int *</code>、<code>char *</code>转<code>void *</code>等；</li><li>有转换构造函数或者类型转换函数的类与其它类型之间的转换，例如 double 转 Complex（调用转换构造函数）、Complex 转 double（调用类型转换函数）。</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>需要注意的是，static_cast 不能用于无关类型之间的转换，因为这些转换都是有风险的，例如：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>两个具体类型指针之间的转换，例如<code>int *</code>转<code>double *</code>、<code>Student *</code>转<code>int *</code>等。不同类型的数据存储格式不一样，长度也不一样，用 A 类型的指针指向 B 类型的数据后，会按照 A 类型的方式来处理数据：如果是读取操作，可能会得到一堆没有意义的值；如果是写入操作，可能会使 B 类型的数据遭到破坏，当再次以 B 类型的方式读取数据时会得到一堆没有意义的值。</li><li>int 和指针之间的转换。将一个具体的地址赋值给指针变量是非常危险的，因为该地址上的内存可能没有分配，也可能没有读写权限，恰好是可用内存反而是小概率事件。</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>用法举例：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>基本类型数据转换</strong></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>char a = 'a';
int b = static_cast&lt;char>(a);//正确，将char型数据转换成int型数据

double *c = new double;
void *d = static_cast&lt;void*>(c);//正确，将double指针转换成void指针

int e = 10;
const int f = static_cast&lt;const int>(e);//正确，将int型数据转换成const int型数据

const int g = 20;
int *h = static_cast&lt;int*>(&amp;g);//编译错误，static_cast不能转换掉g的const属性</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>向上转型和向下转型</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class Base
{};

class Derived : public Base
{}

Base* pB = new Base();
if(Derived* pD = static_cast&lt;Derived*>(pB))
{}//下行转换是不安全的(坚决抵制这种方法)

Derived* pD = new Derived();
if(Base* pB = static_cast&lt;Base*>(pD))
{}//上行转换是安全的</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2><strong>dynamic_cast</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>语法：</p>
<!-- /wp:paragraph -->

<!-- wp:table -->
<figure class="wp-block-table"><table><tbody><tr><td><strong>dynamic</strong><code><strong>_cast</strong>&lt; new_type >(expression)</code> <br>//newType 和 expression 必须同时是指针类型或者引用类型。<br>//换句话说，dynamic_cast 只能转换指针类型和引用类型，其它类型（int、double、数组、类、结构体等）都不行。<br>//对于指针，如果转换失败将返回 NULL；<br>//对于引用，如果转换失败将抛出<code>std::bad_cast</code>异常。</td></tr></tbody></table></figure>
<!-- /wp:table -->

<!-- wp:paragraph -->
<p>作用：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>dynamic_cast 用于在类的继承层次之间进行类型转换，它既允许向上转型（Upcasting），也允许向下转型（Downcasting）。向上转型是无条件的，不会进行任何检测，所以都能成功；向下转型的前提必须是安全的，要借助 RTTI 进行检测，所有只有一部分能成功。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>dynamic_cast 与 static_cast 是相对的，dynamic_cast 是“动态转换”的意思，static_cast 是“静态转换”的意思。dynamic_cast 会在程序运行期间借助 RTTI 进行类型转换，这就要求基类必须包含虚函数；static_cast 在编译期间完成类型转换，能够更加及时地发现错误。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>用法：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>dynamic_cast主要用于类层次间的上行转换和下行转换，还可以用于类之间的交叉转换（cross cast）。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>在类层次间进行上行转换时，dynamic_cast和static_cast的效果是一样的；在进行下行转换时，dynamic_cast具有类型检查的功能，比static_cast更安全。dynamic_cast是唯一无法由旧式语法执行的动作，也是唯一可能耗费重大运行成本的转型动作。<br></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>（1）指针类型<br>举例，Base为包含至少一个虚函数的基类，Derived是Base的共有派生类，如果有一个指向Base的指针bp，我们可以在运行时将它转换成指向Derived的指针，代码如下：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>if(Derived *dp = dynamic_cast&lt;Derived *>(bp)){
  //使用dp指向的Derived对象  
}
else{
  //使用bp指向的Base对象  
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><br>值得注意的是，在上述代码中，if语句中定义了dp，这样做的好处是可以在一个操作中同时完成类型转换和条件检查两项任务。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>（2）引用类型</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>因为不存在所谓空引用，所以引用类型的dynamic_cast转换与指针类型不同，在引用转换失败时，会抛出std::bad_cast异常，该异常定义在头文件typeinfo中。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>void f(const Base &amp;b){
 try{
   const Derived &amp;d = dynamic_cast&lt;const Base &amp;>(b);  
   //使用b引用的Derived对象
 }
 catch(std::bad_cast){
   //处理类型转换失败的情况
 }
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><br></p>
<!-- /wp:paragraph -->

