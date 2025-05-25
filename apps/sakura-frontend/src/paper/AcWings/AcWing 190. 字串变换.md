---
title: AcWing 190. 字串变换
excerpt: '' 
author: Sakura
publishDate: '2021-08-27'
coverImage: 'http://106.14.114.97/wp-content/uploads/2021/08/illust_78286152_20210704_215525.jpg' 
slug: 'AcWing-190'
date: 2021-08-27 17:18:00
tags:
  - 双端DFS
category:
  - 算法题
  - AcWings
---

<!-- wp:image {"id":108,"width":1087,"height":868,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-11-1024x818.png" alt="" class="wp-image-108" width="1087" height="868"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":109,"width":1450,"height":461,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2021/08/image-12-1024x326.png" alt="" class="wp-image-109" width="1450" height="461"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><li>分析<ul><li>这道题其实和AcWing 1107. 魔板类似，都是最短路问题，不同的是这道题能够变换的形式有6种，而且字符串的长度最长为20</li><li><strong>这道题的大意就是将A字符串通过一定的规则转变为B字符串</strong></li><li><strong>一个朴素的思想就是，把A字符串的所有能转变规则的地方都转变一次</strong></li><li><strong>就相当于从A字符串拓展出几条不同的通路来到达一个新的节点，然后依次类推</strong></li><li><strong>最后与B字符串连接，这样的问题其实还是一个最短路的问题</strong></li><li><strong>但是从题目可以看出字符串长度的上限为20，规则至多为6，且步数最多为10步</strong></li><li><strong>那么我们这样暴力的一层一层BFS，每个节点都要被搜到</strong></li><li><strong>那么假设每个规则都不重复，那么每个节点都有可能拓展出6条可能的方向来</strong></li><li><strong>那么最多遍历的点为6^10 = 60,466,176 ≈ 6*10^7</strong></li><li><strong>如果规则还能重复，比如a -> b,a -> c，那么最多需要遍历(20*6)^10 = 120^10这样时间复杂度就更大了</strong></li><li><strong>--------------------------------------------------------------------------------</strong></li><li><strong>所以对于这种时间复杂度很大的最短路的问题，我们需要逆向思考</strong></li><li><strong>因为单独从起点开始去寻找终点，这样可能的分支太多了</strong></li><li><strong>如果我们起点和终点同时开始去拓展呢，假设10步以内就能找到的话</strong></li><li><strong>从起点开始拓展5层，从终点开始拓展5层的时候就能够相遇，这个时候的时间复杂度为2*6^5</strong></li><li><strong>时间复杂度就大为减少了</strong></li></ul></li><li>注意<ul><li>分别从起点和终点拓展点的时候，我们要从少的分支开始拓展，因为从多的分支开始拓展明显会多很多无意义的分支，所以我们要分别定义两个队列分别存放起点和终点开始拓展的状态</li><li>如果探索起点（终点）拓展的点存在于终点（起点）探索的队列中，那么就说明从起点和终点分别探索的分支相遇了，这个时候就直接返回结果</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>#include &lt;iostream>
#include &lt;string>
#include &lt;cstring>
#include &lt;algorithm>
#include &lt;unordered_map>
#include &lt;queue>

using namespace std;

/**
 * 这道题的大意就是将A字符串通过一定的规则转变为B字符串
 * 一个朴素的思想就是，把A字符串的所有能转变规则的地方都转变一次
 * 就相当于从A字符串拓展出几条不同的通路来到达一个新的节点，然后依次类推
 * 最后与B字符串连接，这样的问题其实还是一个最短路的问题
 * 但是从题目可以看出字符串长度的上限为20，规则至多为6，且步数最多为10步
 * 那么我们这样暴力的一层一层BFS，每个节点都要被搜到
 * 那么假设每个规则都不重复，那么每个节点都有可能拓展出6条可能的方向来
 * 那么最多遍历的点为6^10 = 60,466,176 ≈ 6*10^7
 * 如果规则还能重复，比如a -> b,a -> c，那么最多需要遍历(20*6)^10 = 120^10这样时间复杂度就更大了
 * --------------------------------------------------------------------------------
 * 所以对于这种时间复杂度很大的最短路的问题，我们需要逆向思考
 * 因为单独从起点开始去寻找终点，这样可能的分支太多了
 * 如果我们起点和终点同时开始去拓展呢，假设10步以内就能找到的话
 * 从起点开始拓展5层，从终点开始拓展5层的时候就能够相遇，这个时候的时间复杂度为2*6^5
 * 时间复杂度就大为减少了
 */ 
const int N = 7;

string A,B;//A为起始字符串，B为终点字符串
string a&#91;N],b&#91;N];//a数组和b数组分别存放规则 a -> b
unordered_map&lt;string,int>qa,qb;//qa存放到结点到起点的距离，qb存放该结点到终点的距离
queue&lt;string>q1,q2;//q1和q2分别存放起点和终点拓展的点
int n = 0;
//v代表拓展的队列，a&#91;]和b&#91;]代表规则从a数组->b数组
//这里的qa和qb与我们定义的不同
//如果v对应的是起点拓展的队列，那么qa对应到起点的距离，qb对应到终点的距离
//如果v对应的是终点拓展的队列，那么qa对应到终点的距离，qb对应到起点的距离
//其实也就是从终点开始拓展，那么终点对应终点所拓展的点就相当于起点了
int extend(queue&lt;string>&amp; v,unordered_map&lt;string,int>&amp;qa,unordered_map&lt;string,int>&amp;qb,string a&#91;],string b&#91;])
{
    string t = v.front();//从队头弹出一个元素进行拓展
    v.pop();
    for(int i = 0;i &lt; t.size();i++)//从元素开头进行拓展
    {
        for(int j = 0;j &lt; n;j++)//枚举每一个规则
        {
            if(t.substr(i,a&#91;j].size()) == a&#91;j])//如果t字符串中有能与规则相匹配的字符段
            {
                //把旧字符串中的字符段换成新的字符段重新拼接
                string newt = t.substr(0,i) + b&#91;j] + t.substr(i+a&#91;j].size());

                //如果新拓展的点到终点存在距离，说明之前已经被终点拓展过
                //这个时候起点到终点的距离就为
                //弹出那个元素到起点的距离qa&#91;t]
                //该元素根据规则换到新的字符串的距离 1
                //以及新字符串已经被终点所拓展的距离qb&#91;newt]
                if(qb.count(newt)) return qa&#91;t] + 1 + qb&#91;newt];
    
                if(qa.count(newt)) continue;//如果a中已经存在新字符段了就直接continue
                v.push(newt);
                qa&#91;newt] = qa&#91;t] + 1;//否则就插入新的字符串，并更新新字符串到起点的距离
            }
        }
    }
    return 11;
}

int bfs(string A,string B)
{
    int t;//记录最小步数
    qa&#91;A] = 0,qb&#91;B] = 0;//起点和终点的距离分别设置为0
    q1.push(A),q2.push(B);
    while(q1.size() &amp;&amp; q2.size())//只有当q1和q2同时存在点的时候说明才有可能相遇，否则起点和终点不连通
    {
        //从节点少的队列开始拓展时间复杂度较小
        //因为节点少的队列，它拓展出来的分支也少，从而能避免枚举那些无意义的字符串
        if(q1.size() &lt; q2.size()) t = extend(q1,qa,qb,a,b);
        else t = extend(q2,qb,qa,b,a);
        if(t &lt;= 10) return t;
    }
    
    return 11;//如果没有结果的话，就返回一个大于10的数，代表不成功
}

int main()
{
    cin>>A>>B;
    while(cin>>a&#91;n]>>b&#91;n]) n++;
    
    int t = bfs(A,B);
    if(t > 10) puts("NO ANSWER!");
    else printf("%d",t);
    
    return 0;
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->
