---
title: Leetcode 31. 下一个排列
excerpt: '' 
author: Sakura
publishDate: '2024-07-26'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/129835175_p0_master1200.jpg' 
slug: 'Leetcode-31'
date: 2024-07-26 22:14:00
tags:
  - 数学
category:
  - 算法题
  - Leetcode
---

## 题目
![](http://www.hzqsns.com/wp-content/uploads/2023/10/Snipaste_2023-10-03_10-43-24.png)

## 代码如下
思路基本上都注释在代码里面了，基本上没见过不太会有思路，mark一下
```cpp
class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        //首先从右往左找到第一个非降序的位置，拿23541举例
        int k = nums.size() - 1;
        while(k && nums[k-1] >= nums[k]) k--;//此时k = 2，对应5的位置
        if(k <= 0){//如果k = 0，说明此时整个序列都是降序的，这个时候对应字典序最大排列，直接翻转即可
            reverse(nums.begin(),nums.end());
        }else{//否则从第一个非降序的位置的右边开始找，拿23541举例子，从3往右边开始找，因为右边确定是降序的了，所以右边找到的第一个就是比3大但大的最小的那个数
            //此时我们找到的第一个升序位置为3和5，对应下标1和2的位置
            int t = k;
            while(t < nums.size() && nums[t] > nums[k-1]) t++;  
            //此时找到的nums[k-1] >= nums[t]，因为后面是降序的，所以nums[k-1] < nums[t-1]，t-1对应的就是比k-1位置最大但是大的最小的那个数
            //这里不能写成 nums[t] >= nums[k-1]，因为比如2 4 5 4 3 1这个序列，我们找到第一个升序关系位置是4和5
            //如果写成大于等于的关系，那么对应t - 1的位置是右边的那个4，此时4和4交换没有解决问题，我们要找的是确定比4大的数来顶替这个位置使得字典序更大

            //还是拿23541举例，此时交换3和4变成24531
            swap(nums[k-1],nums[t-1]);
            //我们已经确定前面24这个顺序了，后面应该变得最小才能满足字典序最小，所以对后面531排序，变成24135
            sort(nums.begin()+k,nums.end());
        }
    }
};
```

