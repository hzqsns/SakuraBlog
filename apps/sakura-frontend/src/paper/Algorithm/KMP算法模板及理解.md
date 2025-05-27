---
title: KMP算法模板及理解
excerpt: '' 
author: Sakura
publishDate: '2021-10-15'
coverImage: 'http://www.hzqsns.com/wp-content/uploads/2021/07/63372879_p0_master1200.jpg' 
slug: 'algorithm-kmp'
date: 2021-10-15 17:33:00
tags:
  - KMP
category:
  - 算法理论
---
<!-- wp:heading {"level":1} -->

<h1>简介</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->

<p>KMP 算法是根据三位作者（D.E.Knuth，J.H.Morris 和 V.R.Pratt）的名字来命名的，算法的全称是 Knuth Morris Pratt 算法，简称为 KMP 算法。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>KMP是一种高效的字符串匹配算法，用来在主字符串中查找模式字符串的位置(比如在“hello,world”主串中查找“world”模式串的位置)。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1} -->

<h1>暴力的做法</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->

<p>对于主串S[N]和模板串P[N],要找模板P在主串S中的每个起始位置</p>
<!-- /wp:paragraph -->

<!-- wp:code -->

<pre class="wp-block-code"><code>主串长度为n,模板串长度为m
for(int i = 1;i <= n;i++)
{
    bool flag = true;
    for(int j = 1;j <= m;j++)
    {
        if(S[i] != p[j])
        {
            flag = false;
            break;
        }
    }
}</code></pre>

<!-- /wp:code -->

<!-- wp:heading {"level":1} -->

<h1>如何优化暴力的做法？</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->

<p>暴力的做法是从主串的起始位置i开始，每次从头开始枚举模板串，如果有不相同的字符就直接break掉，再从i+1的位置开始进行匹配</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>显然，这种做法会进行大量重复性的工作<br>比如<br>主串 ababaeaba<br>模板串 ababacd<br>我枚举到第5个字符的时候发现此时主串中的e和模板串的c并不匹配<br>但是两个串中都有相同的前缀aba，这个时候可以滑动</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p><img src="KMP/3.png" alt=""></p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":158,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/3-1024x355.png" alt="" class="wp-image-158"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->

<p><br>如图所示，主串的i-1和模板串的j位置对应的字符串是相等的</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>到了i和j+1这里对应的字符就不相等</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>如果是暴力做法那么肯定就是把模板串整体往后挪一位然后再开始重新判断</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>但是显然我们在之前匹配的过程中已经做了大量的重复工作</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>所以我们思考怎么样才可以多挪动几位</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>因为这很容易可以想到<br>如果是</p>
<!-- /wp:paragraph -->

<!-- wp:code -->

<pre class="wp-block-code"><code>主串         abcabcxhhhh
模板串      abcabcyjklm</code></pre>

<!-- /wp:code -->

<!-- wp:paragraph -->

<p>我们匹配到主串的x和模板串的y这里就不匹配了<br>但是这里再把模板串往后挪动一位也肯定不匹配啊<br>即</p>
<!-- /wp:paragraph -->

<!-- wp:code -->

<pre class="wp-block-code"><code>主串      abcabcxhhhh
模板串    abcabcyjklm</code></pre>

<!-- /wp:code -->

<!-- wp:paragraph -->

<p>因为除非是一模一样的字符串，不然两个相同的字符串其中一个往后挪动一位还完全一致是不可能的</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>所以模板串挪到什么地方才对呢？</p>
<!-- /wp:paragraph -->

<!-- wp:code -->

<pre class="wp-block-code"><code>即挪到
主串             abcabcxhhhh
模板串               abcabcyjklm
这里才能相同</code></pre>

<!-- /wp:code -->

<!-- wp:paragraph -->

<p>因为从模板串可以看出来，一开始枚举到第6位的c的时候主串和模板串前面都还一致，直到枚举到第七位的时候就不相同了<br>这个时候就需要滑动模板串</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>这个时候就需要next数组了<br>next数组的含义就是：用来存模板串中每个前缀最长的能匹配前缀子串的结尾字符的下标</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->

<p>从模板串可知截止到第6位c之前的abcabc，后面的abc和前缀abc是相同的，<br>此时第6位c对应的next数组的值next[6] = 3,表示模板串中以第j个字符结尾的字符串应该跳到模板串的next[j]的位置往后继续匹配，如果对应的后面一个第j+1字符不匹配的话，则需要继续滑动，对应到模板串上就相当于要匹配的位置不断的往前跳动</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":159,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/4-1024x557.png" alt="" class="wp-image-159"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->

<p>因为主串的abcabc….<br>和模板串的abcabc…..已经匹配了<br>那么我如果不想再把模板串往后挪一位从头开始匹配的话</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->

