---
title: A*算法(启发式搜索)
excerpt: '' 
author: Sakura
publishDate: '2021-08-31'
coverImage: 'http://106.14.114.97/wp-content/uploads/2021/08/89426402_p0_master1200-1024x724.jpg' 
slug: 'algorithm-A*'
date: 2021-08-31 17:21:00
tags:
  - A*算法
category:
  - 算法理论
---
<!-- wp:paragraph -->

<p>说到最短路径的算法，可能首先想到的就是广度优先搜索(BFS)，固然，BFS可以从起点开始一层一层的拓展，在拓展的过程中记录每一个点是由哪一个点拓展过来的，最后拓展到终点，从终点开始回溯到起点就可以得到最短路径。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>但是这样的搜索过程显然是非常低效的，因为它不知道具体该往哪个方向去走，所以只能四个方向全部都去尝试一遍</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":114,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-13-1024x737.png" alt="" class="wp-image-114"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->

<p>这样带来的结果就是，最坏情况下直到地图上的每一个点都被探索过之后才能得到最短路径</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>为了改进效率，A*算法应运而生</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":116,"width":1028,"height":583,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-15-1024x581.png" alt="" class="wp-image-116" width="1028" height="583"/><figcaption>WIKI上的定义</figcaption></figure>
<!-- /wp:image -->

<!-- wp:list -->

