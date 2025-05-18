---
title: TensorRT踩坑教程
excerpt: '本文记录了在使用TensorRT部署深度学习模型时遇到的各种问题和解决方案，帮助初学者避开常见陷阱。'
author: 'Sakura'
publishDate: '2023-07-10'
coverImage: 'https://picsum.photos/800/600?random=3'
slug: 'tensorrt-pitfalls-and-solutions'
date: 2023-07-10 10:15:00
tags:
    - 深度学习习
    - 模型部署
    - PyTorch
    - TensorRT
category:
    - 深度学习
---

0. 前言 在部署深度学习模型时需要用到 TensorRT，看了一遍文档，我发现对于初学者来说，官方文档实在是太抽象了。文档里既没有接口的应用示例，也没有及时更新新版本的 API... 下面就来记录一下我踩过的坑。

### 1. 环境配置

首先，TensorRT 的版本需要与 CUDA、cuDNN 版本匹配。一般的对应关系为：

-   TensorRT 8.x 需要 CUDA 11.x
-   TensorRT 7.x 需要 CUDA 10.x

安装方式有几种：

-   pip 安装（最简单）：`pip install tensorrt`
-   通过 NVIDIA 官网下载安装包
-   使用 Docker 镜像（推荐）

### 2. 常见错误

#### 2.1 找不到共享库

```
ImportError: libnvinfer.so.8: cannot open shared object file: No such file or directory
```

解决方案：添加库路径到 LD_LIBRARY_PATH

```bash
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib/python3.8/dist-packages/tensorrt/
```

#### 2.2 层不支持

```
[TensorRT] ERROR: Layer not supported
```

这通常意味着你的模型包含 TensorRT 不支持的操作。解决方案包括：

-   使用自定义插件
-   修改模型结构
-   使用最新版本的 TensorRT
