---
title: AcWing 1064. 小国王
excerpt: '' 
author: Sakura
publishDate: '2021-10-31'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/0000.jpg.jpeg' 
slug: 'AcWing-1064'
date: 2021-10-31 17:35:00
tags:
  - 状态压缩
category:
  - 算法题
  - AcWings
---
<!-- wp:heading {"level":1} -->

<h1>题目及输入输出</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":168,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/image-1024x559.png" alt="" class="wp-image-168"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->

<h1><span class="has-inline-color has-vivid-red-color">分析</span></h1>
<!-- /wp:heading -->

<!-- wp:image {"id":169,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/2-1-1024x458.png" alt="" class="wp-image-169"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->

<p>由题目的分析可知，每一行状态只跟上一行的状态有关<br>于是</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->

<ol><li>我们可以从第i行开始枚举有效的状态</li><li>再枚举第i行能转移到第i+1行的状态</li><li>最后把第n行所有有效状态的数量加起来即可</li></ol>
<!-- /wp:list -->

<!-- wp:heading {"level":1} -->

<h1>闫氏dp分析法</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":170,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/3-1-1024x626.png" alt="" class="wp-image-170"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->

<h1>注意点</h1>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->

<ol><li>需要预先处理出来有效的状态<br>有效的状态需要满足：状态里面不能有连续的1<br>我们可以提前枚举出来有效的状态然后记录到一个vector中</li><li>我们需要预先存储一个有效的状态能够转移到那些状态中去<br>如果状态a能够转移到状态b，那么需要满足<br>(1)a & b == 0，即a和b的二进制表示的相同的位数不能同时有1<br>(2)check(a | b)是否为true，即a和b的并集同样不能存在连续的1，如果存在连续的1说明国王的周围部分包括下一层的国王，这样的状态也是不成立的</li><li>最后的结果会爆int，需要用long long来存储最后的结果</li><li>需要预先写出一个check函数来判断状态是否有连续的1，用一个count函数来计算状态里面有多少个1</li></ol>
<!-- /wp:list -->

<!-- wp:separator -->

<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":1} -->

<h1>代码如下</h1>
<!-- /wp:heading -->

<!-- wp:code -->

<pre class="wp-block-code"><code>#include <iostream>
#include <algorithm>
#include <vector>
using namespace std;

typedef long long LL;
const int N = 12,M = 1 << 10,W = 110;

LL f[N][W][M];//f[i][j][k]表示前i行，放置了j个国王，且第i行状态为k的方案数
vector<int> head[M];//存放第i个状态能转移到的合法状态
vector<int> state;//存放合法状态
int n,m;
int cnt[M];

bool check(int state)//检查第i行的状态有没有连续的1
{
    for (int i = 0; i < n; i ++ )
        if ((state >> i & 1) && (state >> i + 1 & 1))
            return false;
    return true;
}

int count(int state)//统计每个状态的棋子数
{
    int res = 0;
    for (int i = 0; i < n; i ++ ) res += state >> i & 1;
    return res;
}
int main()
{
    scanf("%d %d",&n,&m);
    for (int i = 0; i < 1 << n; i ++ )
        if (check(i))
        {
            state.push_back(i);
            cnt[i] = count(i);//把每个状态所包含的个数存放到数组中
        }

    for(int i = 0;i < state.size();i++)//遍历每个状态，看能转移到哪些合法的状态a->b
    {
        for(int j = 0;j < state.size();j++)
        {
            int x = state[i],y = state[j];
            if( (x & y) == 0 && check(x | y))
            {
                head[i].push_back(j);
            }
        }
    }
    f[0][0][0] = 1;
    for(int i = 1;i <= n;i++)
    {
        for(int j = 0;j <= m;j++)
        {
            for(int k = 0;k < state.size();k++)
            {
                int c = cnt[state[k]];//每个状态所包含的个数
                int a = state[k];
                for(int b : head[k])//遍历每个状态所能到达的各种合法状态
                {
                    if(c <= j)
                    {
                        f[i][j][a] += f[i-1][j-c][state[b]];
                    }
                }
            }
        }
    }
    LL res = 0;
    for(int i = 0;i < 1 << n;i++) res +=f[n][m][i];
    cout<<res;
    //或者是把i <= n 改成 i <= n+1这样最后一行的下一行的状态全为0
    //对应f[n+1][m][0]就是所有的方案数

    return 0;

}</code></pre>

<!-- /wp:code -->
