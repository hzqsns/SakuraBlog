---
title: AcWing.122 糖果传递
excerpt: 'AcWing.122 糖果传递'
author: 'Sakura'
publishDate: '2024-07-30'
coverImage: 'https://picsum.photos/800/600?random=2'
date: 2024-07-30 15:30:00
tags:
    - 数学
category:
    - 算法题
    - AcWings
---

# 题目

![](http://www.hzqsns.com/wp-content/uploads/2024/06/2.png)

# 输入输出格式

![](http://www.hzqsns.com/wp-content/uploads/2024/06/3.png)

# 分析思路

n个小朋友围成一个环，然后每个人只能给左右两个人传递糖果
且传递x个糖果消耗的代价为x

第一直觉肯定是糖果多的人怎么传给糖果少的人
一时半会看不出来用什么方法可以解决问题，我们于是可以先建立一个数学模型

## 建立数学模型

我们可以设n个小朋友现在手里的糖果数分别为A1,A2,A3 ... ,An-1,An
我们约定，从An传递到An-1为Xn个糖果数

其中,Xn为正表示糖果从An传递到An-1

反之如果为负，则表示从An-1传递到An
![](http://www.hzqsns.com/wp-content/uploads/2024/06/Snipaste_2024-06-04_20-31-02.png)

则依题意可知我们最终要求的就是|X1| + |X2| + |X3| + ... + |Xn|的最小值

## 做题思路

![](http://www.hzqsns.com/wp-content/uploads/2024/06/20200319164021-scaled.jpg)
然后转化成求一个点到各个C[i]的距离之和最小，就是排序之后的C[i]数组的中点到各个C[i]点之差的和即为最小的距离之和

## 代码如下

```C++
#include <iostream>
#include <cstdio>
#include <cmath>
#include <algorithm>

using namespace std;
const int N = 1000000 +10;
typedef long long LL;
int A[N],C[N],S[N];//A[i]记录原数据,S[i]为A[i]的前缀和数组
LL n,sum = 0,avg,res;

int main()
{
    scanf("%lld",&n);
    for(int i = 1;i <= n;i++)
    {
        scanf("%d",&A[i]);
        sum += A[i];
        S[i] = S[i-1]+A[i];
    }
    avg = sum / n;
    for(int i = 1;i <= n;i++)
    {
        C[i] = S[i-1]-avg*(i-1);
    }
    sort(C+1,C+1+n);
    for(int i = 1;i <= n;i++)
    {
        res += abs(C[n/2]-C[i]);
    }
    cout<<res;
  
    return 0;
}

```

## 注意点

1.数列最好从1开始方便计算
2.当数列从1开始的时候，中间点即为(n+1)/2，需要+1
3.数据可能爆int，所以要用long long 长整形表示结果

# 总结

这题是AcWing 104. 货仓选址的一个进阶题目，或者说是区间选点加了一个套子
难点在于我们在考试的时候如果遇到这种题很难静下心来去分析出题目的数学模型并进行进一步的整理

---

# 代码如下：

```C++
#include <iostream>
#include <cstdio>
#include <cmath>
#include <algorithm>

using namespace std;
const int N = 1000000 +10;
typedef long long LL;
int A[N],C[N],S[N];//A[i]记录原数据
LL n,sum = 0,avg;

int main()
{
    cin>>n;
    for(int i = 1;i <= n;i++)
    {
        scanf("%d",&A[i]);//数据范围较大最好用scanf进行输入
        sum += A[i];//计算所有糖果的和
    }
    avg  = sum / n;//计算糖果的平均值
    int k = 1;
    C[k] = avg - A[n];//初始化，C[1] = Ā - An
    for(int i = n;i > 1;i--)
    {
        C[k+1] = C[k] + avg - A[i-1];//根据Cn - Cn-1 = Ā - An-1递推关系来算出所有C[i]的值
        k++;
    }
    C[n] = 0;
    sort(C+1,C+n+1);//对各个点到原点的距离进行排序
    LL res = 0;
    for(int i = 1;i <= n;i++)
    {
        res += abs(C[(n+1)/2] - C[i]);//找到中间的那个点再计算到其他个点的距离之和
    }
    cout<<res;//因为数据保证一定有解，所以我们直接输出res
    return 0;
}
```
