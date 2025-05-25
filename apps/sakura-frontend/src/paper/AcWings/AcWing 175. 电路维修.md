---
title: AcWing 175. 电路维修
excerpt: ''
author: Sakura
publishDate: '2021-08-26'
coverImage: 'http://106.14.114.97/wp-content/uploads/2021/08/gaou05_3-724x1024.jpg' 
slug: 'AcWing-175'
date: 2021-08-26 17:14:00
tags:
  - dijkstra
category:
  - 算法题
  - AcWings
---


<!-- wp:image {"id":103,"width":1079,"height":851,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-8-1024x808.png" alt="" class="wp-image-103" width="1079" height="851"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":104,"width":1058,"height":843,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-9-1024x816.png" alt="" class="wp-image-104" width="1058" height="843"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":105,"width":1048,"height":634,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-10-1024x620.png" alt="" class="wp-image-105" width="1048" height="634"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><li>分析<ul><li>这道题本质上就是一道边权为0和1求最短路的问题，对于我来说实在是有点想不上来</li><li>是因为我很难联想到把元件旋转联通代表格子的边权为1，不用旋转的格子为0</li><li>所以我们在经过的时候需要判断我们斜着经过的时候是否需要旋转元件</li><li>---------------------------------------------------------------------------</li><li>积累经验：在解决边权为0和1的最短路问题，我们会用双端队列+BFS来对问题进行求解</li><li>从队头弹出来的点，如果拓展的边权为0，就插入队头，拓展的边权为1，就插入队尾</li><li>这样其实还是形成了dijkstra算法中的那个优先队列，队列里面一定是队头小，队尾大</li></ul></li><li>注意1<ul><li>这道题有个隐藏的性质</li><li><strong>因为我们是从斜边走的点，那么横纵坐标会同时发生变化</strong></li><li><strong>那么意味着横纵坐标之和为奇数的点不可能走到</strong></li><li><strong>因为想要这么做必须横纵坐标只能由一个变化</strong></li><li>所以我们在输入终点的时候就可以判断其横纵坐标是否为奇数，如果为奇数，不管怎么变化电路方向都到不了</li></ul></li><li>注意2<ul><li>int dx[4] = {-1,-1,1,1},dy[4] = {-1,1,1,-1};</li><li>//因为从中间那个点开始只能向4个斜着的方向走,顺序依次为左上、右上、右下、左下</li></ul><ul><li>----------------------------------------------------------------------------------------------------------------</li><li>int ix[4] = {-1,-1,0,0},iy[4] = {-1,0,0,-1};</li><li>//左上、右上、右下、左下对应的元件形状为\/\/，所以我们需要判断经过四个斜边走的元件的形状是否对应</li><li>//比如从中间的点往左上走，这个时候就得判断左上的那个元件形状是不是 \</li><li>//如果是，就代表走过的距离为0(也可以理解为费用)，如果不是，就需要翻转，就相当于距离(费用)为1</li><li>//这个时候，我们需要一个中间的点的坐标和它周围4个格子坐标的一个关系</li><li>//从中间的点坐标变为元件的坐标，然后判断要走的方向和对应的电路是否一致</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include &lt;iostream>
#include &lt;cstring>
#include &lt;deque>

using namespace std;
/**
 * 这道题本质上就是一道边权为0和1求最短路的问题，对于我来说实在是有点想不上来
 * 是因为我很难联想到把元件旋转联通代表格子的边权为1，不用旋转的格子为0
 * 所以我们在经过的时候需要判断我们斜着经过的时候是否需要旋转元件
 * ---------------------------------------------------------------------------
 * 积累经验：在解决边权为0和1的最短路问题，我们会用双端队列+BFS来对问题进行求解
 * 从队头弹出来的点，如果拓展的边权为0，就插入队头，拓展的边权为1，就插入队尾
 * 这样其实还是形成了dijkstra算法中的那个优先队列，队列里面一定是队头小，队尾大
 */
#define x first 
#define y second

typedef pair&lt;int,int>PII;
const int N = 510;
int R,C;//R行C列
bool st&#91;N]&#91;N];//定义一个判重数组，避免一个点更新其他点多次
char g&#91;N]&#91;N];//存储电路模型
int dist&#91;N]&#91;N];//定义一个最短路数组，表示从(0,0)到(i,j)的最短路
//因为从中间那个点开始只能向4个斜着的方向走,顺序依次为左上、右上、右下、左下
int dx&#91;4] = {-1,-1,1,1},dy&#91;4] = {-1,1,1,-1};
//左上、右上、右下、左下对应的元件形状为\/\/，所以我们需要判断经过四个斜边走的元件的形状是否对应
//比如从中间的点往左上走，这个时候就得判断左上的那个元件形状是不是
//如果是，就代表走过的距离为0(也可以理解为费用)，如果不是，就需要翻转，就相当于距离(费用)为1
//这个时候，我们需要一个中间的点的坐标和它周围4个格子坐标的一个关系
//从中间的点坐标变为元件的坐标
int ix&#91;4] = {-1,-1,0,0},iy&#91;4] = {-1,0,0,-1};

int main()
{
    int T;//T组数据
    scanf("%d",&amp;T);
    while(T--)
    {
        scanf("%d %d",&amp;R,&amp;C);
        for(int i = 0;i &lt; R;i++) scanf("%s",g&#91;i]);

        if(R + C &amp; 1)
        {
            printf("NO SOLUTION\n");
            //这里有个特殊的性质很难发现
            //因为我们是从斜边走的点，那么横纵坐标会同时发生变化
            //那么意味着横纵坐标之和为奇数的点不可能走到
            //因为想要这么做必须横纵坐标只能由一个变化
        }
        else
        {
            memset(dist,0x3f,sizeof dist);//把起点到其他所有点的距离都设置为正无穷
            memset(st,0,sizeof st);//所以点都设置为没经过
            dist&#91;0]&#91;0] = 0;
            
            deque&lt;PII> q;//定义一个双端队列
            q.push_back({0,0});
            char cs&#91;8] = "\\/\\/";
            //定义一个元件数组，看一个点需要经过的元件是否需要旋转
            //这个元件数组的顺序也是左上、右上、右下、左下
            while(q.size())
            {
                PII t = q.front();
                q.pop_front();
                if(t.x == R &amp;&amp; t.y == C) break;
                /*
                在dijkstra算法中，某些点可能会被多次扩展，
                但第一次从优先队列中弹出的节点的距离一定就是最小值了，
                所以需要在出队的时候来判重。
                */
                if(st&#91;t.x]&#91;t.y]) continue;
                st&#91;t.x]&#91;t.y] = 1;
                for(int i = 0;i &lt; 4;i++)
                {
                    int a = t.x + dx&#91;i],b = t.y + dy&#91;i];//通过斜边到的新的点
                    //元件最大为R和C，对应角落的点最大就为R+1和C+1
                    if(a &lt; 0 || a > R || b &lt; 0 || b > C) continue;
                    //从t对应的点走到拓展点需要经过的元件坐标 
                    int ia = t.x + ix&#91;i],ib = t.y + iy&#91;i];
                    int w = (g&#91;ia]&#91;ib] == cs&#91;i]) ? 0 : 1;//看对应元件方向与要走的方向是否一致
                    if(dist&#91;t.x]&#91;t.y] + w &lt; dist&#91;a]&#91;b])
                    {
                        dist&#91;a]&#91;b] = dist&#91;t.x]&#91;t.y] + w;
                        if(w) q.push_back({a,b});//如果拓展的边权为1，插入队尾
                        else q.push_front({a,b});//如果拓展的边权为0，插入队头
                    }
                }
            }
            if(dist&#91;R]&#91;C] == 0x3f3f3f3f) printf("NO SOLUTION\n");
            else printf("%d\n",dist&#91;R]&#91;C]);
        }
    }
    return 0;
}</code></pre>
<!-- /wp:code -->
