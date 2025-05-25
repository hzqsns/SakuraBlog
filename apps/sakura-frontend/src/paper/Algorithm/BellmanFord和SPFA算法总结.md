---
title: BellmanFord和SPFA算法总结
excerpt: '' 
author: Sakura
publishDate: '2021-09-05'
coverImage: 'http://www.hzqsns.com/wp-content/uploads/2021/07/76377786_p0_master1200.jpg' 
slug: 'BellmanFord-SPFA'
date: 2021-09-05 17:23:00
tags:
  - BellmanFord
  - SPFA
category:
  - 算法理论
---

<!-- wp:heading {"level":1} -->
<h1>题目</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":126,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/1-1024x435.png" alt="" class="wp-image-126"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->
<h1>输入输出</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":127,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/2-1024x416.png" alt="" class="wp-image-127"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->
<h1>分析思路</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>dijkstra算法不能处理有负权边的情况<br>Bellman-Ford算法适用于带负环的图，如果题目限制了最短路经过的边的个数，如上图的代码，那么有负环也无所谓了，因为限制k次导致我们不能无限的经过负环<br>实现思路：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>for(循环n次)
  for(循环所有边a,b,w)
      dist[b] = min(dist[b],backup[a]+w)
//其中所有边就可以直接用一个结构体数组来存储，不一定需要邻接表，只要能遍历到所有边就可以了</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>为什么用backup[N]数组来存放上一个的结果</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><img src="BellmanFord-and-SPFA/4.png" alt=""></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":129,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/4-1024x575.png" alt="" class="wp-image-129"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><br>如图所示，如果题目要求k = 1，那么我们从1到3只能选择下面一条路径去求<br>如果不用backup数组来存放上一个的话<br>那么<br>d[1] = 0<br>d[2] = min(d[1]+1,d[2]) = 1<br>此时再继续循环d[3]= min(d[2]+1,d[2]) = 2<br>此时d[3]就是用上一个已经更新了的2来继续更新的<br>此时则发生串联<br>那么我们只调用上一个的backup数组<br>d[1] = 0;<br>backup[1] = 0,backup[2] = INF,backup[3] = INF;<br>d[2] = min(d[2],backup[1]+1) = 1//1--2(1)<br>d[3] = min(d[3],backup[2]+1) = INF//2--3(1)<br>d[3] = min(d[3],backup[1]+3) = 3//1--3(3)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>时间复杂度为O(nm)</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":130,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/3-1024x528.png" alt="" class="wp-image-130"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>注意点</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>1.为什么是d[n] > 0x3f3f3f3f/2？<br>因为存在负权边，那么虽然n也是正无穷，但是经过负权边可能会把n的正无穷减小一点，但是也不会减太多，最多减500*10000，所以写成d[n] > 0x3f3f3f3f/2即可判断<br>2.memset函数是以字节为单位赋值的，每个int包含4个字节，所以memset完之后所有数会变成0x3f3f3f3f</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1} -->
<h1>代码如下</h1>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include <iostream>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 510,M = 10010;


int n,m,k;
int d[N],backup[N];

struct Edge{
    int a,b,w;

}edges[M];

int bellman_ford(int s)
{
    memset(d,0x3f,sizeof d);
    d[s] = 0;
    for(int i = 0;i < k;i++)
    {
        memcpy(backup,d,sizeof d);
        for(int j = 0;j < m;j++)
        {
            int a = edges[j].a,b = edges[j].b,w = edges[j].w;
            d[b] = min(d[b],backup[a] + w);
        }
    }
    if(d[n] > 0x3f3f3f3f/2) return -1;
    return d[n];
}

int main()
{
    scanf("%d%d%d",&n,&m,&k);
    int i = 0;
    for(int i = 0;i < m;i++){
        int a,b,w;
        scanf("%d%d%d",&a,&b,&w);
        edges[i] = {a,b,w};
    }
    int t = bellman_ford(1);
    if(t == -1) puts("impossible");
    else printf("%d\n",t);

    return 0;
}</code></pre>
<!-- /wp:code -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":1} -->
<h1>SPFA算法</h1>
<!-- /wp:heading -->

<!-- wp:heading {"level":1} -->
<h1>题目</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":131,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/5-1024x440.png" alt="" class="wp-image-131"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->
<h1>输入输出</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":132,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/6-1024x411.png" alt="" class="wp-image-132"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->
<h1>分析思路</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>SPFA算法是bellman-ford算法的优化<br>在bellman-ford算法中，他要遍历所有边来进行更新，但是每一次迭代不一定每一条边都需要更新</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>dist[b] = min(dist[b],dist[a]+w)</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>那么SPFA可以对其进行优化<br>dist[b]如果想变小的话，那么一定是dist[a]变小了<br>如果dist[a]不变，那么dist[b]也一定不变</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>那么我们每次就可以用一个队列(堆、优先队列，但是一般来说用队列就可以了)进行存储，队里面就存放的就是所有变小的结点，只要队列里面不空，就取出队头t，更新t的所有出边，如果更新成功，就把b加入队列，如果队列里面已经有b了，就不用再存放进队列里面了</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>它的基本思路就是我更新过谁，我就再拿谁去更新别人，一个点如果没有被更新过，那么它就没有必要去更新别人，只有前面的点变小了，后面的点才会跟着变小</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>我的理解就是，它这个点变小了，他肯定会影响更多的点，所以就需要放入队列里面进行操作</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>注意点</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>1.spfa只会更新所有能从起点走到的点，所以如果无解，那么起点就走不到终点，那么终点的距离就是0x3f3f3f3f</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1} -->
<h1>代码如下</h1>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include <iostream>
#include <cstdio>
#include <cstring>
#include <queue>
#include <vector>

