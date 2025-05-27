---
title: Acwings171. 送礼物
excerpt: '' 
author: Sakura
publishDate: '2023-09-16'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/127360493_p0_master1200.jpg' 
slug: 'Acwing-171'
date: 2023-09-16 21:08:00
tags:
  - DP
category:
  - 算法题
  - AcWings
---

# 题目描述

[![](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_0a2cd8245675e56bcbe25afa868ca8f2.jpg)](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_0a2cd8245675e56bcbe25afa868ca8f2.jpg)

# 输入输出

[![](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_85db5d1a615e12244fb77581e17dbee1.jpg)](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_85db5d1a615e12244fb77581e17dbee1.jpg)

# 分析
直接见下面的代码注释

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

/**
 * @brief 思路
 * 相当于一个背包问题，背包的容量为W，然后有N个物品，每个体积(重量)为G[i]，问背包最大能装多少
 * 本来这种背包问题最基本的思想就是dp，但是时间复杂度为O(WN)
 * 这里N最大46，W最大为2^31-1很明显会超时
 * 于是我们便想另外的方法，这里我们可以看到虽然用背包问题的时间复杂度会超时
 * 但是N的大小却很小，才46，于是我们可以用爆搜的思想
 * 如果直接对整个物品进行爆搜，那么时间复杂度为2^46很明显显然也会超时
 * 于是我们这个时候很容易就想到分而治之的思想
 * 我们可以分成左右两边各一半
 * 对于左边，我们可以进行爆搜，左边23个物品每个都有选或者不选两种可能
 * 进行排列组合之后存入数组中，此时时间复杂度为2^23，即8*10^6
 * 对于右边，我们同样进行爆搜，然后在最后搜索完毕的时候进行二分查找
 * 对于右边每次得到的组合A，我们在左边二分查找最大的B使得A+B <= W
 * 然后每得到一次符合条件的组合就比较出最大值ans
 * 最后的时间复杂度为 2^23+ 2^23 * log(2^23) = 2^23 + 2^23 * 23 = 201,326,592
 * 为了平衡这个时间复杂度，我们可以左边的范围稍微大一点比如扩大到25
 * 那么最后的时间复杂度为 2^25 + 2^21 * log(2^25) = 2^25 + 2^21 * 25 = 85,983,232
 * 对比之前的均分明显少一个数量级
 * @return int 
 */

typedef long long LL;

const int N = 50;

int w,n,leftCount;
int G[N];
int leftPresentWeightCombination[1 << 25];//因为左边有25个物品，可以组合的数量为2^25
int ans = 0;
int cnt = 1;//因为所有都不选也算是一种选择，所以默认leftPresentWeightCombination[0] = 0，cnt从1开始

void dfsLeft(int u,int nowWeight){
    if(u >= leftCount){
        // cout<<leftCount<<"++++";
        leftPresentWeightCombination[cnt++] = nowWeight;
        return ;
    }
    //不选第u个物品
    dfsLeft(u+1,nowWeight);
    //不超过w的情况下，选第u个物品
    if((LL)nowWeight + G[u] <= (LL)w) dfsLeft(u+1,nowWeight + G[u]);
}

void dfsRight(int u,int nowWeight){
    if(ans == w) return ; 
    //如果右边也搜索完毕的话
    if(u >= n){
        int l = 0,r = leftCount - 1;
        //找左侧第一个小于等于w - nowWeight的物品
        while(l < r){
            int mid = l + r + 1 >> 1;
            if(leftPresentWeightCombination[mid] <= w - nowWeight) l = mid;
            else r = mid - 1;
        }
        int sumWeight = leftPresentWeightCombination[l] + nowWeight;
        ans = max(ans,sumWeight);
        return ;
    }
    
    //不超过w的情况下，选第u个物品
    if((LL)nowWeight + G[u] <= (LL)w) dfsRight(u+1,nowWeight + G[u]);
    //不选第u个物品
    dfsRight(u+1,nowWeight);
    
}

int main(){
    cin >> w >> n;
    for(int i = 0;i < n;i++){
        cin >> G[i];
    }
    sort(G,G+n);
    reverse(G,G+n);
    leftCount = n / 2;//leftEnd表示左边搜索的范围
    int k = leftCount;
    dfsLeft(0,0);
    // sort(leftPresentWeightCombination,leftPresentWeightCombination + cnt);
    // int t = 1;
    // for (int i = 1; i < cnt; i ++ )
    //     if (leftPresentWeightCombination[i] != leftPresentWeightCombination[i - 1])
    //         leftPresentWeightCombination[t ++ ] = leftPresentWeightCombination[i];
    // leftCount = t;
    sort(leftPresentWeightCombination,leftPresentWeightCombination + cnt);
    leftCount = unique(leftPresentWeightCombination,leftPresentWeightCombination+cnt) - leftPresentWeightCombination;
    
    //此时再遍历右边的范围
    dfsRight(k,0);

    cout << ans <<endl;

    return 0;
}
```
