---
title: 如何使用rand5()生成rand7()
excerpt: '' 
author: Sakura
publishDate: '2021-09-15'
coverImage: 'http://www.hzqsns.com/wp-content/uploads/2021/07/77899254_p0_master1200.jpg' 
slug: 'algorithm-rand'
date: 2021-09-15 17:28:00
tags:
  - 数学
category:
  - 算法题
---
<!-- wp:list -->

<ul><li>已知<ul><li>rand5()能够生成0-4的随机数</li><li>rand7()能够生成0-6的随机数</li></ul></li><li>用rand7()生成rand5()<ul><li>这个思路比较简单就是不断地生成随机数，只返回0到4的随机数</li><li>因为rand7()生成的0、1、2、3、4、5、6每个的概率都是1/7</li><li>那么生成0、1、2、3、4也都是等概率的</li></ul></li><li>用rand5()生成rand7()<ul><li>这里就要考虑如何使用rand5()生成大于4的随机数 - 简单的使用rand5()×2之类的操作肯定是不行了，这只会让随机数由0-4变成0,2,4,8</li><li>使用rand5()+rand5()呢？<ul><li>似乎确实覆盖了0-8，但是0-8数字概率并不均衡，例如0的可能只有0+0，但是2的可能有1+1,0+2,2+0三种，因此并不是真的均匀随机 </li></ul></li><li>我们不难发现，单纯的相加会导致重复的数生成，那么我们这个时候就得想一个方法，使得组合起来的数没有重复的数，而且最好这个组合生成的数的概率都相等，最后我们把生成随机数的范围扩大之后，再根据用rand7()生成rand5()类似的思路缩小范围就可以得到我们想要的结果<ul><li>因为rand5()会生成0、1、2、3、4</li><li>那么我们需要避开生成0、1、2、3、4这些数，这个时候我们就想能不能把rand5()做乘法<ul><li>比如rand5()*5会生成0、5、10、15、20</li><li>而这个时候我们发现rand5()+rand5()*5刚好可以覆盖0-25这所有的数，而且所有的数都是等概率的</li></ul></li></ul></li><li>因此我们可以先生成0-25的数，然后只取0-6生成的随机数就能够实现rand7()了</li></ul></li><li>新的问题：尽管我们生成了一个rand25()->rand7(),但采用上述方法获取rand7()会消耗大量的时间,因此不能消极等待小于7的随机数的出现<ul><li>这个时候我们就想到了取模操作，但是rand25()%7又会导致最后的概率不均匀</li><li>我们很容易就能想到，如果是rand21()%7生成0-6的概率就均匀了，同理我们可以根据rand25()->rand21()然后再根据取模运算实现rand7()</li><li>代码如下</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:code -->

<pre class="wp-block-code"><code>int rand7()
{
  int res = rand5()*5 + rand5();
  while(res>20)
  {
    res = rand5()*5 + rand5();
  }
  return res%7;
}</code></pre>

<!-- /wp:code -->

<!-- wp:list -->

<ul><li>小结：这其实是一个通用的方法，就是通过randX()来实现randY()（X < Y）</li><li>通用的方法就是<strong>randX()</strong> + <strong>randX()</strong> * X，然后再通过取模运算减少时间复杂度</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->

<p></p>
<!-- /wp:paragraph -->
