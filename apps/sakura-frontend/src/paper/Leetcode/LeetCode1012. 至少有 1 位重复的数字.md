---
title: LeetCode1012. 至少有 1 位重复的数字
excerpt: '' 
author: Sakura
publishDate: '2024-01-12'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/126288311_p0_master1200.jpg' 
slug: 'LeetCode-1012'
date: 2024-01-12 21:36:00
tags:
  - 数学
category:
  - 算法题
  - Leetcode
---

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>题目描述</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:image {"id":730,"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="http://www.hzqsns.com/wp-content/uploads/2023/03/image-3.png" alt="" class="wp-image-730"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>思路分析<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>要找到正整数n对应，1到n内至少有1位重复数字的个数</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>我们很容易想到，总量为n，那么找到1到n中不重复数字的总和m</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>对应n - m即为至少有1位重复数字对应的个数</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>拿516285举例<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>先考虑小于6位数对应的不重复数字<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>因为516285是6位数，那么我们可以先减去5、4、3、2、1位数中不重复的数字，比如5位数不重复个数即为9 * 9 * 8 * 7 * 6 = 9 * P(9,4)，依次类推</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>再考虑等于6位数对应不重复的数字<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>首位单独拿出来考虑<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>我们首先减去首位为1~4，剩下5位不重复，因为首位不能选0，所以剩下各个位数可以选0，对应4 * 9 * 8 * 7 * 6 * 5 = 4 * P(9,5)</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>从下一位开始，因为有可能出现重复数字，所以我们要定义一个st数组，来记录是否有重复的数，比如515032，枚举到第三位也是5，那么后三位无论是多少数字都无意义了，都一定没有不重复的数。<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>还是拿516285举例<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>从第二位j = 1开始枚举，于是我们第二位考虑比j小的数即0，加上后面四位不重复的数，即8 * 7 * 6 * 5 = P(8,4) = P(10-2,4)，枚举后st[1] = true</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>从第三位j = 6开始枚举，于是我们第三位考虑比j小的数即0~5，对于每一位数如果st[k]不为true的话，就说明此时这个数可以来当第三位数，加上后三位不重复的数即7 * 6 * 5 = P(7,3) = P(10-3,3)</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>依次类推。。。。</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>每次循环完毕之后都判断一次，对应位数j是否重复(st[j] = true)，如果重复了就不用继续往下面循环了，后面对应的数一定都重复<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>注意这里一定要在循环最后判断，而不是一开始就判断j是否重复(st[j] = true)然后直接返回res，比如515，枚举到第三位就重复返回的话，那么就少了512、513、514对应最后一位不重复的情况</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>循环完毕之后如果能出循环，说明此时对应的每个数都不重复，因为如果有重复的话，那么一定在之前的循环就return结束了</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>最后还需要返回 res - 1<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>拿516287举例，上面循环了5遍</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>分别枚举了从第二位到第六位</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>2 - 0</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>3 - 0~5</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>4 - 0~1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>5 - 0~7</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>6 - 0~6</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>很明显，对于516287，</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>我们对应第2位没有枚举1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>我们对应第3位没有枚举6</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>我们对应第4位没有枚举2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>我们对应第5位没有枚举8</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>我们对应第6位没有枚举7</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>如果能够枚举到这里，说明枚举过程中没有遇到重复的数，即n不是重复的数</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>所以最后还需要减去最后这一个不重复的数516287</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>代码如下</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class Solution {
  public:
      //P(9,3) = 9 * 8 * 7
      int P(int a,int b){
          int res = 1;
          for(int i = a;b>0;b--,a--){
              res *= a;
          }
          return res;
      }
      vector&lt;int>nums;
      //拿516285举例
      int numDupDigitsAtMostN(int n) {
        int res = n;
        //首先把n的每位分到num中
        while(n) nums.push_back(n % 10),n /= 10;
  
        //小于6位数
        //516285有6位数，那么我们首先去除5、4、3、2、1位数中不重复的数，这些一定比6位数要小
          for(int i = nums.size() - 1;i > 0;i--){
              //比如5位数不重复的是9 * 9 * 8 * 7 * 6 = 9*P(9,4)
              res -= 9 * P(9,i-1);
          }
        //等于6位数
        //首先去除首位为1 - 4的部分,4 * P(9,5)
        //因为首位不能选0，所以第二位仍然有9种选择
        //从高到低能够选择的次数：4 * 9 * 8 * 7 * 6 * 5
        res -= (nums.back() - 1) * P(9,nums.size() - 1);
  
        vector&lt;bool> st(10);
        //然后去除首位为5对应的情况，首先设置首位为true不可再使用
        st&#91;nums.back()] = true;
        for(int i = nums.size() - 2;i >= 0;i--){
           //i = 6 - 2 = 4,第二位为j,比如此时为1，那么就去除0，对应后四位不重复的数
           //此时res只用减去一次8 * 7 * 6 * 5 = P(8,4) = P(10-2,4)
  
           //i = 4 - 1 = 3,第三位为j，比如此时为6，那么就去除此时该位(0-5)，对应后三位不重复的数
           //res -= 7 * 6 * 5 = P(7,3) = P(10-3,3)
  
           
           int j = nums&#91;i];
           for(int k = 0;k &lt; j;k++){
              //每次遇到前面用过的数就continue
              if(st&#91;k]) continue;
              res -= P(10 - (nums.size() - i),i);
           }
           //如果此时j已经被用到了，那么后面就不用再枚举了
           //比如515032，枚举到第三位也是5，那么后面一定都是重复的数，就没必要再往后枚举了
           if(st&#91;j]) return res;
           //把这次用到的数加入st数组中，以便后面不再用到
           st&#91;j] = true;
        }
        //拿516287举例，上面循环了5遍
        //分别枚举了从第二位到第六位
        //2 - 0
        //3 - 0~5
        //4 - 0~1
        //5 - 0~7
        //6 - 0~6
        //很明显，对于516287，
        //我们对应第2位没有枚举1
        //我们对应第3位没有枚举6
        //我们对应第4位没有枚举2
        //我们对应第5位没有枚举8
        //我们对应第6位没有枚举7
        //如果能够枚举到这里，说明枚举过程中没有遇到重复的数，即n不是重复的数
        //所以最后还需要减去最后这一个不重复的数516287
        return res-1;
  
      }
  };</code></pre>
<!-- /wp:code -->
