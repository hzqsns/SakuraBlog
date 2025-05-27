---
title: AcWing 1295.X的因子链
excerpt: '' 
author: Sakura
publishDate: '2024-03-11'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/126536515_p0_master1200.jpg' 
slug: 'AcWing-1295'
date: 2024-03-11 21:49:00
tags:
  - 数学
category:
  - 算法题
  - AcWings
---

# 题目

[![](http://www.hzqsns.com/wp-content/uploads/2023/06/wp_editor_md_06978bcd2e33f768c7bbd91a78b302e5.jpg)](http://www.hzqsns.com/wp-content/uploads/2023/06/wp_editor_md_06978bcd2e33f768c7bbd91a78b302e5.jpg)


# 输入输出
[![](http://www.hzqsns.com/wp-content/uploads/2023/06/wp_editor_md_7fadef999e8a4efda82d1a8a50ed6e6a.jpg)](http://www.hzqsns.com/wp-content/uploads/2023/06/wp_editor_md_7fadef999e8a4efda82d1a8a50ed6e6a.jpg)


# 分析

分析题意
[![](http://www.hzqsns.com/wp-content/uploads/2023/06/wp_editor_md_bd000991673a611f240df13dd2f6b878.jpg)](http://www.hzqsns.com/wp-content/uploads/2023/06/wp_editor_md_bd000991673a611f240df13dd2f6b878.jpg)

## 1.最大长度

如果想让X的因子组成的因子链最长，那么它的因子链一定得是质数才行，不然如果是合数的话就可以拆分成两个以上的和从而使它的长度增加

所以问最大长度就是问对X分解质因数后质因数的总和

## 2.最大长度序列

对于X = 540 = 2^2 \* 3^3 \* 5来说
序列的最大长度就是2 + 3 + 1 = 6
最长长度就为
  2    4    12   36   108   540
x2  x2   x3   x3    x3      x5
或者
  2    6     12    36     108     540 
x2  x2   x2    x3     x3        x5
.......
等等

那么因为所有的2和所有的3都可以互换位置，那么我们就要去掉2和3他们可以互换位置的情况，即除以2!\*3!从而只剩一种情况

最大长度的子序列个数就为(2+3+1)!/(2!\*3!\*1!) = 720/(2\*6\*1) = 60

## 3.分解质因数

A.我们可以用线性筛的方法来分解质因数,st[N]数组表示有没有被筛的意思，如果没有被筛，表明当前这个数是质数，然后用这个数去筛掉其他合数

因为每个数只会被筛一次，所以时间复杂度为O(n)

B.我们在筛质数的图中可以开一个minp数组，来记录对应的数X的最小质因数是谁

这样子可以方便我们对X分解质因数

X最小的质因数为p = minp[X],然后min[X / p]是另一个质因数，依次类推可以得到X的所有质因数

比如540 = 2^2\*3^3\*5

```cpp
void get_primes(int x)
{
    for(int i = 2;i <= x;i++)
    {
        if(!st[i])
        {
            minp[i] = i;
            primes[cnt++] = i;
        }
        for(int j = 0;i*primes[j] <= x;j++)
        {
            int t = i*primes[j];
            minp[t] = primes[j];
            st[t] = true;
            if(i % primes[j] == 0) break;
        }
    }
}
```


---------------------

# 代码如下

```cpp
#include <iostream>

using namespace std;


/*

对于X = 540 = 2^2 * 3^3 * 5来说
序列的最大长度就是2 + 3 + 1 = 6
最长长度就为
  2  4   12  36  108  540
x2 x2  x3  x3  x3   x5
或者
  2  6   12  36  108  540 
x2 x2  x2  x3  x3   x5
等等
那么因为所有的2和所有的3都可以互换位置，那么我们就要去掉2和3他们可以互换位置的情况，即除以2!*3!只剩一种情况

最大长度的子序列个数就为(2+3+1)!/(2!*3!*1!) = 720/(2*6*1) = 60

*/
typedef long long LL;

const int N = (1 << 20) + 10;
int primes[N],minp[N],X;
bool st[N];
int cnt = 0;
void get_primes(int x)
{
    for(int i = 2;i <= x;i++)
    {
        if(!st[i])
        {
            minp[i] = i;
            primes[cnt++] = i;
        }
        for(int j = 0;i*primes[j] <= x;j++)
        {
            int t = i*primes[j];
            minp[t] = primes[j];
            st[t] = true;
            if(i % primes[j] == 0) break;
        }
    }
}
int main()
{
    get_primes(N-1);
    while(scanf("%d",&X) != -1)
    {
        int k = 0,tot = 0;
        int count[N];
        while(X > 1)
        {
            int t = minp[X];
            fac[k] = t,count[k] = 0;
            while(X % t == 0)
            {
                count[k]++;
                X /= t;
                tot++;
            }
            k++;
        }
        LL res = 1;
        for(int i = 1;i <= tot;i++) res *= i;
        for(int i = 0;i < k;i++)
        {
            for(int j = 1;j <= count[i];j++)
            {
                res /= j;
            }
        }
        printf("%d %d\n",tot,res);
    }
    return 0;
}
```
