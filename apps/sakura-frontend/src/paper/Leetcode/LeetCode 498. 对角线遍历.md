---
title: LeetCode 498. 对角线遍历
excerpt: '' 
author: Sakura
publishDate: '2025-03-17'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/118435187_p0_master1200.jpg' 
slug: 'LeetCode-498'
date: 2025-03-17 13:16:00
tags:
  - 数学
category:
  - 算法题
  - LeetCode
---

![](http://www.hzqsns.com/wp-content/uploads/2024/06/Snipaste_2024-06-03_15-55-45.png)

直接看代码注释，核心思想就是
1. 找规律
2. 对角线的横纵坐标之和相等
3. 我们只用找到左下角到右上角的横坐标即可
4. 判定边界
```JavaScript
/**
 * @param {number[][]} mat
 * @return {number[]}
 */
var findDiagonalOrder = function(mat) {
    let res = []
    let m = mat.length,n = mat[0].length
    //如果只有一行或者一列，那么对应对角线就是当前数组
    if(!m || !n) return mat

    for(let i = 0;i < m + n;i++){
        //因为对角线横纵坐标和都相等，我们这里只关心对角线左下角和右上角对应的横坐标
        //左下角，左下角的横坐标最大值为m-1，其余值为i
        //比如m行n列，m = 3 n = 4，左下角横坐标一开始为0 1 2 2 2 2，一开始是i，最后都为2
        let left_down = Math.min(i,m-1)
        //右上角，右上角的横坐标最小值为0，其余值为 i - (n - 1)
        //比如m行n列，m = 3 n = 4，右上角横坐标一开始为0 0 0 0 1 2，一开始是0，最后都为i - (n - 1) 
        //比如i = 4的时候，此时对应横坐标为1，因为前面i = 0,1,2,3对应横坐标都为0，
        //此时要开始拐弯了那么显然i = 4的时候对应横坐标i - (n - 1)即i - 3 = 1
        let right_up = Math.max(0,i - (n - 1))

        if(i % 2 === 0){//i为奇数从下往上
            //从下往上打印，那么就从左下往右上打印，left_down默认是比right_up要大的，所以这里x要--
            for(let x = left_down;x >= right_up;x--){
                res.push(mat[x][i-x])
            }
        }else{//否则从上往下
            //从下往上打印，那么就从右上往左下打印，right_up默认是比left_down要小的，所以这里x要++
            for(let x = right_up;x <= left_down;x++){
                res.push(mat[x][i-x])
            }
        }
    }

    return res
};
```
