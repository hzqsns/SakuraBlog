---
title: AcWing292.炮兵阵地
excerpt: '' 
author: Sakura
publishDate: '2021-11-15'
coverImage: 'http://www.hzqsns.com/wp-content/uploads/2021/07/76153784_p0_master1200.jpg' 
slug: 'AcWing-292' 
date: 2021-11-15 17:40:00
tags:
  - 状态压缩
category:
  - 算法题
  - AcWings
---

<!-- wp:heading {"level":1} -->
<h1>题目</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":184,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/1-2-1024x624.png" alt="" class="wp-image-184"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->
<h1>输入输出</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":185,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/2-2-1024x524.png" alt="" class="wp-image-185"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->
<h1>分析</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>这题其实是上道题<a href="http://azuresakura.cn/2020/05/01/AcWing327-CornField-StateCompression/">玉米田</a>的进阶</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>区别在于这题的限制范围从1行扩大到了2行，所以我们dp的状态应该多加一维<br>即f[i][j][k]表示所有摆完前i行且第i-1行状态为j，第i行状态为k摆放方案的最大值</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>假设第i-1行状态为a，第i行状态为b，第i-2行状态为c</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>那么我们假设想确定第i行是什么状态，那么我们就要用第i-1行和第i-2行的状态加上第i行能摆放的所有方案确定第i行的状态</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>即f[i][a][b] = max(f[i][a][b],f[i-1][c][a] + cnt[b]);<br>这里的cnt[b]表示第i行对应的状态里面有多少个1(即对应二进制中1的个数)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>从而可以求出摆放完第i行方案的最大值是多少</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>需要注意的几个问题</h2>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->
<ol><li>因为这题摆放完一个炮兵之后那么它上下左右长度为2形状为一个十字的地方都不能摆放炮兵</li></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>所以我们需要预处理状态，把不冲突的状态枚举出来<br>所以我们需要预先处理摆放在同一行不冲突的状态先枚举出来存到state里面</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这里冲突的判断条件就是二进制状态state<br>判断条件(state &gt;&gt; i) &amp; 1 &amp;&amp; ((state &gt;&gt; i+1 &amp; 1) || (state &gt;&gt; i+2 &amp; 1))如果为1的话说明冲突了<br>不能作为合法的状态<br>否则为合法的状态存到state里面</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true,"start":2} -->
<ol start="2"><li>这题里面有山地的存在，山地是不能摆放炮兵的<br>我们可以把山地定义为1，平原定义为0</li></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>然后把第i行的初始状态的二进制表示转化为十进制表示存到数组g[i]中<br>如果我要枚举的那一行的状态为a的话</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>如果g[i] &amp; a &gt; 0表示我想要到第i行摆放的炮兵会摆放到山地上，所以导致了冲突</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true,"start":3} -->
<ol start="3"><li>我们会分别枚举第i-2行、第i-1行、第i行的状态(这些状态都是从之前挑选的合法状态state中枚举)</li></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>这三行的炮兵也不能互相攻击到，意味着三行的状态，两两都不能在同一列上(因为我们之前枚举的合法状态避免了行与行之间的冲突所以不用再次考虑)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>假设第i-1行状态为a，第i行状态为b，第i-2行状态为c</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>那么对应的判断条件(a &amp; b) || (a &amp; c) || (b &amp; c)也不能为真</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true,"start":4} -->
<ol start="4"><li>这题需要我们用滚动数组去求解</li></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p><strong>为什么要用滚动数组?</strong><br>分析时间复杂度，因为f[i][j][k]表示所有摆完前i行且第i-1行状态为j，第i行状态为k摆放方案的最大值<br>那么i最大为100，j和k最大为1 &lt;&lt; 10即1024，1024*1024*100 / 1024 / 1024 = 100MB<br>但是题目只给了64MB，所以我们需要缩小第1维的大小去做</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>所以我们只用对第1维&amp;1即可，即f[n &amp; 1][a][b]<br>对应的状态转移方程中改成f[i &amp; 1][a][b] = max(f[i &amp; 1][a][b],f[i-1 &amp; 1][c][a] + cnt[b]);<br>因为这样i &amp; 1一定和(i - 1)&amp; 1不会相同，所以f的三维可以定义为f[2][M][M]<br>第一维对应的第1行一定是从第0行转移过来，第0行一定是从第1行转移过来</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true,"start":5} -->
<ol start="5"><li>最后枚举倒数两行的状态<br>res += f[n &amp; 1][i][j]，i和j都是合法状态state里面的状态，如果存在值说明能转移过来得到对应的值，如果不能转移过来值为0不影响结果</li></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>当然你也可以选择y总那样的写法，枚举到n+2行，最后f[n+2 &amp; 1][0][0]就是对应的最终值</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true,"start":6} -->
<ol start="6"><li>枚举第i-2行、第i-1行、第i行的顺序可以互换，只要状态定义的顺序和状态计算的顺序对应即可</li></ol>
<!-- /wp:list -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":1} -->
<h1>代码如下</h1>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include &lt;iostream&gt;
#include &lt;vector&gt;

