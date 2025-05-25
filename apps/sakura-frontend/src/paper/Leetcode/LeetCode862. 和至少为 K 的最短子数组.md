---
title: LeetCode862. 和至少为 K 的最短子数组
excerpt: '' 
author: Sakura
publishDate: '2022-03-12'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/122037704_p0_master1200.jpg' 
slug: 'LeetCode-862'
date: 2022-03-12 18:12:00
tags:
  - 双端队列
category:
  - 算法题
  - Leetcode
---

<!-- wp:image {"id":320,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/03/image-1024x822.png" alt="" class="wp-image-320"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><li>本题是<a href="https://leetcode-cn.com/problems/minimum-size-subarray-sum/">209. 长度最小的子数组</a>的升级版，不同的是该题里面有负数，这样前缀和就不能用双指针取求解了</li><li>题解如下所示，严格的数学证明过程还是请看AcWing上y总的讲解或者leetcode上的题解吧！</li></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>```
/**
        因为对于暴力的做法对于区间(0,i],我们会到(0,i)从右到左依次遍历
        看是否有满足条件的t属于(0,i)使得s&#91;i] - s&#91;t] >= K(s&#91;i] - s&#91;t]对应区间&#91;t+1,i],即等价于(s&#91;i] - s&#91;(t+1)-1]))
        根据这个性质我们可以定义一个单调队列，这个单调队列中存放前缀和s&#91;i]的下标i
        且这个单调队列中的下标对应前缀和是依次递增的
        因为单调队列中我们是从左往右插入的(左对应队头，右对应队尾)
        那么对应区间(0,i]中对应的两个值s&#91;x]和s&#91;x+1]
        如果s&#91;x] >= s&#91;x+1] 那么s&#91;x]就没有存在的意义了，因为对于我们往后再继续遍历的话
        s&#91;x+1]比s&#91;x]更小，那么我往后如果要求和大于K的区间
        如果s&#91;i] - s&#91;x] >= k,且s&#91;i] - s&#91;x+1] >= k
        那我为什么不选x+1呢，因为x+1更靠右，对应的子数组长度肯定更短
*/
class Solution {
public:
    typedef long long LL;
    int shortestSubarray(vector&lt;int>&amp; nums, int k) {
        int n = nums.size();
        int ans = n+1;//最大的长度为n+1
        vector&lt;LL>s(n+1,0);//对应数据10^5 * 10^5 = 10^10会爆int，这里用longlong来存储
        for(int i = 1;i &lt;= n;i++)
        {
            s&#91;i] = s&#91;i-1] + nums&#91;i-1];
        }
        
        deque&lt;int> q;
        q.push_back(0);//把s&#91;0]先提前push进去
        for(int i = 1;i &lt;= n;i++)
        {
            //首先判断当前遍历到的值是否比单调队列的右边(即队尾)要大
            //如果更大，就一直弹出队尾的值，以便后面插入s&#91;i]，形成单调递增的队列
            while(q.size() &amp;&amp; s&#91;q.back()] >= s&#91;i]) q.pop_back();

            //弹出之后，单调队列里面就都是比s&#91;i]要小的数了
            //这个时候我们其实就是要找右端点为i，然后向左找到符合条件的s&#91;x]且x的下标越大越好
            //这样对应子数组的长度才会最短
            while(q.size() &amp;&amp; (s&#91;i] - s&#91;q.front()] >= k))
            {
                //此时满足条件，就直接求最小值
                //s&#91;i] - s&#91;q.front()]其实对应s&#91;i] - s&#91;(q.front()+1) - 1]
                //对应的区间其实是&#91;q.front()+1,i]
                //区间长度为i - (q.front()+1) + 1 = i - q.front()
                ans = min(ans,i - q.front());

                //此时再弹出左边(即队头)的元素
                //因为有可能队头右边的元素也能够满足条件，这样对应的区间更短
                //但是这里为什么要弹出更小的数呢，我个人觉得是因为s&#91;i]能拿来比较，说明s&#91;i]是在不断增大的
                //这样的话原来左边队头的元素如果不弹出的话，那么对应的区间长度肯定更大啊，没有什么意义，所以直接弹出
            
                q.pop_front();
            }
            //每次都还需要插入s&#91;i]对应的下标i
            q.push_back(i);
        }
        return (ans == n+1) ? -1 : ans;
    }
};
```</code></pre>
<!-- /wp:code -->
