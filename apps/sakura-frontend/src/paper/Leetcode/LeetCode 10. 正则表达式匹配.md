---
title: LeetCode 10. 正则表达式匹配
excerpt: '' 
author: Sakura
publishDate: '2024-06-27'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/130212437_p0_master1200.jpg' 
slug: 'LeetCode-10'
date: 2024-06-27 22:09:00
tags:
  - DP
category:
  - 算法题
  - LeetCode
---

## 题干
![](http://www.hzqsns.com/wp-content/uploads/2023/10/Snipaste_2023-10-02_17-10-38.png)

代码如下，看代码中解析即可
```cpp
class Solution {
public:
    bool isMatch(string s, string p) {
        int m = s.size(),n = p.size();
        s = ' ' + s, p = ' ' + p;//下标从1开始
        //f[i][j]表示s[1~i]和p[1~j]是否有成功的匹配方案
        /*
        如果 p[j]不为*的话
            判断f[i-1][j-1]是否为true，且s[i] == p[j]或者 p[j] == '.'
        如果 p[j]为*的话，分三种情况来考虑，f[i][j]对应以下几种情况转移出来
            如果*只代表0个字符，即对应f[i][j] = f[i][j-2]
            如果*只代表1个字符，即对应f[i][j] = f[i-1][j-2] && (s[i] == p[j-1] || p[j-1] == '.')
            如果*只代表2个字符，即对应f[i][j] = f[i-2][j-2] && (s[i] == p[j-1] || p[j-1] == '.') && (s[i-1] == p[j-2] || p[j-2] == '.')
        依次类推
            f[i][j] = f[i][j-2] || f[i-1][j-2] && (s[i] == p[j-1] || p[j-1] == '.') || f[i-2][j-2] && (s[i-1] == p[j-2] || p[j-2] == '.') && (s[i-2] == p[j-3] || p[j-3] == '.')  .....
            根据完全背包的优化经验我们不难看出
            f[i-1][j] = f[i-1][j-2] || f[i-2][j-2] && (s[i-1] == p[j-2] || p[j-2] == '.') || f[i-3][j-2] && (s[i-2] == p[j-3] || p[j-3] == '.') && (s[i-3] == p[j-4] || p[j-4] == '.')  .....
            故f[i][j] = f[i][j-2] || (f[i-1][j]  && (s[i] == p[j-1] || p[j-1] == '.'))
        */

        vector<vector<bool>> f(m+1,vector<bool>(n+1));
        f[0][0] = true;
		/**
		为什么i要从0开始，因为如果s是空的话如果p里面如果有*的话也是有可能匹配成功的
		如果j也要从0开始，即此时p为空，那么s如果有字符的话那么也一定不符合条件
		*/
        for(int i = 0;i <= m;i++){
            for(int j = 1;j <= n;j++){
                if(i && p[j] != '*'){
                    f[i][j] = f[i-1][j-1] && (s[i] == p[j] || p[j] == '.');
                }else if(p[j] == '*'){
                    f[i][j] = f[i][j-2] || (i && f[i-1][j]  && (s[i] == p[j-1] || p[j-1] == '.'));
                }

            }
        }

        return f[m][n];

    }

};
```
