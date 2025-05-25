---
title: AcWing 1107. 魔板
excerpt: '' 
author: Sakura
publishDate: '2021-08-25'
coverImage: 'http://106.14.114.97/wp-content/uploads/2021/08/90173710_p0_master1200-721x1024.jpg' 
slug: 'AcWing-1107'
date: 2025-05-25 17:04:00
tags:
  - BFS
category:
  - AcWings
  - 算法题
---

<!-- wp:image {"id":96,"width":1045,"height":581,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-6-1024x570.png" alt="" class="wp-image-96" width="1045" height="581"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":100,"width":1093,"height":864,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-7-1024x810.png" alt="" class="wp-image-100" width="1093" height="864"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><li>分析<ul><li>根据样例我们可以得知这题的原理就是从最初的状态12345678变到终点状态比如样例中的26845731</li><li>然后求从初始状态到最终状态的步数（也就是花费）最少的方案</li><li>然后每次有三种可以变换的操作</li><li>其实每一个操作就相当于从一个结点状态变到另一种结点状态，然后两个结点的距离为1</li><li>所以这道题其实就相当于一道从起点到终点求最短距离，但是还需要记录最短距离上的点</li></ul></li><li>注意点<ul><li>因为这题是用字符串输入的，我们直接把每个状态用string来进行存放比较妥当</li><li>每个状态开始就进行三次探索，然后定义一个哈希表存放已经走过的状态</li><li>最后根据end回溯一步一步的操作</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include &lt;iostream>
#include &lt;unordered_map>
#include &lt;cstring>
#include &lt;string>
#include &lt;algorithm>
#include &lt;queue>

using namespace std;

#define x first
#define y second

char g&#91;2]&#91;4];//定义一个2行4列的数组，方便我们操作对应的ABC三种操作
unordered_map&lt;string,int>dist;//存放每个状态对应的步数
unordered_map&lt;string,pair&lt;char,string>>pre;//记录当前状态对应前面一个状态是什么，是什么操作转移来的
//pre&#91;S].x表示S状态对应之前是由操作A/B/C转移来的，pre&#91;S].y表示表示S状态对应的之前状态
queue&lt;string>q;
string Start = "12345678",End = "";

void set(string t)//把字符串变成字符数组
{
    for(int i = 0;i &lt; 4;i++) g&#91;0]&#91;i] = t&#91;i];
    for(int i = 3;i >= 0;i--) g&#91;1]&#91;i] = t&#91;7-i];
}
string recover()//把字符数组变成字符串
{
    string res = "";
    for(int i = 0;i &lt; 4;i++)  res += g&#91;0]&#91;i];
    for(int i = 3;i >= 0;i--) res += g&#91;1]&#91;i];
    return res;
}

string moveA(string t)//A：交换上下两行
{
    set(t);
    for(int i = 0;i &lt; 4;i++) swap(g&#91;0]&#91;i],g&#91;1]&#91;i]);
    
    return recover();
}

string moveB(string t)//B：将最右边的一列插入到最左边
{
    set(t);
    char a = g&#91;0]&#91;3],b = g&#91;1]&#91;3];//先记录最右边的一列
    //将前面三列向右平移
    for(int i = 3;i >= 1;i--)
    {
        g&#91;0]&#91;i] = g&#91;0]&#91;i-1];
        g&#91;1]&#91;i] = g&#91;1]&#91;i-1];
    }
    g&#91;0]&#91;0] = a,g&#91;1]&#91;0] = b;//然后再将记录好的插回第一列
    
    return recover();
}

string moveC(string t)//C：魔板中央对的4个数作顺时针旋转
{
    set(t);
    char w = g&#91;0]&#91;1];//首先记录左上角的那个数
    //然后再依次旋转剩下的三个数
    g&#91;0]&#91;1] = g&#91;1]&#91;1];
    g&#91;1]&#91;1] = g&#91;1]&#91;2];
    g&#91;1]&#91;2] = g&#91;0]&#91;2];
    g&#91;0]&#91;2] = w;
    return recover();
}

void bfs(string Start,string End)
{
    if(Start == End) return ;
    q.push(Start);//把初始状态插入队头
    
    while(q.size())
    {
        string tmp = q.front();
        q.pop();
        //对应三种状态
        string m&#91;3];
        m&#91;0] = moveA(tmp);//A操作
        m&#91;1] = moveB(tmp);//B操作
        m&#91;2] = moveC(tmp);//C操作
        for(int i = 0;i &lt; 3;i++)
        {
            string mt = m&#91;i];
            if(dist.count(mt) == 0)//如果没有走过的话
            {
                pre&#91;mt] = {'A'+i,tmp};//记录状态
                dist&#91;mt] = dist&#91;tmp] + 1;//mt是由tmp这个状态走过来的，步数+1
                if(mt == End) break;
                q.push(mt);
            }
        }
    }
}

int main()
{
    char t;
    while(cin>>t)
    {
        End += t;
    }
    
    bfs(Start,End);

    //输出最短操作序列的长度
    cout&lt;&lt;dist&#91;End]&lt;&lt;endl;
    //如果操作序列的长度大于0，则在第二行输出字典序最小的操作序列
    if(dist&#91;End])
    {
        string res = "",t = End;//最终结果
        //从End开始回头找前面的状态
        while(pre&#91;t].y != Start)
        {
            res += pre&#91;t].x;
            t = pre&#91;t].y;
        }
        //再加上最后一步到初始初始状态
        res += pre&#91;t].x;
        //因为是从后往前找的状态，所以最后还要颠倒过来
        reverse(res.begin(),res.end());
        cout&lt;&lt;res;
        
    }
    return 0;
}</code></pre>
<!-- /wp:code -->