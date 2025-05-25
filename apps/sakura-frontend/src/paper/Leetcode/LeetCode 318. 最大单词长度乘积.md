---
title: LeetCode 318. 最大单词长度乘积
excerpt: '' 
author: Sakura
publishDate: '2022-01-22'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/121916320_p0_master1200.jpg' 
slug: 'LeetCode-318'
date: 2022-01-22 18:04:00
tags:
  - 位运算
category:
  - 算法题
  - LeetCode
---
<!-- wp:image {"id":269,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/11/image-4-1024x1021.png" alt="" class="wp-image-269"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><li>思路<ul><li>因为看到这题的n最大范围就是1000，所以最大可以使用O(N^2)的算法</li><li>最难的地方应该在于怎么判断两个字符串是有重复字母的</li><li>我的思路就是把字符串的每一位字母都与a相减，会得到一个偏移量k，然后对应字符串加上每个字母的偏移量对应的2^k，最后可以得到一个数字</li><li>然后再双重循环遍历一次字符串，如果两两字符串对应的二进制没有交集的话说明就没有重复的字符</li><li>时间复杂度最高为1000*1000*26 = 26000000=2.6*10^7，应该算是勉强能过</li></ul></li><li>代码如下</li></ul>
<!-- /wp:list -->

<!-- wp:image {"id":270,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/11/image-5-891x1024.png" alt="" class="wp-image-270"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><li><a href="https://leetcode-cn.com/problems/maximum-product-of-word-lengths/solution/wei-rao-li-lun-zhuang-tai-ya-suo-yong-in-flgi/">题解</a></li></ul>
<!-- /wp:list -->

<!-- wp:image {"id":271,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/11/image-6-1024x563.png" alt="" class="wp-image-271"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":273,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/11/image-8-1024x830.png" alt="" class="wp-image-273"/></figure>
<!-- /wp:image -->