using namespace std;

//用vector建图的写法

const int N = 1e5+10;
int d[N];//d[i]表示从起点到i的距离
int vis[N];//i是否在队列中
int n,m;//n个点m条边

struct node{
    int to,w;//b代表终点，w代表a->b的边权
};
vector<node> G[N];//相当于拉链法,G[i]插入i连接的各个结点

int main()
{
    scanf("%d %d",&n,&m);
    memset(d,0x3f,sizeof d);
    for(int i = 0;i < m;i++)
    {
        int a,b,c;
        scanf("%d %d %d",&a,&b,&c);
        G[a].push_back({b,c});
    }
    
    d[1] = 0;//1号点初始化为0
    queue<int> q;
    vis[1] = true;//1号点在队列中
    q.push(1);
    
    while(q.size())
    {
        int t = q.front();
        q.pop();
        vis[t] = false;
        for(int i = 0;i < G[t].size();i++)
        {
            int b = G[t][i].to;//t相连的点为b
            int dist = G[t][i].w;//t到b的距离为dist
            if(d[b] > d[t] + dist)//如果从起点到t再到b的距离比起点到b的距离要短的话
            {
                d[b] = d[t] + dist;//更新最短距离
                if(!vis[b])//如果b不在队列里面的话
                {
                    q.push(b);
                    vis[b] = true;
                }
            }
        }
    }
    
    if(d[n] == 0x3f3f3f3f) puts("impossible");
    else printf("%d",d[n]);
    
    return 0;
}</code></pre>
<!-- /wp:code -->



<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":1} -->
<h1>SPFA判断负环</h1>
<!-- /wp:heading -->

<!-- wp:heading {"level":1} -->
<h1>题目</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":133,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/7-1024x490.png" alt="" class="wp-image-133"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->
<h1>输入输出</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":134,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/8-1024x312.png" alt="" class="wp-image-134"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->
<h1>分析思路</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>在SPFA算法中dist[x]表示从起点s到x的最短距离<br>那么我们可以用一个cnt[N]数组来存放，表示边数</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>dist[x] = dist[t] + w[i]
cnt[x] = cnt[t] + 1
1----------t——x
|             |
---------------</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>因为上面表示从1到t再到x的路径比下面的要短<br>那么从1到t再到x的边数就是从1到t的边数再+1<br>即cnt[x] = cnt[t] + 1<br>此时如果cnt[x]>=n的话，意味着从1到x至少经过了n条边，经过了n条边如果没有环的话就意味着有n+1个点，但是我们题目只有n个点，说明最短路径中存在环，这个环一定是负权的，因为如果是正权的，那经过这个环路径会变大，那我肯定不会经过这个环<br>所以SPFA算法可以用来判断是否有负环</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>注意点</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>1.有负环的话相当于某些点到起点的距离为负无穷，然后SPFA算法是正确的，且初始时这些点的距离为0,0大于负无穷，所以一定会把这些距离为负无穷的点不断更新，所以不需要把d数组赋值为正无穷</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1} -->
<h1>代码如下</h1>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include <cstdio>
#include <queue>
#include <cstring>
using namespace std;

const int N = 100010;

int h[N],e[N],ne[N],d[N],w[N],idx,cnt[N];
bool vis[N];//vis[i]是判断是否存入过队列中
int n,m;


void add(int a,int b,int c)
{
    e[idx] = b;
    w[idx] = c;
    ne[idx] = h[a];
    h[a] = idx++;
}

int spfa()
{
    queue<int>q;
    for(int i = 1;i <= n;i++)
    {
        vis[i] = true;
        q.push(i);
    }
    while(!q.empty())
    {
        int t = q.front();
        q.pop();
        vis[t] = false;
        for(int i = h[t];i != -1;i = ne[i])
        {
            int j = e[i];
            if(d[j] > d[t] + w[i])
            {
                d[j] = d[t] + w[i];
                cnt[j] = cnt[t] + 1;
                if(cnt[j] >= n) return 1;
                if(!vis[j])
                {
                   q.push(j);
                   vis[j] = true;
                }
            }
        }
    }
    return 0;
}

int main()
{
    scanf("%d %d",&n,&m);
    memset(h,-1,sizeof h);
    //memset(d,0x3f,sizeof d);
    while(m--)
    {
        int a,b,c;
        scanf("%d%d%d",&a,&b,&c);
        add(a,b,c);
    }

    int t = spfa();
    if(t) puts("Yes");
    else puts("No");


    return 0;
}</code></pre>
<!-- /wp:code -->
