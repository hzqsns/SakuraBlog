---
title: LeetCode287. 寻找重复数
excerpt: '' 
author: Sakura
publishDate: '2022-02-26'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/104810718_p0_master1200.jpg' 
slug: 'LeetCode-287'
date: 2022-02-26 18:11:00
tags:
  - 链表
category:
  - 算法题
  - Leetcode
---

<!-- wp:image {"id":314,"width":684,"height":893,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2022/02/image-1-784x1024.png" alt="" class="wp-image-314" width="684" height="893"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><li>本题的思想比较巧妙<ul><li>因为我无论如何也没想到这题可以转化成一个链表相关的题目</li><li><img class="wp-image-315" style="width: 800px;" src="http://106.14.114.97/wp-content/uploads/2022/02/image-2.png" alt=""></li><li><img class="wp-image-317" style="width: 800px;" src="http://106.14.114.97/wp-content/uploads/2022/02/image-3.png" alt=""></li><li>代码如下</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:list -->
<ul><li>本题的思想比较巧妙<ul><li>因为我无论如何也没想到这题可以转化成一个链表相关的题目</li><li><img class="wp-image-315" style="width: 800px;" src="http://106.14.114.97/wp-content/uploads/2022/02/image-2.png" alt=""></li><li><img class="wp-image-317" style="width: 800px;" src="http://106.14.114.97/wp-content/uploads/2022/02/image-3.png" alt=""></li><li>大体的思路一样，先快慢指针开始走走到相遇的点，然后慢指针回到起点的位置，快指针从相遇的位置开始，两个指针同时按相同的速度往后走，相遇的点就是环形入口的起点，即也就是重复数的点</li><li>代码如下</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class Solution {
public:
    int findDuplicate(vector&lt;int>&amp; nums) {
        int slow = 0,fast = 0;
        while(1)
        {
            slow = nums&#91;slow];
            fast = nums&#91;nums&#91;fast]];
            if(slow == fast)
            {
                break;
            }
        }
        slow = 0;
        while(1)
        {
            slow = nums&#91;slow];
            fast = nums&#91;fast];
            if(slow == fast)
            {
                break;
            }
        }

        return slow;
    }
};</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->
