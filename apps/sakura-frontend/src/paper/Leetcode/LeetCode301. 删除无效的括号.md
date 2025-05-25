---
title: LeetCode301. 删除无效的括号
excerpt: ''
author: Sakura
publishDate: '2022-01-15'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/124808701_p0_master1200.jpg'
slug: 'LeetCode-301'
date: 2022-01-15 17:58:00
tags:
    - DFS
category:
    - LeetCode
    - 算法题
---

<!-- wp:list -->
<ul><li><img width="700" height="660" src="https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/1288d4a9-b92f-4b94-a3f7-b8dcc237336c.png"></li><li>思路<ul><li>dfs+剪枝</li><li>这道题首先需要了解背景知识</li><li>对于一个合法括号序列应该满足的条件<ul><li>一是左右括号的个数都需要相同（数量）</li><li>二是在任意一个前缀之中，左括号的个数都要大于等于右括号个数（匹配）</li></ul></li><li>那么很明显，我们需要提前遍历字符串统计出能够删除的左括号和右括号的最大个数<ul><li>所以我们定义l = (左括号-右括号)个数，此时超出来的就是能够删掉左括号的个数</li><li>定义r = 应该删掉的右括号的个数，条件是，如果当l == 0时，r++</li></ul></li><li>然后我们开始dfs<ul><li>我们很快会遇到一个问题，就是如果对于连续的左括号，比如(((()，那么这个时候删掉任意一个左括号似乎都是可行的，<strong>所以我们在这里定义删掉括号只能从前往后删</strong><ul><li>比如删掉1个括号，只能删除(((()</li><li>比如删掉2个括号，只能删除(((()</li><li>比如删掉3个括号，只能删除(((()</li><li>比如删掉4个括号，只能删除(((()</li><li>这样做可以避免重复</li></ul></li></ul></li><li>代码如下</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:image {"id":247,"width":837,"height":456,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/10/image-16-1024x559.png" alt="" class="wp-image-247" width="837" height="456"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":250,"width":1083,"height":693,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/10/image-19-1024x656.png" alt="" class="wp-image-250" width="1083" height="693"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":251,"width":993,"height":475,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/10/image-20-1024x491.png" alt="" class="wp-image-251" width="993" height="475"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><li>注意点<ul><li>我们在这里的写法是，如果遍历到左括号，那么此时就看一共有多少个连续的左括号</li><li>假设一共有k个左括号，我们假设首先全部删去k个左括号</li><li>看是否超过了最大能删掉的左括号的个数</li><li>如果超过了，那么就重新加回来<ul><li>即对应now += '(',l++,r++;</li></ul></li><li>满足继续dfs的条件就是cnt >= 0,l >= 0<ul><li>cnt >= 0就表示当前now字符串中左括号个数是大于等于右括号个数的</li><li>l >= 0就说明此时删去左括号的个数没有超过最大能删掉的左括号的个数</li></ul></li><li>举个例子，假设我们最多能删掉4个左括号，那么遇到连续4个左括号，我们就枚举了删掉1个左括号、删掉2个左括号、删掉3个左括号、删掉4个左括号这4种情况都能够枚举到</li><li>对于右括号的情况，同理即可</li></ul></li></ul></li></ul>
<!-- /wp:list -->
