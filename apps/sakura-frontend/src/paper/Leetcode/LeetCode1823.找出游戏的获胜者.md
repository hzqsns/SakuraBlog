---
title: LeetCode1823.找出游戏的获胜者
excerpt: '' 
author: Sakura
publishDate: '2022-12-08'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/126756617_p0_master1200.jpg' 
slug: 'LeetCode-1823'
date: 2022-12-08 18:58:00
tags:
  - 约瑟夫环
category:
  - 算法题
  - Leetcode
---

<!-- wp:image {"id":458,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/05/image-5-925x1024.png" alt="" class="wp-image-458"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":459,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/05/image-6.png" alt="" class="wp-image-459"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>分析</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>本题为经典的约瑟夫环问题，下面以一个例子来引入</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>约瑟夫环（约瑟夫问题）是一个数学的应用问题：已知 n 个人（以编号1，2，3…n分别表示）围坐在一张圆桌周围。从编号为 k 的人开始报数，数到 m 的那个人出圈；他的下一个人又从 1 开始报数，数到 m 的那个人又出圈；依此规律重复下去，直到剩余最后一个胜利者。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>例如：有10个人围成一圈进行此游戏，每个人编号为 1-10 。若规定数到 3 的人出圈。则游戏过程如下。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>（1）开始报数，第一个数到 3 的人为 3 号，3 号出圈。<br>  1， 2， 【<strong><span class="has-inline-color has-vivid-red-color">3</span></strong>】， 4， 5， 6， 7， 8， 9， 10。<br>（2）从4号重新从1开始计数，则接下来数到3的人为6号，6号出圈。<br>  1， 2， 【<strong><span class="has-inline-color has-vivid-red-color">3</span></strong>】， 4， 5， 【<strong>6</strong>】， 7， 8， 9， 10。<br>（3）从7号重新从1开始计数，则接下来数到3的人为9号，9号出圈。<br>  1， 2， 【<strong>3</strong>】， 4， 5， 【<strong>6</strong>】， 7， 8， 【<strong>9</strong>】， 10。<br>（4）从10号重新从1开始计数，由于10个人称环形结构，则接下来数到3的人为2号，2号出圈。<br>  1， 【<strong>2</strong>】， 【<strong>3</strong>】， 4， 5， 【<strong>6</strong>】， 7， 8， 【<strong>9</strong>】， 10。<br>（5）从4号重新从1开始计数，则接下来数到3的人为7号，7号出圈。<br>  1， 【<strong>2</strong>】， 【<strong>3</strong>】， 4， 5， 【<strong>6</strong>】， 【<strong>7</strong>】， 8， 【<strong>9</strong>】， 10。<br>（6）从8号重新从1开始计数，则接下来数到3的人为1号，1号出圈。<br>  【<strong>1</strong>】， 【<strong>2</strong>】， 【<strong>3</strong>】， 4， 5， 【<strong>6</strong>】， 【<strong>7</strong>】， 8， 【<strong>9</strong>】， 10。<br>（7）从4号重新从1开始计数，则接下来数到3的人为8号，8号出圈。<br>  【<strong>1</strong>】， 【<strong>2</strong>】， 【<strong>3</strong>】， 4， 5， 【<strong>6</strong>】， 【<strong>7</strong>】， 【<strong>8</strong>】， 【<strong>9</strong>】， 10。<br>（8）从10号重新从1开始计数，则接下来数到3的人为5号，5号出圈。<br>  【<strong>1</strong>】， 【<strong>2</strong>】， 【<strong>3</strong>】， 4， 【<strong>5</strong>】， 【<strong>6</strong>】， 【<strong>7</strong>】， 【<strong>8</strong>】， 【<strong>9</strong>】， 10。<br>（9）从10号重新从1开始计数，则接下来数到3的人为10号，10号出圈。<br>  【<strong>1</strong>】， 【<strong>2</strong>】， 【<strong>3</strong>】， 4， 【<strong>5</strong>】， 【<strong>6</strong>】， 【<strong>7</strong>】， 【<strong>8</strong>】， 【<strong>9</strong>】， 【<strong>10</strong>】。<br>（10）最终剩余 4 号，4 号为胜利者。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>一般的思路</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>约瑟夫环问题可以转化为循环链表的数据结构来求解。可以将每个人看做链表的单个节点，每个节点之间通过链表的 next 指针连接起来，并且将链表末尾节点指向头节点就形成的环，由链表构成的环形结构在数据结构中称为循环链表。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这里我们可以用队列来代替这个模拟过程</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>我们首先构造一个队列，将1到n塞进去，然后我们例如队列可以左右互插的特点，因为每次要把第k个数搞出去，所以我们每次只需要将前k-1个数放到队列最后，然后第k个数就变成了在队列首位，弹出即可，反复进行即可。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class Solution {
public:
    int findTheWinner(int n, int k) {
        queue&lt;int> ans;
        for(int i=1; i&lt;n+1; i++) ans.emplace(i); //建立 0 到 n+1的队列
        while(ans.size()>1){  //等数组的个数到一个的时候，就跳出循环，输出即可
            for (int i=0; i&lt;k-1; i++){ //将队列的前k-1位都放到队列最后
                ans.emplace(ans.front()); //将第K位提到首位
                ans.pop(); 
            }
            ans.pop(); //然后弹出首位
        }
        return ans.front();//返回首位即是留下的值
    }
};</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>数学分析</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>约瑟夫环中，每当有一个人出圈，出圈的人的下一个人成为新的环的头，相当于把数组向前移动 m 位。若已知 n-1 个人时，胜利者的下标位置位 f(n−1,m) ，则 n 个人的时候，就是往后移动 m 位，(因为有可能数组越界，超过的部分会被接到头上，所以还要模 n )，根据此推导过程得到的计算公式为：<br>  <strong>f(n,m) = (f(n−1,m) + m) % n</strong>。<br>其中，f(n,m) 表示 n 个人进行报数时，每报到 m 时杀掉那个人，最终的编号，f(n−1,m) 表示，n-1 个人报数，每报到 m 时杀掉那个人，最终胜利者的编号。有了递推公式后即可使用递归的方式实现。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>递归代码如下</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>int Joseph(int n,int m)/*计算约瑟夫环的递归函数*/
{
    if(n &lt;= 1 || m &lt;= 1)//设置游戏人数限定值
        return -1;

    if(n == 2)//设置边界值
    {
        if(m % 2 == 0)
            return 1;
        else
            return 2;
    }
    else
    {
        return (Joseph(n-1,m) + m-1) % n+1;//递归调用
    }
}

int main()
{
    int n,m,x;
    scanf("%d %d",&amp;n,&amp;m);
    x=Joseph(n,m);
    printf("最后一个数为：%dn",x);
    return 0;
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>递归代码还可以优化成迭代形式</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>/*计算约瑟夫环问题的迭代法函数*/
int Joseph(int n,int m)
{
    int i;
    int x,y;
    if(n &lt;= 1 || m &lt;= 1)
        return -1;
    if(m % 2 == 0)
        y = 1;
    else
        y = 2;

    for(i = 3; i &lt;= n; i++)
    {
        x = (y-1 + m) % i + 1;
        y = x;
    }
    return y;
}

int main()
{
    int n,m,x;
    scanf("%d %d",&amp;n,&amp;m);
    x = Joseph(n,m);
    printf("最后一个的编号是：%dn",x);
    return 0;
}</code></pre>
<!-- /wp:code -->