using namespace std;

const int N = 110,M = 1 &lt;&lt; 10;

int n,m;
int f&#91;2]&#91;M]&#91;M];//f&#91;i]&#91;j]&#91;k]表示所有已摆完第i行，且第i-1行状态为j，第i行状态为k的最大值
int cnt&#91;M];//记录每个状态中炮兵的数目(也就是1的数目)
int g&#91;N];//记录每一行的山地情况
vector&lt;int&gt;state;//记录每个合法的状态

bool check(int state)//判断合法的状态，相邻两格之间不能有两个1
{
    for(int i = 0;i &lt; m;i++)
    {
        if((state &gt;&gt; i) &amp; 1 &amp;&amp; ( (state &gt;&gt; i+1 &amp; 1) || (state &gt;&gt; i+2 &amp; 1))) return false;
    }
    return true;
}

int count(int state)//计算每个状态中的1的个数即炮兵的个数
{
    int res = 0;
    for(int i = 0;i &lt; m;i++) res += state &gt;&gt; i &amp; 1;
    return res;
}

int main()
{
    cin&gt;&gt;n&gt;&gt;m;
    for(int i = 1;i &lt;= n;i++)
    {
        for(int j = 0;j &lt; m;j++)
        {
            char c;
            cin&gt;&gt;c;

            if(c == 'H') g&#91;i] += 1 &lt;&lt; (m - j - 1);//把山地和平原看成01二进制然后转化为十进制存放到数组中欧冠
        }
        //cout&lt;&lt;g&#91;i]&lt;&lt;endl;
    }

    //筛出合法的状态
    for(int i = 0;i &lt; 1 &lt;&lt; m;i++)
    {
        if(check(i))
        {
            state.push_back(i);
            cnt&#91;i] = count(i);//计算对应每个合法状态中1的个数即炮兵的个数
        }
    }

  //for(int i = 1;i &lt;= n+2;i++)
    for(int i = 1;i &lt;= n;i++)
    {
        for(int u = 0;u &lt; state.size();u++)//第i-1行的状态
        {
            for(int j = 0;j &lt; state.size();j++)//第i行的状态
            {
                for(int k = 0;k &lt; state.size();k++)//第i-2行的状态
                {
                    int a = state&#91;u],b = state&#91;j],c = state&#91;k];
                    if((a &amp; b) || (a &amp; c) || (b &amp; c)) continue;//第i行、第i-1行、第i-2行不能相互攻到
                    if((g&#91;i-1] &amp; a) || (g&#91;i] &amp; b) || (g&#91;i-2] &amp; c)) continue;//第i-1行和第i行不能占到山地上，从而确定了第i行和第i-1行的状态，然后就可以枚举第i-2行的状态

                    f&#91;i &amp; 1]&#91;a]&#91;b] = max(f&#91;i &amp; 1]&#91;a]&#91;b],f&#91;i-1 &amp; 1]&#91;c]&#91;a] + cnt&#91;b]);
                }
            }
        }
    }
    //cout&lt;&lt;f&#91;n+2 &amp; 1]&#91;0]&#91;0];
    int res = 0;
    for(auto t1 : state)
    {
        for(auto t2 : state)
        {
            res = max(res,f&#91;n &amp; 1]&#91;t1]&#91;t2]);
        }
    }

    cout&lt;&lt;res;
    return 0;
}</code></pre>
<!-- /wp:code -->