---
title: Acwings167.木棒
excerpt: '' 
author: Sakura
publishDate: '2023-09-01'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/128284931_p0_master1200.jpg' 
slug: 'Acwings-167'
date: 2023-09-01 20:55:00
tags:
  - DFS
category:
  - 算法题
  - AcWings
---

# 题目描述

[![](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_0f24f286fa23317ef1b5739ce8e9d6b1.jpg)](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_0f24f286fa23317ef1b5739ce8e9d6b1.jpg)

# 输入输出

[![](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_85db5d1a615e12244fb77581e17dbee1.jpg)](http://106.14.114.97/wp-content/uploads/2022/11/wp_editor_md_85db5d1a615e12244fb77581e17dbee1.jpg)

# 分析

因为本题大概的意思就是把一堆木棍组成相同的木棒，然后求这个木棒的最短长度为多少，很明显想到的方法就是dfs，但是我们需要注意dfs的剪枝顺序

**dfs剪枝的要素**

* 优化搜索顺序:
  * 大部分情况下，应该优先搜索分支较少的节
  * 本题来说我们从长的木棒开始搜索这样就会减少搜索的分支
* 排除等效冗余
  * 即排除重复的搜索
  * 本题的体现就是如果有一个木棍k不满足条件的话，那么后面所有相等长度的木棍
* 可行性剪枝
  * 对应的就是第一根木棍和最后一根木棍的判断导致整个组装方案是否可行了，对应的分析如下
* 最优性剪枝



# 代码如下
```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

/**
 * @brief AcWing 167. 木棒
 * @link https://www.acwing.com/problem/content/169/
 * 1.优化搜索顺序:大部分情况下，应该优先搜索分支较少的节点
 * 2.排除等效冗余
 * 3.可行性剪枝
 * 4.最优性剪枝
 * 
 * 木棒：原先没有被砍断的大的木棍
 * 木棍：把木棒砍断之后形成的小木棍
 */

const int N = 70;

int length = 1;//木棒可能的长度，因为我们要找的是木棒的最小可能长度，所以从1开始

int sum = 0;//木棍的总长度
int n;//到底有多少木棍
int wood[N];//存放每根木棍
bool st[N];//判断每根木棍是否被使用

bool cmp(int a,int b){
    return a > b;
}

//u表示当前是第几个木棒,s表示当前木棒已经组装了多少长度,start表示从第几个木棍开始搜索
bool dfs(int u,int s,int start){
    if(u * length == sum) return true;//如果当前木棒数x每个木棒长度 == sum，说明此时对应的length是可行的，直接返回true

    //如果当前木棒对应组装长度s已经达到了length，那么就再新开一个木棒
    if(s == length) return dfs(u+1,0,0);

    //开始搜索
    for(int i = start;i < n;i++){
        if(st[i]) continue;//如果木棍用过的话，直接continue
        if(s + wood[i] > length) continue;//如果当前已经组装的长度s再加上当前木棍wood[i]超过length的话，直接continue

        //组装当前选中的木棍
        st[i] = true;
        //继续组装木棍，注意这里组装下一个木棍的下标应该从i+1开始，因为我们是从长的开始然后往后选短的，所以我们没必要再从头从长的木棍开始选起
        if(dfs(u,s + wood[i],i+1)) return true;

        st[i] = false;

        //如果能够运行到这个地方，说明当前的木棍wood[i]是不符合条件的
        //排除等效冗余

        //如果当前木棍对应的是第一根木棍，第一根木棍如果就失败的话，说明整个肯定也就失败了
        //因为如果假设当前木棍k组装失败但是整个木棒都组装成功了
        //说明木棍k没有被组装到当前木棒中，而是被组装到了其他木棒中
        //那么一开始木棍k就应该要组装成功，因为木棍k如果后面组装木棒B成功了，那么前面组装木棒A的时候没道理不成功，因为组装木棒A的时候显然可以选择的木棍更多
        if(s == 0) return false;

        //如果当前木棍对应的是最后一根木棍，而且s + wood[i] == length的话
        //说明当前的木棍wood[i]是能凑成一个长度为length的木棒的，但是仍然失败了，说明以length为长度的方案一定失败
        //------------------------------------------------------------------------------------------------
        //反证法的思想：
        //不妨假设以当前length长度的方案能够组装成功
        //但是此时组装木棒A失败(这是一个事实)
        //我们设当前要组装的木棍为x，长度为wood[i]
        //那么当前wood[i]一定存在于某根木棒我们设置为木棒B中，但又此时s(指当前木棒A已组装长度) + wood[i] == length
        //即木棒A中也有wood[i]长度的空间，那么我们互换木棒A和木棒B中这个wood[i]长度的木棒(就比如木棒A中wood[i]长度的就一根木棍x，木棒B中wood[i]长度的由几根木棍组成)
        //此时组装木棒A应该成功，与我们此时的事实矛盾
        //则此时假设不成立，即以当前length长度的方案组装一定失败！
        if(s + wood[i] == length) return false;

        //既然wood[i]不能用，那么后面紧挨着跟wood[i]长度相等的木棍肯定也不能用
        int j = i;
        while(j < n && wood[j] == wood[i]) j++;
        i = j - 1;//因为循环还要进行i++一次，那么下次循环i的值即为j
    }

    return false;

}

int main()
{
    while(cin>>n,n)
    {
        memset(st,0,sizeof st);
        sum = 0;
        length = 1;
        for(int i = 0;i < n;i++){
            cin>>wood[i];
            sum += wood[i];
        }
        sort(wood,wood+n,cmp);
        while(1)
        {
            if(sum % length == 0 && dfs(0,0,0)){
                cout<<length<<endl;
                break;
            }
            length++;
        }
    }
    return 0;
}

```





