---
title: LeetCode 面试题 17.09. 第 k 个数
excerpt: '' 
author: Sakura
publishDate: '2023-07-12'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/128410566_p0_master1200.jpg' 
slug: 'Leetcode-17-09'
date: 2023-07-12 19:42:00
tags:
  - 数学
category:
  - 算法题
  - Leetcode
---

<!-- wp:image {"id":664,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-112.png" alt="" class="wp-image-664"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><li>我们很容易可以发现，后面大的数就是前面的数x3 x5 x7得来的    </li><li>所以我们只用从头开始从小的数x3 x5 x7即可    </li><li>但是会有一个问题就是比如相邻的数a b，a*5可能大于b*3    </li><li>比如1 3 5 7 9 15 21 25 35    </li><li>这个时候5*5 = 25 但是 7*3 = 21    </li><li>所以我们得考虑顺序的问题    但其实反过来想我们其实要找的就是对于一整个数列num    </li><li>num[0]*3,num[1]*3,num[2]*3,num[3]*3,...    </li><li>num[0]*5,num[1]*5,num[2]*5,num[3]*5,...    </li><li>num[0]*7,num[1]*7,num[2]*7,num[3]*7,...    </li><li>求他们的最小值，于是我们可以设置三个下标index1,index2,index3分别对应每个数*3 *5 *7的情况    </li><li>然后三个比较，就可以按顺序得到符合要求的最小值了</li></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>代码如下</h2>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class Solution {
public:

    int getKthMagicNumber(int k) {
        int index1 = 0,index2 = 0,index3 = 0;
        vector&lt;int>num;
        num.push_back(1);
        while(1){
            if(num.size() > k){
                return num&#91;k-1];
            }
            int t = min(min(num&#91;index1]*3,num&#91;index2]*5),num&#91;index3]*7);
            num.push_back(t);
            if(t == num&#91;index1]*3) index1++;
            if(t == num&#91;index2]*5) index2++;
            if(t == num&#91;index3]*7) index3++;
        }
        return 0;
    }
};</code></pre>
<!-- /wp:code -->

<!-- wp:image {"id":665,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-113-1024x749.png" alt="" class="wp-image-665"/></figure>
<!-- /wp:image -->