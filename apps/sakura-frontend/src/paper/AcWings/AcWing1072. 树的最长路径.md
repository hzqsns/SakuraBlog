---
title: AcWing1072. 树的最长路径
excerpt: '' 
author: Sakura
publishDate: '2022-10-27'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/130108237_p0_master1200.jpg' 
slug: 'AcWing-1072'
date: 2022-10-27 18:51:00
tags:
  - 二叉树
category:
  - 算法题
  - AcWings
---

<!-- wp:paragraph -->
<p><a href="http://106.14.114.97/wp-admin/edit.php?post_type=post"></a></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":437,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/04/image-1024x779.png" alt="" class="wp-image-437"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>PS：最近在复习算法，看到有好的写好的题解为了不浪费时间直接转载过来了，如有侵权请告知我删除hhh</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>转载自</p><p><strong>https://www.acwing.com/solution/content/29832/</strong></p></blockquote>
<!-- /wp:quote -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://cdn.acwing.com/media/article/image/2021/01/12/42785_8942e62a54-QQ%E6%B5%8F%E8%A7%88%E5%99%A8%E6%88%AA%E5%9B%BE20210112132341.png" alt="QQ浏览器截图20210112132341.png"/><figcaption><img src="https://cdn.acwing.com/media/article/image/2021/01/12/42785_51d8f82a54-QQ%E6%B5%8F%E8%A7%88%E5%99%A8%E6%88%AA%E5%9B%BE20210112134420.png" alt="QQ浏览器截图20210112134420.png"></figcaption></figure>
<!-- /wp:image -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://cdn.acwing.com/media/article/image/2021/01/12/42785_2bc0d6e854-QQ%E6%B5%8F%E8%A7%88%E5%99%A8%E6%88%AA%E5%9B%BE20210112135015.png" alt="QQ浏览器截图20210112135015.png"/><figcaption>注:本题的答案不一定为以u为顶点的路径,因为u到x,y,z的距离可能均为负数,所以答案可以是以x,y或者z为顶点的路径<br>本题采用dfs的方法来求解,所以是求解方式自下而上的</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>代码如下</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include &lt;iostream&gt;
#include &lt;vector&gt;

using namespace std;

#define x first
#define y second

typedef pair&lt;int,int&gt; PII;

const int N = 10010;
vector&lt;PII&gt;link&#91;N];
int n;
int ans = 0;

//dfs找以当前结点为起点向下的最长路径
//u表示当前结点
//father表示u的父节点,因为该图为无向图,并且迭代过程中不能回到父节点,所以要特殊标记.
int dfs(int u,int father)
{
    int dist = 0;
    int d1 = 0,d2 = 0;//d1表示当前结点到下面结点的最长距离，d2表示次长距离
    for(int i = 0;i &lt; link&#91;u].size();i++)
    {
        int v = link&#91;u]&#91;i].x,c = link&#91;u]&#91;i].y;
        if(v == father) continue;
        //此时的d代表u对应的一个子节点v，v到下面结点的最远距离
        //即u - v ---- x
        //对应u到下面结点的最远距离
        //即u对应所有子节点(v1,v2,v3)到下面结点的最远距离再加上u到(v1/v2/v3)的距离(c1/c2/c3)
        int d = dfs(v,u) + c;
        dist = max(dist,d);
        if(d &gt;= d1) d2 = d1,d1 = d;
        else if(d &gt;= d2) d2 = d;
    }
    ans = max(ans,d1+d2);
    
    return dist;
}


int main()
{
    cin&gt;&gt;n;
    int a,b,c;
    for(int i = 0;i &lt; n-1;i++)
    {
        cin&gt;&gt;a&gt;&gt;b&gt;&gt;c;
        //cout&lt;&lt;a&lt;&lt;" "&lt;&lt;b&lt;&lt;" "&lt;&lt;c&lt;&lt;"***"&lt;&lt;endl;
        link&#91;a].push_back({b,c});
        link&#91;b].push_back({a,c});
    }
    dfs(1,-1);
    
    
    cout&lt;&lt;ans&lt;&lt;endl;
    
    return 0;
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>补充</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img src="https://cdn.acwing.com/media/article/image/2021/01/12/42785_ac55807454-QQ%E6%B5%8F%E8%A7%88%E5%99%A8%E6%88%AA%E5%9B%BE20210112172709.png" alt="QQ浏览器截图20210112172709.png"/><figcaption><img src="https://cdn.acwing.com/media/article/image/2021/01/12/42785_15b7728454-QQ%E6%B5%8F%E8%A7%88%E5%99%A8%E6%88%AA%E5%9B%BE20210112173143.png" alt="QQ浏览器截图20210112173143.png"></figcaption></figure>
<!-- /wp:image -->
