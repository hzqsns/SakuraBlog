---
title: Java中equals和==的区别
excerpt: '' 
author: Sakura
publishDate: '2021-09-25'
coverImage: 'http://www.hzqsns.com/wp-content/uploads/2021/07/76783584_p0_master1200.jpg' 
slug: 'Java-equals'
date: 2021-09-25 17:30:00
tags:
  - Java
category:
  - Java
---


<!-- wp:list -->
<ul><li><strong>==</strong></li></ul>
<!-- /wp:list -->

<!-- wp:list {"ordered":true} -->
<ol><li>对于基本数据类型的变量，如：Byte（字节型）、short（短整型）、char（字符型） 、int（整型）、float（单精度型/浮点型）、long（长整型）、double（双精度型） 和boolean(布尔类型），&nbsp;<strong>==</strong>是直接对其值进行比较。</li><li>对于引用数据类型的变量，则是对其内存地址的比较</li></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>因此，不管怎样，==是对数值上的一种比较。</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li><strong>equals</strong></li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>我们知道任何类都继承Object类，这里我们先看下object类里的equals方法：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://pic1.zhimg.com/80/v2-09e21d6bf781767f84c038c2f90c8b08_1440w.jpg" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>我们可以从这段源码看出，在没有重写equals方法之前，equals方法里是直接调用==，因此实质上与==没有差别。但是要注意：equals方法不能作用于基本数据类型的变量，这是因为基本数据类型非对象的缘故，没有方法。</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://pic1.zhimg.com/80/v2-8128595df6d1f4b8f6334868841f5998_1440w.jpg" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>我们可以看到在String类里，equals是逐一对比两者的内容，内容相同才返回true.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>代码示例：</li></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>public class Testequals {
	public static void main(String&#91;] args) {
        String a = new String("ab"); <em>// a 为一个引用
</em>        String b = new String("ab"); <em>// b为另一个引用,对象的内容一样
</em>        String aa = "ab"; <em>// 放在常量池中
</em>        String bb = "ab"; <em>// 从常量池中查找
</em>        String c=b.intern();
        
            System.out.println(aa==bb);

            System.out.println(a==b);  <em>// false，非同一对象
</em>       
            System.out.println(a.equals(b));
 
            System.out.println(a==c); <em>//每new一次，都会重新开辟堆内存空间
</em>            
            System.out.println(aa==c);
    }</code></pre>
<!-- /wp:code -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p><em>这里用到了intern()，延展文章放一下:<a href="https://link.zhihu.com/?target=https%3A//blog.csdn.net/guoxiaolongonly/article/details/80425548" target="_blank" rel="noreferrer noopener">https://blog.csdn.net/guoxiaolongonly/article/details/80425548</a></em></p></blockquote>
<!-- /wp:quote -->

<!-- wp:paragraph -->
<p>运行结果为：</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://pic3.zhimg.com/80/v2-4aed5df4dc373f4e1320e16a92b8499e_1440w.png" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>对于第一个输出：以String aa="ab"; 形式赋值在java中叫直接量,它是在常量池中而不是像new一样放在压缩堆中。这种形式的字符串，在JVM内部发生字符串拘留，即当声明这样的一个字符串后，JVM会在常量池中先查找有有没有一个值为"abcd"的对象,如果有,就会把它赋给当前引用.即原来那个引用和现在这个引用指点向了同一对象，如果没有将开辟新内存地址存放。在这里将“ab”赋予bb时是给了bb以aa相同的内存地址，故为true;</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol><li>对于第二个输出：虽然a和b内容相同，但是都是new出来的，内存地址不同，故为false;</li><li>对于第三个输出：equals在这里为比较内容是否相同，明显一样，输出为true；</li><li>对于第四个输出：仍然因为其存放地址不同，导致输出为false;</li><li>对于第五个输出：这里就要介绍下intern（）了。</li></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>调用intern()方法之后把字符串对象加入常量池中，常量池我们都知道他是存在于方法区的，他是方法区的一部分，而方法区是线程共享的，所以常量池也就是线程共享的，但是他并不是线程不安全的，他其实是线程安全的，他仅仅是让有相同值的引用指向同一个位置而已，如果引用值变化了，但是常量池中没有新的值，那么就会新开辟一个常量结果来交给新的引用，而并非像线程不同步那样，针对同一个对象，new出来的字符串和直接赋值给变量的字符串存放的位置是不一样的，前者是在堆里面，而后者在常量池里面。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>因此，对于输出5，c已经被加入常量池中，常量池中已有同值存在，故给c以aa相同存放地址，故返回为true。因此，因为b还是在堆内存，存放地址肯定不同，c==b肯定返回为false,这个也可以去测试下。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>另外，在做字符串拼接操作，也就是字符串相"+"的时候，得出的结果是存在在常量池或者堆里面，这个是根据情况不同不一定的.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这里来一段代码测试下</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>String str1 = "aaa";
        String str2 = "bbb";
        String str3 = "aaabbb";
        String str4 = str1 + str2;
        String str5 = "aaa" + "bbb";
        System.out.println(str3 == str4); // false
        System.out.println(str3 == str4.intern()); // true
        System.out.println(str3 == str5);// true</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>因此，</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>1）对于==，一般比较的是值是否相等</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>如果作用于基本数据类型的变量，则直接比较其存储的 “值”是否相等；</li><li>　　如果作用于引用类型的变量，则比较的是所指向的对象的地址</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>2）对于equals方法，一般为比较内容是否相同</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>　　如果没有对equals方法进行重写，则比较的是引用类型的变量所指向的对象的地址；</li><li>　　诸如String、Date等类对equals方法进行了重写的话，比较的是所指向的对象的内容。</li></ul>
<!-- /wp:list -->

<!-- wp:list -->
<ul><li>转载链接：带你区别equals和== - 冷都男的文章 - 知乎 https://zhuanlan.zhihu.com/p/58126578</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->