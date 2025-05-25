---
title: Java中为什么要设计包装类？
excerpt: '' 
author: Sakura
publishDate: '2021-12-31'
coverImage: 'https://picsum.photos/800/600?random=6' 
slug: '2021-12-31'
date: 2025-05-25 17:53:00
tags:
  - Java
category:
  - Java
---

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210301000309.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2 id="1-为什么需要包装类">1. 为什么需要包装类</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>在 Java 中，万物皆对象，所有的操作都要求用对象的形式进行描述。但是 Java 中除了对象（引用类型）还有八大基本类型，它们不是对象。那么，为了把基本类型转换成对象，最简单的做法就是<strong>将基本类型作为一个类的属性保存起来</strong>，也就是把基本数据类型包装一下，这也就是包装类的由来。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这样，我们先自己实现一个简单的包装类，以包装基本类型&nbsp;<code>int</code>&nbsp;为例：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>// 包装类 MyInt
public class MyInt {
    private int number; // 基本数据类型
    
    public Int (int number){ // 构造函数,传入基本数据类型
        this.number = number;
    }
    
    public int intValue(){ // 取得包装类中的数据
        return this.number;
    }
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>测试一下这个包装类：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>public static void main(String&#91;] args) {
    MyInt temp = new Int(100); // 100 是基本数据类型, 将基本数据类型包装后成为对象
    int result = temp.intValue(); // 从对象中取得基本数据类型
    System.out.println(result);
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>当然，我们自己实现的这个包装类非常简单，Java 给我们提供了更完善的内置包装类：</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":241,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/10/image-13.png" alt="" class="wp-image-241"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>前 6 个类派生于公共的超类&nbsp;<code>Number</code>，而&nbsp;<code>Character</code>&nbsp;和&nbsp;<code>Boolean</code>&nbsp;是&nbsp;<code>Object</code>&nbsp;的直接子类。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>来看看包装类的声明，以&nbsp;<code>Integer</code>&nbsp;为例：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224202356.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>被&nbsp;<code>final</code>&nbsp;修饰，也就是说 Java 内置的<strong>包装类是无法被继承的</strong>。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 id="2-装箱与拆箱">2. 装箱与拆箱</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>OK，现在我们已经知道了，存在基本数据类型与其对应的包装类，那么，他们之间互相的转换操作就称为装箱与拆箱：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>装箱：将基本数据类型转换成包装类（每个包装类的构造方法都可以接收各自数据类型的变量）</li><li>拆箱：从包装类之中取出被包装的基本类型数据（使用包装类的 xxxValue 方法）</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>下面以&nbsp;<code>Integer</code>&nbsp;为例，我们来看看 Java 内置的包装类是如何进行拆装箱的：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>Integer obj = new Integer(10);  // 自动装箱
int temp = obj.intValue();  	// 自动拆箱
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>可以看出，和上面我们自己写的包装类使用方式基本一样，事实上，<code>Integer</code>&nbsp;中的这两个方法其底层实现和我们上述写的代码也是差不多的。</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224202635.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>不知道各位发现没，<code>value</code>&nbsp;被声明为&nbsp;<code>final</code>&nbsp;了，也就是说<strong>一旦构造了包装器，就不允许更改包装在其中的值</strong>。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>另外，需要注意的是，这种形式的代码是&nbsp;<strong>JDK 1.5 以前</strong>的！！！<strong>JDK 1.5 之后</strong>，Java 设计者为了方便开发提供了<strong>自动装箱</strong>与<strong>自动拆箱</strong>的机制，并且可以直接利用包装类的对象进行数学计算。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>还是以&nbsp;<code>Integer</code>&nbsp;为例我们来看看自动拆装箱的过程：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>Integer obj = 10;  	// 自动装箱. 基本数据类型 int -&gt; 包装类 Integer
int temp = obj;  	// 自动拆箱. Integer -&gt; int
obj ++; // 直接利用包装类的对象进行数学计算
System.out.println(temp * obj); 
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>看见没有，基本数据类型到包装类的转换，不需要像上面一样使用构造函数，直接&nbsp;<code>=</code>&nbsp;就完事儿；同样的，包装类到基本数据类型的转换，也不需要我们手动调用包装类的 xxxValue 方法了，直接&nbsp;<code>=</code>&nbsp;就能完成拆箱。这也是将它们称之为自动的原因。</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224214502.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>我们来看看这段代码反编译后的文件，底层到底是什么原理：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>Integer obj = Integer.valueOf(10);
int temp = obj.intValue();
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>可以看见，自动装箱的底层原理是调用了包装类的&nbsp;<code>valueOf</code>&nbsp;方法，而自动拆箱的底层调用了包装类的&nbsp;<code>intValue()</code>&nbsp;方法。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 id="3-不简单的-integervalueof">3. 不简单的 Integer.valueOf</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>我们上面已经看过了用于自动拆箱的&nbsp;<code>intValue</code>&nbsp;方法的源码，非常简单。接下来咱来看看用于自动装箱的&nbsp;<code>valueOf</code>，其他包装类倒没什么好说的，不过&nbsp;<code>Integer</code>&nbsp;中的这个方法还是有点东西的：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224210527.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><code>IntegerCache</code>&nbsp;又是啥，点进去看看：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224210731.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><code>IntegerCache</code>&nbsp;是&nbsp;<code>Integer</code>&nbsp;类中的静态内部类，综合这两段代码，我们大概也能知道，<code>IntegerCache</code>&nbsp;其实就是个<strong>缓存</strong>，其中定义了一个缓冲区&nbsp;<code>cache</code>，用于存储&nbsp;<code>Integer</code>&nbsp;类型的数据，<strong>缓存区间是 [-128, 127]</strong>。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>回到&nbsp;<code>valueOf</code>&nbsp;的源码：它首先会判断 int 类型的实参 i 是否在可缓存区间内，如果在，就直接从缓存&nbsp;<code>IntegerCache</code>&nbsp;中获取对应的&nbsp;<code>Integer</code>&nbsp;对象；如果不在缓存区间内，则会 new 一个新的&nbsp;<code>Integer</code>&nbsp;对象。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>结合这个特性，我们来看一个题目，两种类似的代码逻辑，但是却得到完全相反的结果。：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>public static void main(String args&#91;]) {
    Integer a1 = 127;
    Integer a2 = 127;
    System.out.println(a1 == a2); // true

    Integer b1 = 128;
    Integer b2 = 128;
    System.out.println(b1 == b2); // false
}
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>我们知道，<code>==</code>&nbsp;拥有两种应用场景：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>对于引用类型来说，判断的是内存地址是否相等</li><li>对于基本类型来说，判断的是值是否相等</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>从 a1 开始看，由于其值在&nbsp;<code>InterCache</code>&nbsp;的缓存区间内，所以这个&nbsp;<code>Integer</code>&nbsp;对象会被存入缓存。而在创建 a2 的时候，由于其值和 a1 相等，所以直接从缓存中取出值为 127 的&nbsp;<code>Integer</code>&nbsp;对象给 a2 使用，也就是说，a1 和 a2 这两个&nbsp;<code>Integer</code>&nbsp;的对象引用都指向同一个地址。</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224213106.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>对于 b1 和 b2 来说，由于 128 不在&nbsp;<code>IntegerCache</code>&nbsp;的缓存区间内，那就只能自己老老实实开辟空间了，所以 b1 和 b2 指向不同的内存地址。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>很显然，由于&nbsp;<code>InterCache</code>&nbsp;缓存机制的存在，可能会让我们在编程的时候出现困惑，因此最好使用&nbsp;<code>.equals</code>&nbsp;方法来比较&nbsp;<code>Integer</code>&nbsp;值是否相等。<code>Integer</code>&nbsp;重写了&nbsp;<code>.equals</code>&nbsp;方法：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224214035.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>当然，其他包装类虽然没有缓存机制，但是也都重载了&nbsp;<code>.equals</code>&nbsp;方法，用于根据值来判断是否相等。因此，得出结论，<strong>使用&nbsp;<code>equals</code>&nbsp;方法来比较两个包装类对象的值</strong>。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 id="4-object-类可以接收所有数据类型">4. Object 类可以接收所有数据类型</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>综上，有了自动拆装箱机制，基本数据类型可以自动的被转为包装类，而&nbsp;<code>Object</code>&nbsp;是所有类的父类，也就是说，<strong><code>Object</code>&nbsp;可以接收所有的数据类型了</strong>（引用类型、基本类型）！！！</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>不信你可以试试，直接用&nbsp;<code>Object</code>&nbsp;类接收一个基本数据类型&nbsp;<code>int</code>，完全是可以的。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>Object obj = 10;
int temp = (Integer) obj;
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>解释一下上面这段代码发生了什么，下面这张图很重要，大家仔细看：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224210346.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2 id="5-包装类在集合中的广泛使用">5. 包装类在集合中的广泛使用</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>其实包装类最常见的使用就是在集合中，因为集合不允许存储基本类型的数据，只能存储引用类型的数据。那如果我们想要存储 1、2、3 这样的基本类型数据怎么办？举个例子，我们可以如下声明一个&nbsp;<code>Integer</code>对象的数组列表：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>ArrayList&lt;Integer&gt; list = new ArrayList&lt;&gt;();
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>往这个列表中添加&nbsp;<code>int</code>&nbsp;型数据：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>list.add(3); 
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面这个调用在底层将会发生自动装箱操作：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>list.add (Integer.valueOf(3));
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>基本数据类型&nbsp;<code>int</code>&nbsp;会被转换成&nbsp;<code>Integer</code>&nbsp;对象存入集合中。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>我们再来从这个集合中根据某个下标 i 获取对应的&nbsp;<code>Integer</code>&nbsp;对象，并用基本数据类型&nbsp;<code>int</code>&nbsp;接收：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>int n = list.get(i);
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>上面这个调用在底层将会发生自动拆箱操作：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>int n = list.get(i).intValue();
</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2 id="6-数据类型转换">6. 数据类型转换</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>另外，除了在集合中的广泛应用，包装类还包含一个重要功能，那就是提供将String型数据变为基本数据类型的方法，使用几个代表的类做说明：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><code>Integer</code>：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224220251.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><code>Double</code>：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224220313.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><code>Boolean</code>：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224220339.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>这些方法均被&nbsp;<code>static</code>&nbsp;标识，也就是说它们被各自对应的所有对象共同维护，直接通过类名访问该方法。举个例子：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>String str = "10";
int temp = Integer.parseInt(str);// String -&gt; int
System.out.println(temp * 2); // 20
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>需要特别注意的是：<code>Character</code>&nbsp;类里面并不存在字符串变为字符的方法，因为&nbsp;<code>String</code>&nbsp;类中已经有一个&nbsp;<code>charAt()</code>的方法可以根据索引取出字符内容。</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://gitee.com/veal98/images/raw/master/img/20210224220755.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->