<ul><li>这里我们定义了一个估算函数f(n)<ul><li>其中f(n) = g(n) + h(n)</li><li>g(n)一般称作当前(路程)代价</li><li>比如当前走到的点距离起点的距离</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:image {"id":117,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-16-1024x759.png" alt="" class="wp-image-117"/></figure>
<!-- /wp:image -->

<!-- wp:list -->

<ul><li>对于另一个函数h(n)<ul><li>我们一般称之为预估(路程)代价</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:image {"id":118,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-17-1024x796.png" alt="" class="wp-image-118"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":119,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-18-1024x685.png" alt="" class="wp-image-119"/><figcaption>注：这里应为欧几里得距离</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->

<p>有了这个预估距离，我们从起点开始找的时候就有了相对方向去寻找，而不是无厘头的去寻找</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>我们每一轮都从f(n)最小的点去寻找，这样子相对于BFS能很快找到终点</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":120,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-19-1024x724.png" alt="" class="wp-image-120"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->

<p>来看一个具体样例 - AcWing 179. 八数码 </p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":121,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-20-1024x643.png" alt="" class="wp-image-121"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":122,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-21-1024x793.png" alt="" class="wp-image-122"/></figure>
<!-- /wp:image -->

<!-- wp:list -->

<ul><li>分析<ul><li>我们的目的是从初始状态(比如23415X768)变换到最终状态(12345678X)</li><li>这道题实际上也是一个从初始状态到最终状态求经历的最短步数</li><li>X所对应的格子上下左右交换对应的四个动作就相当于一个点可以有4条分支出来</li><li>------------------------------------------------------------------------------------</li><li>所以如果用A*算法来实现的话，我们要考虑估算函数f(n)的意义</li><li>f(n) = g(n) + h(n)</li><li>g(n)的定义很好想，就把它定义为距离初始状态Start的最短距离</li><li>那么估价函数h(n)呢，因为最后不管什么状态都要变为12345678X的</li><li>那么我们可以把估价函数定义为状态里面具体的数字(比如23415X768里面的数字)对应的每个数字，离最终该到达的曼哈顿距离之和</li><li>如果越接近最终状态，那么这个曼哈顿距离之和肯定越小</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:list -->

<ul><li>注意<ul><li>这里我们要注意到一个性质，就是X在一行之间互相交换的时候不会改变其逆序对的数量</li><li>但是X在一列上互相交换的时候，会改变交换之间两个数的逆序，逆序对可能-2，0，+2三种可能性</li><li>然而我们观察最终状态12345678X，这个逆序对为偶数</li><li>那么显然，如果一开始的初始状态逆序对为奇数，那么必不可能能得到最终的状态</li><li>所以我们可以提前判断初始状态的逆序对数量来判断是否有解</li><li>----------------------------------------------------------------------------------------</li><li>其次就是定义的估算函数f(n)，我们在插入队列的时候，我们往往肯定想取出f(n)最小对应的那个结点</li><li>所以队列需要定义成优先队列，这样每次取队头的点就一定是f(n)最小的那个点</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:image {"id":123,"width":1020,"height":380,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-22-1024x382.png" alt="" class="wp-image-123" width="1020" height="380"/></figure>
<!-- /wp:image -->

<!-- wp:code -->

<pre class="wp-block-code"><code>#include <iostream>
#include <queue>
#include <unordered_map>
#include <algorithm>
#include <cstring>

/**
 * 需要提前知道的一个性质：
 * 如果想要最后序列变为12345678x
 * 那么初始序列的逆序对之和需为偶数，因为12345678x最终序列的逆序对为偶数
 * 而对于本题这个3x3的方格之中，x如果左右移动不会影响到最终序列的逆序对
 * x只会在上下移动的时候影响到逆序对的数量
 * 而上下移动最终只会影响到中间两个数的逆序对状态
 * 那么影响的逆序对的可能性只可能是-2,0,+2
 * 所以我们可以提前通过判断逆序对的数量判断是否存在解决方案
 */ 

using namespace std;

#define x first
#define y second

//定义一个pair，等到插入队列的时候记录(每个状态到初始状态的步数+估计到终点的步数,状态)
typedef pair<int,string> PIS;

int dx[4] = {-1,0,1,0},dy[4] = {0,1,0,-1};//四个方向，上右下左
char op[5] = "urdl";//上up,右right,下down,左left

unordered_map<string,int>dist;//记录每个状态距离初始状态改变的步数
unordered_map<string,pair<char,string>>pre;//记录一下每个状态之前的是由哪个状态的什么操作过来的
string Start,End = "12345678x";

//定义一个小根堆，使得每次弹出来的都是距离初始状态的步数+距离终点的步数最小之和
priority_queue<PIS,vector<PIS>,greater<PIS>> q;

int f(string str)//估计距离就是该点现在的位置，与最后结果应该出现的位置的曼哈顿距离之和
{
    int res = 0;
    for(int i = 0;i < str.size();i++)
       if(str[i] != 'x')
       {
           //因为3x3的网格下标是从1开始的，所以每个数都要减1
           res += abs(i / 3 - (str[i] - '1') / 3) + abs(i % 3 - (str[i] - '1') % 3);
       }
      return res;
}

string Astar(string start)
{
    dist[start] = 0;
    q.push({dist[start] + f(start),start});//插入(初始距离+估计距离,初始状态)
  
    while(q.size())
    {
        PIS t = q.top();//从优先队列的队头弹出元素
        q.pop();
      
        string current = t.y;//提取出要拓展的状态
        if(current == End) 
        {
         
            break;//如果出队的序列为最终的序列
        }
      
        int x,y;//提前定义出来以便待会sx和sy不会报错
        for(int i = 0;i < current.size();i++)//找到x此时的坐标
            if(current[i] == 'x') 
            {
                x = i / 3,y = i % 3;//转换x此时的坐标
                break;
            }
          
        for(int i = 0;i < 4;i++)//判断四个方向
        {
            int sx = x + dx[i],sy = y + dy[i];
            if(sx < 0 || sx >= 3 || sy < 0 || sy >= 3) continue;//越界continue
            string newcurrent = current;//定义一个新的字符串用于交换x的位置
            swap(newcurrent[x*3+y],newcurrent[sx*3+sy]);//如果没有越界就交换值
          
            //时刻记住，我们这里比较的是距离初始状态的步数
            //如果新生成的状态不存在 或者 新的状态已经存在，但是比从current转移过来要大
            if(dist.count(newcurrent) == 0 || dist[newcurrent] > dist[current] + 1)
            {
                dist[newcurrent] = dist[current] + 1;//更新该状态到初始状态的步数
                q.push({dist[newcurrent] + f(newcurrent),newcurrent});//插入优先队列
                pre[newcurrent] = {op[i],current};//记录该状态是由哪个状态的什么操作转移过来的
            }
        }
    }
    //最后结束，从最后的状态倒推到初始状态，记录中间的操作
    string res,tt = End;
    while(tt != Start)
    {
        res += pre[tt].x;
        tt = pre[tt].y;
    }
    reverse(res.begin(),res.end());//因为是从结果倒推的，所以最后还需要逆序一次
    return res;
  
}

int main()
{
    char tmp;
    while(cin>>tmp) Start += tmp;
  
    //提前判断逆序对的数量判断是否有解
    int rev = 0;
    for(int i = 0;i < Start.size();i++)
        for(int j = i+1;j < Start.size();j++)
        if(Start[i] != 'x')
        {
            if(Start[i] > Start[j]) rev++;
        }
  
    if(rev & 1) puts("unsolvable");
    else cout<<Astar(Start)<<endl;

    return 0;
}</code></pre>

<!-- /wp:code -->
