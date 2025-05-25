---
title: LeetCode713.乘积小于 K 的子数组
excerpt: ''
author: Sakura
publishDate: '2022-12-19'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/127225567_p0_master1200.jpg'
slug: 'LeetCode-713'
date: 2022-12-19 19:00:00
tags:
    - 双指针
category:
    - 算法题
    - Leetcode
---

<!-- wp:image {"id":461,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/05/image-7-1024x751.png" alt="" class="wp-image-461"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>分析</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>这里想到用双指针的原因就是，对于区间[j,i]</li><li>i往右走，那么对应的j也一定往右走</li><li>否则i往右走，j往左走的话        </li><li>i走到i'的位置，j如果向左走到j'的位置        </li><li>说明此时[j',i']也满足条件，但如果这个条件成立，一开始我们i找到最左边的j就不是最远的端点了，而是j'        </li><li>所以根据反证法这里产生了矛盾，i往右走，j一定也往右走</li><li>---------------------------------------------------------------------------------------------------</li><li>i是右指针，j是能满足[j,i]这里面的乘积都小于等于k的最左端点        </li><li>那么此时[j,i]、[j+1,i] ... [i-1,i]、[i,i]总共有i-j+1个区间满足要求</li></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>代码如下</h2>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class Solution {
public:
    int numSubarrayProductLessThanK(vector&lt;int&gt;&amp; nums, int k) {
        int res = 0;
        int p = 1;
        for(int i = 0,j = 0;i &lt; nums.size();i++)
        {
            p *= nums&#91;i];
            while(j &lt;= i &amp;&amp; p &gt;= k) p /= nums&#91;j++];

            res += i-j+1;
        }
        return res;
    }
};</code></pre>
<!-- /wp:code -->
