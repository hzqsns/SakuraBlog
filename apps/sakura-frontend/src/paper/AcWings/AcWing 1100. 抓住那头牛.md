---
title: AcWing 1100. 抓住那头牛
excerpt: 'BFS相关的题解' 
author: Sakura
publishDate: '2021-08-15'
coverImage: 'http://106.14.114.97/wp-content/uploads/2021/08/87454964_p0_master1200-682x1024.jpg' 
slug: 'acwings-1100'
date: 2021-08-15 16:54:00
tags:
  - BFS
category:
  - 算法题
  - AcWings
---
<!-- wp:list -->

<ul><li>题目&输入输出</li></ul>
<!-- /wp:list -->

<!-- wp:image {"id":89,"width":997,"height":693,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-2-1024x712.png" alt="" class="wp-image-89" width="997" height="693"/></figure>
<!-- /wp:image -->

<!-- wp:list -->

<ul><li>不管是从X前后移动一格还是直接移动到2*X，所花费的时间（就是步数）都是1</li><li>那么就相当于一个结点到另一个结点的距离都是1</li><li>我们已知所有边长都相等的无向图进行一次BFS就能得到最短路</li></ul>
<!-- /wp:list -->

<!-- wp:code -->

<pre class="wp-block-code"><code>#include <iostream>
#include <cstring>

using namespace std;

/**
 * 本题的原理就是从起点到终点，之间所有的点的距离相等，即所有边(费用)都相等的一个图
 * 而我们可以知道，所有边长都相等的无向图进行一个BFS就能得到最短路
 */ 

const int N = 2e5+10;//因为最大范围为1e5，那么最右边的范围为2e5，再往右边走就没意义了
int n,k;
int dist[N];//从起点跳到i所需要的步数
int q[N],hh = 0,tt = -1;//定义队列，队头和队尾

int main()
{
    scanf("%d %d",&n,&k);
    memset(dist,-1,sizeof dist);
    dist[n] = 0;//初始化起点
    q[++tt] = n;//将起点插入队列
    while(hh <= tt)
    {
        int t = q[hh++];//取出队头元素
    
        if(t+1 < N && dist[t+1] == -1)//如果向右走一步没超过最右边的范围N，且尚未经过
        {
            dist[t+1] = dist[t]+1;
            q[++tt] = t+1;
        }
        if(t-1 >= 0 && dist[t-1] == -1)//如果向左走一步没超过最左边的范围0，且尚未经过
        {
            dist[t-1] = dist[t]+1;
            q[++tt] = t-1;
        }
        if(t*2 < N && dist[t*2] == -1)//如果向右走两倍没超过最右边的范围N，且尚未经过
        {
            dist[t*2] = dist[t]+1;
            q[++tt] = t*2;
        }
    }
  
    cout<<dist[k];
    return 0;
}</code></pre>

code

code

code
