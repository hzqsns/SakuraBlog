---
title: AcWing 841. 字符串哈希
excerpt: ''
author: Sakura
publishDate: '2021-12-15'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/89893322_p0_master1200.jpg.jpeg'
slug: 'AcWing-841'
date: 2021-12-15 17:49:00
tags:
    - 字符串哈希
category:
    - 算法题
    - AcWings
---
<!-- wp:separator -->

<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":1} -->

<h1>字符串哈希</h1>
<!-- /wp:heading -->

<!-- wp:heading {"level":1} -->

<h1>题目</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":219,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/10/1-1-1024x313.png" alt="" class="wp-image-219"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->

<h1>输入输出</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":220,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/10/2.png" alt="" class="wp-image-220"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->

<h1>样例</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":221,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/10/3.png" alt="" class="wp-image-221"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->

<h1>分析思路</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->

<p>这题可以用字符串哈希的方式去解决<br>把字符串看成是一个P进制的数<br>str = "ABCABCDEYXC….."<br>那么<br>h[0] = 0;<br>h[1] = "A"的hash值<br>h[2] = "AB"的hash值<br>h[3] = "ABC"的hash值<br>h[4] = "ABCA"的hash值<br>…<br>1.<br>那么对于1到N的字符串来说<br>如果想求L到R区间的hash值<br>因为h[R]表示1到R的hash值<br>h[L-1]表示1到L-1的hash值<br>那么对于P进制来说，由于从左到右是从高位往低位走<br>对于h[R]来说，下标R对应的为P^0,R-1为P^1,…,依次类推1对应的就是P^(R-1)<br>对于h[L-1]，下标L-1对应的为P^0,L-2为P^1,…,依次类推1对应的就是P^(L-2)<br>那么我们把h[L-1]向左移直到与h[R]对齐，左移的位数就是R-1-(L-2) = R-L+1<br>比如123456789，我们要求789这个哈希值<br>那么就找到7之前的哈希值123456然后向左移3位得到123456000<br>最后123456789 - 123456000 = 789<br>所以从L到R这段的hash值就表示为h[R] - h[L-1]*P^(R-L+1)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>2.<br>对于字符串hash来说<br>ABCD假设映射为(1234)p<br>那么ABCD的hash值就为(1*P^3+2*P^2+3*P^1+4*P^0)mod Q<br>那么映射的hash值就是0到Q-1的数了<br>PS:Q经验值取2^64，p一般取131或者13331</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1} -->

<h1>注意点</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->

<p>1.字符串哈希默认P进制中的P = 131或者13331<br>2.不能把某一个字母映射成0，假设A映射成0，A的hash值为0，那么AA的hash值也为0，这样不同的字符串映射成了同一个数字，所以需要避免这种现象<br>3.因为映射的Q为2^64,我们可以不用取模运算，直接用unsigned long long 来存储我们所有的h[i]，溢出的时候就相当于模上2^64<br>4.预处理前缀就是h[i] = h[i-1]*P + str[i];</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1} -->

<h1>应用</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->

<p>可以应用于一个字符串里面判断有没有两段是完全相同，这个方法比KMP要更好<br>而且很多拓展的题目也可以应用到这个字符串哈希方法</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1} -->

<h1>草稿</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":222,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/10/4-768x1024.jpg" alt="" class="wp-image-222"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":223,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/10/5-1024x768.jpg" alt="" class="wp-image-223"/></figure>
<!-- /wp:image -->

<!-- wp:separator -->

<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":1} -->

<h1>代码如下</h1>
<!-- /wp:heading -->

<!-- wp:code -->

<pre class="wp-block-code"><code>#include <iostream>
#include <cmath>


using namespace std;

typedef unsigned long long ULL;

const int N = 100010,P = 131;

int n,m;
char str[N];
ULL h[N],p[N];


ULL get(int l,int r)//计算(l,r)的hash值
{
    return h[r] - h[l-1]*p[r-l+1];

}

int main()
{
    scanf("%d%d%s",&n,&m,str+1);

    p[0] = 1;//令P^0 = 1
    for(int i = 1;i <= n;i++)
    {
        p[i] = p[i-1] * P;//预处理P^i
        h[i] = h[i-1]* P + str[i];//计算字符串的前缀和取模hash值，因为用的是ULL类型所以就不用取模运算了
    }

    while(m--)
    {
        int l1,r1,l2,r2;
        scanf("%d%d%d%d",&l1,&r1,&l2,&r2);
        if(get(l1,r1) == get(l2,r2)) printf("Yes\n");
        else printf("No\n");

    }
    return 0;

}</code></pre>

<!-- /wp:code -->
