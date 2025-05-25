---
title: AcWing 122. 糖果传递-贪心
excerpt: '' 
author: Sakura
publishDate: '2021-11-05'
coverImage: 'http://www.hzqsns.com/wp-content/uploads/2021/07/80638598_p0_master1200.jpg' 
slug: 'AcWing-122'
date: 2021-11-05 17:36:00
tags:
  - 贪心
category:
  - AcWings
  - 算法题
---

<!-- wp:heading {"level":1} -->
<h1>题目</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":173,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/image-1-1024x561.png" alt="" class="wp-image-173"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->
<h1>输入输出格式</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":174,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/image-2-1024x224.png" alt="" class="wp-image-174"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->
<h1>分析思路</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>n个小朋友围成一个环，然后每个人只能给左右两个人传递糖果<br>且传递x个糖果消耗的代价为x</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>第一直觉肯定是糖果多的人怎么传给糖果少的人<br>一时半会看不出来用什么方法可以解决问题，我们于是可以先建立一个数学模型</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>建立数学模型</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>我们可以设n个小朋友现在手里的糖果数分别为A1,A2,A3 … ,An-1,An<br>我们约定，从An传递到An-1为Xn个糖果数</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>其中,Xn为正表示糖果从An传递到An-1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>反之如果为负，则表示从An-1传递到An</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":176,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/image-4-1024x611.png" alt="" class="wp-image-176"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>则依题意可知我们最终要求的就是|X1| + |X2| + |X3| + … + |Xn|的最小值</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>第二次做题的思路</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":179,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/image-5-1024x870.png" alt="" class="wp-image-179"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><br>然后转化成求一个点到各个C[i]的距离之和最小，就是排序之后的C[i]数组的中点到各个C[i]点之差的和即为最小的距离之和</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>代码如下</h2>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include &lt;iostream&gt;
#include &lt;cstdio&gt;
#include &lt;cmath&gt;
#include &lt;algorithm&gt;

using namespace std;
const int N = 1000000 +10;
typedef long long LL;
int A&#91;N],C&#91;N],S&#91;N];//A&#91;i]记录原数据,S&#91;i]为A&#91;i]的前缀和数组
LL n,sum = 0,avg,res;

int main()
{
    scanf("%lld",&amp;n);
    for(int i = 1;i &lt;= n;i++)
    {
        scanf("%d",&amp;A&#91;i]);
        sum += A&#91;i];
        S&#91;i] = S&#91;i-1]+A&#91;i];
    }
    avg = sum / n;
    for(int i = 1;i &lt;= n;i++)
    {
        C&#91;i] = S&#91;i-1]-avg*(i-1);
    }
    sort(C+1,C+1+n);
    for(int i = 1;i &lt;= n;i++)
    {
        res += abs(C&#91;n/2]-C&#91;i]);
    }
    cout&lt;&lt;res;

    return 0;
}</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>第一次做题的思路</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>那么，显而易见最后每个点的结果一定是Ā<br>每个点起初都是Ai，结果都是Ā<br>那么我们通过每个点可以得到n个关系式<br>即<br>A1 - X1 + X2 = Ā<br>A2 - X2 + X3 = Ā<br>A3 - X3 + X4 = Ā</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>…</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>An-1 - Xn-1 + Xn = Ā<br>A1 - Xn + X1 = Ā</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:paragraph -->
<p>整理上式<br>X1 - X2 = A1 - Ā<br>X2 - X3 = A2 - Ā<br>…<br>Xn-2 - Xn-1 = An-2 - Ā<br>Xn-1 - Xn = An-1 - Ā<br>Xn - X1 = An - Ā</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:paragraph -->
<p>感觉跟差分数列差不多的样子<br>于是我们从最后一项依次递加i项<br>比如最后两项相加可以得到X2 = X1 - ((n-1)Ā - An - An-1 -…- A2)<br>最后三项相加可以得到X3和X1的关系<br>依次类推<br>我们可以得到Xi与X1的一个线性关系<br>从而我们可以把所有的Xi转换成X1+Ci继续进行求解</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>继续整理<br>Xn = X1 - (Ā - An)<br>Xn-1 = X1 - (2Ā - An - An-1)<br>…<br>X2 = X1 - ((n-1)Ā - An - An-1 -…- A2)<br>X1 = X1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>于是我们要求的|X1| + |X2| + |X3| + … + |Xn|<br>可以转换成|X1 - C1| + |X1 - C2| + |X1 - C3| + … + |X1 - Cn|</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>即转换成在直线上求一点X使得X到C1,C2,C3,…,Cn的距离最小</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>其中<br>C1 = Ā - An<br>C2 = 2Ā - An - An-1<br>…<br>Cn-1 = (n-1)Ā - An - An-1 -…- A2<br>Cn = 0</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>可以发现其中的一个递推关系就是<br>Cn - Cn-1 = Ā - An-1<br>又C1 = Ā - An<br>我们可以根据这个递推关系求出所有的Ci<br>然后再对Ci从小到大排序<br>找到Ci的中间的点就是使得它到其他Ci距离之和最小的点</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>注意点</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>1.数列最好从1开始方便计算<br>2.当数列从1开始的时候，中间点即为(n+1)/2，需要+1<br>3.数据可能爆int，所以要用long long 长整形表示结果</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1} -->
<h1>总结</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>这题是AcWing 104. 货仓选址的一个进阶题目，或者说是区间选点加了一个套子<br>难点在于我们在考试的时候如果遇到这种题很难静下心来去分析出题目的数学模型并进行进一步的整理<br>所以需要我们多做题多总结模型才行啊（</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":1} -->
<h1>代码如下：</h1>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include &lt;iostream&gt;
#include &lt;cstdio&gt;
#include &lt;cmath&gt;
#include &lt;algorithm&gt;

using namespace std;
const int N = 1000000 +10;
typedef long long LL;
int A&#91;N],C&#91;N],S&#91;N];//A&#91;i]记录原数据
LL n,sum = 0,avg;

int main()
{
    cin&gt;&gt;n;
    for(int i = 1;i &lt;= n;i++)
    {
        scanf("%d",&amp;A&#91;i]);//数据范围较大最好用scanf进行输入
        sum += A&#91;i];//计算所有糖果的和
    }
    avg  = sum / n;//计算糖果的平均值
    int k = 1;
    C&#91;k] = avg - A&#91;n];//初始化，C&#91;1] = Ā - An
    for(int i = n;i &gt; 1;i--)
    {
        C&#91;k+1] = C&#91;k] + avg - A&#91;i-1];//根据Cn - Cn-1 = Ā - An-1递推关系来算出所有C&#91;i]的值
        k++;
    }
    C&#91;n] = 0;
    sort(C+1,C+n+1);//对各个点到原点的距离进行排序
    LL res = 0;
    for(int i = 1;i &lt;= n;i++)
    {
        res += abs(C&#91;(n+1)/2] - C&#91;i]);//找到中间的那个点再计算到其他个点的距离之和
    }
    cout&lt;&lt;res;//因为数据保证一定有解，所以我们直接输出res
    return 0;
}</code></pre>
<!-- /wp:code -->