<ol><li>那么我就需要找到一个方法挪动之后使得模板串的前缀部分与原来主串对应匹配的后缀部分相匹配才行</li><li>但是又因为主串对应匹配的后缀部分和一开始模板串对应匹配的后缀部分是相同的</li><li>那么第1步就可以转化为找模板串的前缀部分和后缀部分匹配的最大部分才行，而且匹配的字符串长度越大的话，从形象上来理解模板串滑动距离也越小。</li></ol>
<!-- /wp:list -->

<!-- wp:heading -->

<h2>个人理解</h2>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->

<ol><li>求next数组其实就是把模板串也当成一个主串，错位来跟模板串来进行最大匹配，当匹配成功的时候主串中对应的下标i和模板串中对应的下标j+1其实是对应滑动最短的距离之后可以再从j+1的位置开始进行匹配，如果后面一个字母对应不匹配就继续滑动</li><li>我们其实是找到最大前缀截止的地方方便我进行下一次匹配，然后我惊奇的发现我假设存在这种情况，和最大后缀又是相等的，所以直接转换成求最大后缀来求出next数组了。</li><li>那么对于不同的主串和模板串来说，匹配到不同的字母的时候，但是他们两个前缀都是相等的，这个时候前面相同的部分其实就可以看作是同一个模板串，然后因为我们已经处理了next数组，表示如果是模板串和模板串匹配的时候应该滑动几位，又因为这个时候主串和模板串前面的部分相同，我们就可以看成是模板串与模板串匹配然后直接套用next数组来表示模板串应该滑动多少，或者说是应该跳回到哪个位置再往后继续匹配。</li></ol>
<!-- /wp:list -->

<!-- wp:heading -->

<h2>注意点</h2>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->

<ol><li>模板串和主串下标都要从1开始储存，且主串和模板串需要错位去枚举，即主串是从i = 1开始枚举，模板串是从j = 0开始枚举，每次枚举S[i]与P[j+1]是否相同</li><li>当模板串和主串匹配成功的时候，我们仍需要使j = ne[j]，继续滑动模板串，看模板串从哪个地方开始进行继续进行匹配，因为继续滑动模板串的话如果能进行匹配的话，表示此时滑动之后模板串的前缀又和之前主串匹配成功的后缀是相同的，这个时候我们就又省去了很多不必要的步骤<br><img src="KMP/5.png" alt=""></li></ol>
<!-- /wp:list -->

<!-- wp:separator -->

<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":1} -->

<h1>题目</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":160,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/1-1024x483.png" alt="" class="wp-image-160"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->

<h1>输入输出</h1>
<!-- /wp:heading -->

<!-- wp:image {"id":161,"sizeSlug":"large","linkDestination":"none"} -->

<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2021/09/2-1024x442.png" alt="" class="wp-image-161"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":1} -->

<h1>代码如下</h1>
<!-- /wp:heading -->

<!-- wp:code -->

<pre class="wp-block-code"><code>#include <iostream>

using namespace std;

const int N = 1e5+10,M = 1e6+10;

char p[N],s[M];//p是模板串，s是原串，找到p在s中的所有起始位置
int next[N];
int n,m;

int main()
{
    cin>>n>>p+1>>m>>s+1;

    //求next数组
    //next数组从2开始匹配就行了，因为next[1] = 0表示第一个字母匹配失败了，我就只能从0开始匹配
    for(int i = 2,j = 0;i <= n;i++)
    {
        //这里其实是把模板串也当成一个主串来进行匹配
        //当匹配的模板串对应的j没有退回起点，且主串中的i和模板串中的j+1不匹配的话，就继续滑动模板串
        while(j && p[i] != p[j+1]) j = ne[j];
        //当i和j+1匹配的时候，表明
        if(p[i] == p[j+1])
        {
            j++;
            next[i] = j;    
        }
    }

    //KMP匹配过程
    for(int i = 1,j = 0;i <= m ;i++)
    {
        //当匹配的模板串对应的j没有退回起点，且主串中的i和模板串中的j+1不匹配的话，就滑动模板串
        //j如果退回起点就表明需要重新开始匹配
        while(j && s[i] != p[j+1]) j = next[j];
        //当模板串和主串匹配的时候就不断往后挪动
        if(s[i] == p[j+1]) j++;
        //当模板串匹配到最后一个字符的时候，表明这个时候匹配成功，那么这个时候就输出模板串的起始位置在主串中对应的下标
        if(j == n)
        {
            printf("%d ",i-n);
            //这里最后如果匹配了，那么模板串还要继续往右滑动，
            //因为j已经是最后一个了，那么再往后匹配，j+1的位置就相当于空串
            //此时s[i]和next[j+1]肯定是不相配也匹配不了的
            //所以匹配不了，同样的思路，让j回到next[j]的位置滑动字符串
            //然后再看此时的next[j+1]与s[i]是否相等
            j = next[j];
        }
    }

    return 0;
}</code></pre>

<!-- /wp:code -->

<!-- wp:paragraph -->

<p></p>
<!-- /wp:paragraph -->
