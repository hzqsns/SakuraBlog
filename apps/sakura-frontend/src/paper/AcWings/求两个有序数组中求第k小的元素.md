---
title: 求两个有序数组中求第k小的元素
excerpt: ''
author: Sakura
publishDate: '2024-04-07'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/123888367_p0_master1200.jpg'
slug: 'AcWing-kth-element'
date: 2024-04-07 21:57:00
tags:
    - 二分
category:
    - 算法题
---

### 要求：时间复杂度达到 O(logn)

如果考虑两个有序数组中求第 k 小的元素，最开始的直觉把这两个数组合并一起然后排序求中位数，但是时间复杂度为 O(nlogn)所以不行。

于是我想到了既然是两个都是有序数组，那么直接让两个数组开始分别由两个指针来比较大小，然后记录移动的次数，如果移动了 K-1 次，那么此时如果整体为技术再比较当前指针的大小取中位数，如果整体为偶数则取当前两个指针的平均值即可，但是显而易见这样的时间复杂度会达到 O(n)，还是不满足时间复杂度的要求。

于是我们从刚才双指针的算法来获取灵感，O(n)级别的算法是从头开始一个一个进行比较，但是这样比较太慢了，因为两个数组都是有序数组，我们不妨这么来想，如果 k 比较大的话，那么两个数组前面的数是不是根本就不需要进行比较？因为两个数组前面的数的个数加起来都不可能到 k，所以是不是应该考虑一种方式能够快速的把前面没有用的数删掉了然后再去找剩下两个数组的中位数比较好呢？

因为是两个数组，我们自然的想到应该先比较两个数组前面 k/2 个数，准确的说是比较两个数组第 k/2 个数，如果 A 的第 k/2 个数小于 B 的第 k/2 个数，说明 A 的前 k/2 个数都可以被舍弃掉，这里面的数不可能会成为中位数。舍弃掉 A 的前 k/2 个数之后，我们要从 A 的剩下的数以及 B 数组中找 k -(k/2)个数即找剩下数组中第 k/2 小的数，因此第 k 个数是所有数从头到尾排序第 k 个数，我们把前面较小的 k/2 个数删掉之后，剩余数组中第 k -(k/2)=k/2 个数就是先前数组中的第 k 小个数。于是我们依次类推再找新的数组 A'和 B 中找第 k/2 小的元素，...，一直找到数组 A\*和 B\*第 1 小的元素，即比较 A\*和 B\*最开头元素哪个最小即哪个就为原数组 A 和 B 中第 k 小的元素。

为了方便比较，我们不妨设置 A 为较短的那个数组，B 为较长的那个数组，如果这样一直递归缩减到 B 比 A 小了，那么让 A 和 B 交换位置即可，我们不妨设 nums1 数组大小为 m，nums2 数组大小为 n，getKthSmallest(nums1,i,nums2,j,k)的含义为从 nums1[i\~m-1]以及 nums2[j\~n-1]中找到第 k 大的数:

1. 首先考虑边界情况，如果 nums1 为空的话，说明 A 数组全部都舍弃掉了，那么此时 B 数组中对应的 nums2[j+k-1]即为要找的数；如果 nums1 不为空，但是数组的长度已经小于 k/2,那么此时我们就把所有的数拿出来和 B 的第 k/2 个数进行比较即可；最后如果 k==1，比较两个数组第一位数的大小即可。
2. 我们首先找到对应比较的元素，nums1 数组对应元素为 si = min(i+k/2,m-1)，nums2 对应元素为 sj = j+k/2，我们比较 nums1[si-1]和 nums2[sj-1]的大小，如果 nums1[si-1] < nums2[sj-1]，直接 return getKthSmallest(nums1,si,nums2,j,k-(si-i));否则 nums1[si-1] >= nums2[sj-1]，return getKthSmallest(nums1,i,nums2,sj,k-k/2)

代码如下：

```cpp
class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        int m = nums1.size(),n = nums2.size(),sum = m + n;
        int k = (m + n) / 2;
        if(sum % 2 == 0)
        {
            int left = getKthSmallest(nums1,0,nums2,0,sum / 2);
            int right = getKthSmallest(nums1,0,nums2,0,sum / 2 + 1);
            return (left + right) / 2.0;
        }else
            return getKthSmallest(nums1,0,nums2,0,sum / 2 + 1);

    }
     double getKthSmallest(vector<int>& nums1, int i, vector<int>& nums2, int j, int k){
            if(nums1.size() - i > nums2.size() - j) return getKthSmallest(nums2,j,nums1,i,k);

            if(nums1.size() == i) return nums2[j + k - 1];
            if(k == 1) return min(nums1[i],nums2[j]);
            int si = min((int)nums1.size(), i + k / 2),sj = j + k / 2;
            if(nums1[si - 1] >= nums2[sj - 1]) return getKthSmallest(nums1,i,nums2,sj,k - k / 2);
            else return getKthSmallest(nums1,si,nums2,j,k-(si-i));
        }


};
```
