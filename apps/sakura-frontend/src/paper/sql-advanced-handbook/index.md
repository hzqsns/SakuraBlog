---
title: SQL简明手册进阶篇
excerpt: '本文介绍SQL进阶知识，包括高级连接操作、窗口函数、公用表表达式等概念，帮助读者提升数据库查询和管理技能。'
author: 'Sakura'
publishDate: '2021-02-18'
coverImage: 'https://picsum.photos/800/600?random=4'
slug: 'sql-advanced-handbook'
date: 2021-02-18 14:20:00
tags:
    - 数据库
    - SQL
    - 编程
category:
    - 数据库
---

在上一篇《SQL 简明手册基础篇》中，我们介绍了 SQL 的基本语法和常用命令。本篇将进一步探讨一些进阶概念和技巧。

### 1. 高级连接操作

除了基本的 INNER JOIN 和 LEFT/RIGHT JOIN，SQL 还提供了：

#### FULL OUTER JOIN

返回两个表中的所有记录，即使它们没有匹配项：

```sql
SELECT * FROM employees
FULL OUTER JOIN departments
ON employees.department_id = departments.id;
```

#### CROSS JOIN

生成两个表的笛卡尔积：

```sql
SELECT * FROM employees
CROSS JOIN departments;
```

### 2. 窗口函数

窗口函数允许你在查询中对结果集进行分区处理：

```sql
SELECT
    name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as salary_rank
FROM employees;
```

### 3. 公用表表达式(CTE)

使用 WITH 子句创建临时结果集：

```sql
WITH high_salary_employees AS (
    SELECT * FROM employees WHERE salary > 50000
)
SELECT * FROM high_salary_employees
WHERE department = 'Engineering';
```
