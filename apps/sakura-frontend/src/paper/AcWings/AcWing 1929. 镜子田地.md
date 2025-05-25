---
title: AcWing 1929. 镜子田地
excerpt: ''
author: Sakura
publishDate: '2022-02-01'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/121555401_p0_master1200.jpg'
slug: 'AcWing-1929'
date: 2022-02-01 18:07:00
tags:
    - DFS
category:
    - 算法题
    - AcWings
---

<!-- wp:image {"id":293,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/01/image-6-1024x450.png" alt="" class="wp-image-293"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":294,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/01/image-7-1024x905.png" alt="" class="wp-image-294"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><li>分析<ul><li>先把这题转化成一个图论的问题<ul><li>转换为图论，我们就要找边和点</li><li><img class="wp-image-298" style="width: 150px;" src="http://106.14.114.97/wp-content/uploads/2022/01/image-9.png" alt=""></li><li>我们可以把一个镜子当作一个格子，一个格子里面有两个点</li><li>对应的边就是其中一个点能够走到周边的点</li></ul></li><li>那么我们对于转换之后的一整张图，我们可以分成不同的部分<ul><li>内部的点度为2<ul><li>因为在内部的点显然都有两条边，度为2</li></ul></li><li>边界的点度为1或0<ul><li><img class="wp-image-299" style="width: 500px;" src="http://106.14.114.97/wp-content/uploads/2022/01/image-10.png" alt=""></li><li>如上图所示<ul><li>上图右下角这样形状的部分，对应的点显然无法连接到任何边</li><li>上图右边的部分显然只有一条边连向其他点</li></ul></li></ul></li></ul></li><li>那么问题就转换成了<ul><li><span class="has-inline-color has-vivid-red-color">从边界出发能够走到的最长路径长度是多少？</span></li></ul></li><li>求最长路可以用SPFA算法，但是我们可以进一步观察图的性质<ul><li>对于该图，显然只可能由两种路径形成</li><li><img class="wp-image-300" style="width: 300px;" src="http://106.14.114.97/wp-content/uploads/2022/01/image-11.png" alt=""></li><li>一种就是简单路径，因为从边界的点度数为1开始进入，最后一定会从一个度数为1的边界点出去，而且不可能形成一个环，因为中间的结点的度为2，只能一前一后<ul><li><img class="wp-image-301" style="width: 400px;" src="http://106.14.114.97/wp-content/uploads/2022/01/image-12.png" alt=""></li><li>所以最后一定只能是简单路径</li></ul></li><li>还有一种情况就是环路，但是环路只可能存在于内部节点之中，但是我们从边界开始从度数为1的点开始射入的路径不可能会走到环路中</li></ul></li></ul></li><li>综上所述，对于这道题我们直接用图的遍历即可（dfs &amp; bfs），因为对于一条简单路径只可能有一种可能的前进方向（因为对于内部度数为2的结点，走到该点其中一条边是从之前的点走过来的边，那么就只能往剩下的那一条边的那个方向走了）</li><li>时间复杂度，每个结点最多都只可能被遍历两遍（即对于一条简单路径是无向的缘故，有可能会从一边遍历到另一边，再在另一次遍历的过程中从另一边遍历到这一边）<ul><li>因为一个格子有两个点，对应点数2*n*m，每个点都有可能遍历2遍</li><li>对应时间复杂度为O(4nm)</li></ul></li><li>代码如下</li></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include &lt;iostream>

using namespace std;

const int N = 1010;

char g&#91;N]&#91;N];
int n,m;
//我们规定向上射为0，向右射为1，向下射为2，向左射为3
int dx&#91;4] = {-1,0,1,0};
int dy&#91;4] = {0,1,0,-1};
int ans = 0;

int dfs(int x,int y,int d)
{
    if(x &lt; 0 || x >= n || y &lt; 0 || y >= m) return 0;//如果出界的话直接返回0
    if(g&#91;x]&#91;y] == '/') d ^= 1;
    else d ^= 3;
    
    return dfs(x + dx&#91;d],y + dy&#91;d],d) + 1;
}

int main()
{
    scanf("%d%d",&amp;n,&amp;m);
    for(int i = 0;i &lt; n;i++) scanf("%s",g&#91;i]);
    
    for(int i = 0;i &lt; n;i++)//遍历最左边和最右边两列
    {
        ans = max(ans,dfs(i,0,1));   //光线从最左边向右射，方向为1
        ans = max(ans,dfs(i,m-1,3)); //光线从最右边向左射，方向为3
    }
    for(int i = 0;i &lt; m;i++)//遍历最上边和最下边两列
    {
        ans = max(ans,dfs(0,i,2));   //光线从最上边向下射，方向为2
        ans = max(ans,dfs(n-1,i,0)); //光线从最下边向上射，方向为0
    }
    
    cout&lt;&lt;ans;
    return 0;
}</code></pre>
<!-- /wp:code -->

<!-- wp:list -->
<ul><li>注意点<ul><li>因为我们设定的是<img class="wp-image-302" style="width: 300px;" src="http://106.14.114.97/wp-content/uploads/2022/01/image-13.png" alt=""></li><li>所以对于两种镜子，有<ul><li><img class="wp-image-303" style="width: 400px;" src="http://106.14.114.97/wp-content/uploads/2022/01/image-14.png" alt=""><ul><li>0 &lt;===>1 （对应二进制 00 --- 01)</li><li>2 &lt;===>3 <strong>（对应二进制 10 --- 11）</strong></li><li>对应d ^= 1</li></ul></li><li><img class="wp-image-304" style="width: 400px;" src="http://106.14.114.97/wp-content/uploads/2022/01/image-15.png" alt=""><ul><li>0 &lt;===>3 （对应二进制 00 --- 11)</li><li>2 &lt;===>1 <strong>（对应二进制 10 --- 01）</strong></li><li>对应d ^= 3</li></ul></li></ul></li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->
