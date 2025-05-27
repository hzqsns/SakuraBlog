---
title: Leetcode790. 多米诺和托米诺平铺
excerpt: '' 
author: Sakura
publishDate: '2023-10-31'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/127143616_p0_master1200.jpg' 
slug: 'Leetcode-790'
date: 2023-10-31 21:15:00
tags:
  - 状态压缩
  - DP
category:
  - 算法题
  - Leetcode
---

# 题目

[![](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_0281ade132c5c613e2e5c78e1a9802be.jpg)](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_0281ade132c5c613e2e5c78e1a9802be.jpg)

# 输入输出

[![](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_b43a483bb643f52464823999fec7e808.jpg)](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_b43a483bb643f52464823999fec7e808.jpg)

# 分析

* 直接见代码里面的注释

# 代码如下

```cpp
/*
 * @lc app=leetcode.cn id=790 lang=cpp
 *
 * [790] 多米诺和托米诺平铺
 */

// @lc code=start
/**
 * 状态压缩DP，类似的题目Acwing291. 蒙德里安的梦想
 * @brief 定义状态 对于一个竖着的2x1的方格
 * 如果为第i列为00/01/10/11，它可以转移到什么情况使得第i列满呢？
 * 第i列为00，即都为空
     我们可以竖着插一个1x2的多米诺，使得i+1的状态变为00
     也可以插一个L型的多米诺，使得i+1的状态变为10 or 01
     即00 -> 00/01/10/11
 * 第i列为01，即上面一格为空，下面一格有瓷砖
     我们可以横着插一个1x2的多米诺，使得i+1的状态变为10
     也可以插一个L型的多米诺，使得i+1的状态变为11
     即01 -> 10/11
 * 第i列为10，即下面一格为空，上面一格有瓷砖
     我们可以横着插一个1x2的多米诺，使得i+1的状态变为01
     也可以插一个L型的多米诺，使得i+1的状态变为11
     即10 -> 01/11
 * 第i列为11，即两格都有瓷砖
     因为已经是满的了，我们无法再插入任何瓷砖
     即11 -> 00

            00   01   10   11
        -----------------------------
      00|   1    1    1    0
        |
      01|   0    0    1    1
        |
      10|   0    1    0    1
        |
      11|   1    0    0    0
 */
class Solution {
public:
    const int MOD = 1e9+7;
    int numTilings(int n) {
        //f[i][j]的含义表示填满前i-1列且状态为j时的总方案数
        vector<vector<int>> f(n+1,vector<int>(4,0));
        int invert[4][4] = {{1,1,1,1},{0,0,1,1},{0,1,0,1},{1,0,0,0}};
        //我们定义从0到n-1这n个长度填满，初始化相当于第0列前面的都铺满了此时第0列的两格都为空，此时的方案数为1
        f[0][0] = 1;
        for(int i = 0;i < n;i++){
            for(int j = 0;j < 4;j++){
                for(int k = 0;k < 4;k++){
                    //相当于第i+1列的k状态是由第i列的j状态转移过来的
                    f[i+1][k] = (f[i+1][k] + f[i][j]* invert[j][k]) % MOD;
                }
            }
        }

        return f[n][0];
    }
};
// @lc code=end


```