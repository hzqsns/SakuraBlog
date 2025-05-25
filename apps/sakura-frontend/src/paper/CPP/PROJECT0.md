---
title: 'PROJECT #0 - C++ PRIMER大作业'
excerpt: '' 
author: Sakura
publishDate: '2023-06-09'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/129514942_p0_master1200.jpg' 
slug: 'CPP-Project-0'
date: 2023-06-09 19:29:00
tags:
  - C++
category:
  - C++
---

<!-- wp:heading -->
<h2>Overview</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":500,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-8-1024x292.png" alt="" class="wp-image-500"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>本学期所有的编程项目都将在BusTub数据库管理系统上编写。这个系统是用C++编写的。为了确保你有必要的C++背景，我们要求每个人完成一个简单的编程任务，以评估你对C++基本功能的了解。这个项目不会给你打分，但你必须以满分完成这个项目，才允许继续学习。任何学生如果不能在截止日期前完成这项作业，将被要求退出该课程。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这个编程作业中的所有代码都必须用C++（特别是C++17）编写。如果你以前没有使用过C++，这里有一个关于该语言的简短教程，一般来说知道C++11就足够了。在cppreference上有更多关于语言内部的详细文档。A Tour of C++和Effective Modern C++也可以从CMU图书馆以数字形式获得。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>PROJECT SPECIFICATION</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":502,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-10-1024x375.png" alt="" class="wp-image-502"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>在这个项目中，你将实现三个类。矩阵、RowMatrix和RowMatrixOperations。这些矩阵是简单的二维矩阵，必须支持加法、矩阵乘法和一个简化的通用矩阵乘法（GEMM）操作。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>你只需要修改一个文件：p0_starter.h 你可以在BusTub资源库中找到这个文件，地址是 src/include/primer/p0_starter.h。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>在这个头文件中，我们定义了你必须实现的三个类。Matrix抽象类定义了派生类RowMatrix的公共函数。RowMatrixOperations类使用RowMatrix对象来实现上面概述中提到的操作。文件中指定了函数原型和成员变量。该项目要求你填写所有构造函数、解构函数和成员函数的实现。不要添加任何额外的函数原型或成员变量。你的实现应该只包括实现我们为你定义的函数。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>教员和助教不会对C++问题提供任何帮助。你可以自由使用谷歌或StackOverflow来了解C++和你遇到的任何错误。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>TESTING</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":503,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-11-1024x463.png" alt="" class="wp-image-503"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>你可以使用我们的测试框架来测试这项任务的各个组成部分。我们使用GTest进行单元测试案例。有一个文件包含对所有三个类的测试。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>启动器：test/primer/starter_test.cpp<br>你可以在命令行中单独编译和运行每个测试。</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>$ mkdir build
$ cd build
$ make starter_test
$ ./test/starter_test</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>你也可以运行 make check-tests 来运行所有的测试案例。注意，有些测试是禁用的，因为你还没有实施未来的项目。你可以在GTest中通过给测试名称添加DISABLED_前缀来禁用测试。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这些测试只是所有测试的一个子集，我们将用它来评估和评定你的项目。你应该自己编写额外的测试用例来检查你的实现的完整功能。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>请确保你从测试名称中删除DISABLED_前缀，否则它们将无法运行。</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2>配置环境</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>首先是创建环境，这里我直接借用朋友的服务器，上面已经有配置好的Linux环境以及cpp的各种工具比如cmake、gdb、gcc等</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这里我采用的是2021的版本，直接在服务器对应的位置</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>git clone https://github.com/cmu-db/bustub.git 克隆到自己的服务器上</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这里有一个小坑，就是clone下来会报头文件路径找不到的错误，这里就需要我们配置c_cpp_properties.json了</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>1) 点击 <em><strong>Ctrl + Shift +P</strong>  </em>弹出命令搜索框；2) 选择  C/C++: 编辑配置 (UI)  即可生成 c_cpp_properties.json 文件，此文件同样包含在.vscode文件夹中。</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":504,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-12.png" alt="" class="wp-image-504"/><figcaption>注意这里一定要在最外层的文件夹下进行配置，这样所有cpp的头文件路径就都不会报错了</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":505,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-13.png" alt="" class="wp-image-505"/><figcaption>在上述配置文件中，我们会看到类似于  ${workspaceFolder}  等等类似的描述，这些描述是 VS Code <strong>预定义变量名</strong>，可以用来代指工作目录的路径，环境变量的名称，生成文件的名称等等。使用这些预定义的变量名可以使得我们的开发过程更加高效，同时可移植性也大大增强。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>⭐一般我们比较常见的变量名有：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>${workspaceFolder} - VS Code当前打开工作区文件夹的路径
${file} - 当前打开文件的绝对路径
${fileBasename} - 当前打开文件的名称
${fileBasenameNoExtension} - 当前打开文件的名称，但是不加后缀名
${fileDirname} - 文件所在的文件夹路径</code></pre>
<!-- /wp:code -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2>代码内容</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><br>主要实现三个类：matrix，RowMatrix，RowMatrixOperations</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>matrix</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><br>是个抽象类，定义了矩阵这个类所需要的一些基本成员变量和函数：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>因为大部分是虚函数，所以不需要我们填写实现</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>需要做的是在构造函数里初始化一些变量：rows，columns，以及初始化一个一维数组，用来保存flatten matrix的内容，注意因为动态申请的内存，里面的内容并不确定，所以最好在</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>构造函数里将其初始化为0</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>此外，需要在析构函数里释放掉数组</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>Matrix(int rows, int cols) {
    rows_ = rows;
    cols_ = cols;
    int len = rows * cols;
    linear_ = new T&#91;len];
  }</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>注意，这里的linear_是指向二维数组那个空间的头指针，直接从这个头指针申请rows*cols个大小的堆空间即可</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>RowMatrix</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><br>继承Matrix类，并实现成员函数：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>基本上都很直观，另外这里增加了成员变量，二级指针data,因此我们在构造函数里需要根据rows和cols来申请一个二维数组，注意需要先申请一个一维指针数组，然后每个元素存放一个指向一维数组的指针。在析构函数中，同样需要首先delete掉每个元素对应的数组，然后delete掉这个指针数组</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>RowMatrix(int rows, int cols) : Matrix&lt;T>(rows, cols) {
    data_ = new T *&#91;rows];
    for (int i = 0; i &lt; rows; i++) {
      data_&#91;i] = this->linear_ + i * cols;
    }
  }</code></pre>
<!-- /wp:code -->

<!-- wp:image {"id":506,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-14.png" alt="" class="wp-image-506"/><figcaption>在构造函数中分配行指针数组，使用这些指针指向“线性”数组的相应元素，不要忘记在析构函数中释放数组。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>data_即二维数组对应的指针，首先<strong>data_ = new T *[rows];</strong>表示data_申请了rows个大小的指针数组</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>然后<strong>data_[i] = this->linear_ + i * cols;</strong>表示把这个指针数组中的每个空间对应的指针都指向我们之前已经申请好的内存空间，this->linear就是初始地址，第一行指针指向<strong>this->linear_ + 0 * cols</strong>，第二行指针指向<strong>this->linear_ + 1 * cols</strong>然后依次类推</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>这样整理好之后，对应的data_[i][j]就是我们想要的二维数组了，即matrix对应的形式</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>RowMatrixOperations</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>这里需要实现几个矩阵运算的函数：加法和乘法，也很简单</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>复杂的点在于，函数的参数类型是unique_ptr,智能指针</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>unique_ptr</p><p>代表这个指针指向的资源只属于一个owner，因此不能赋值给其他变量，注意，直接作为函数参数，也是一种赋值</p><p>即，他不能copy，只能move</p></blockquote>
<!-- /wp:quote -->

<!-- wp:paragraph -->
<p>Add函数，即两个矩阵相加，对应每个元素相加即可</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>static auto Add(const RowMatrix&lt;T> *matrixA, const RowMatrix&lt;T> *matrixB) -> std::unique_ptr&lt;RowMatrix&lt;T>> {
    // TODO(P0): Add implementation
    if (matrixA->GetRowCount() != matrixB->GetRowCount() || matrixA->GetColumnCount() != matrixB->GetColumnCount())
      return std::unique_ptr&lt;RowMatrix&lt;T>>(nullptr);

    int row = matrixA->GetRowCount();
    int col = matrixA->GetColumnCount();
    auto addMatrix = std::unique_ptr&lt;RowMatrix&lt;T>>(new RowMatrix&lt;T>(row, col));
    for (int i = 0; i &lt; row; i++) {
      for (int j = 0; j &lt; col; j++) {
        T sum = matrixA->GetElement(i, j) + matrixB->GetElement(i, j);
        addMatrix->SetElement(i, j, sum);
      }
    }
    return addMatrix;
  }</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Multiply函数，即两个矩阵相乘</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>static auto Multiply(const RowMatrix&lt;T> *matrixA, const RowMatrix&lt;T> *matrixB) -> std::unique_ptr&lt;RowMatrix&lt;T>> {
    // TODO(P0): Add implementation

    int rowA = matrixA->GetRowCount();
    int colA = matrixA->GetColumnCount();
    int rowB = matrixB->GetRowCount();
    int colB = matrixB->GetColumnCount();
    if (colA != rowB) return std::unique_ptr&lt;RowMatrix&lt;T>>(nullptr);

    auto multMatrix = std::unique_ptr&lt;RowMatrix&lt;T>>(new RowMatrix&lt;T>(rowA, colB));
    int common = colA;
    for (int i = 0; i &lt; rowA; i++) {
      for (int j = 0; j &lt; colB; j++) {
        T sum = 0;
        for (int k = 0; k &lt; common; k++) {
          sum += matrixA->GetElement(i, k) * matrixB->GetElement(k, j);
        }
        multMatrix->SetElement(i, j, sum);
      }
    }
    return multMatrix;
  }</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>这里需要注意的就是我们用到了unique_ptr智能指针，这样子我们之后就不用再手动地释放指针对应的地址了。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>General Matrix Multiply operation函数</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Compute (`matrixA` * `matrixB` + `matrixC`).&nbsp; &nbsp;* Return `nullptr` if dimensions mismatch for input matrices.</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>static std::unique_ptr&lt;RowMatrix&lt;T>> GEMM(const RowMatrix&lt;T> *matrixA, const RowMatrix&lt;T> *matrixB,
                                            const RowMatrix&lt;T> *matrixC) {
    // TODO(P0): Add implementation
    auto matrixAmultB = Multiply(matrixA, matrixB);
    if (matrixAmultB != nullptr) {
      return Add(matrixAmultB, matrixC);
    }

    return std::unique_ptr&lt;RowMatrix&lt;T>>(nullptr);
  }</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>其他函数</h2>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>T GetElement(int i, int j) const override {
    if (i &lt; 0 || i >= this->rows_ || j &lt; 0 || j >= this->cols_)
      throw Exception(ExceptionType::OUT_OF_RANGE, "index is out of range");

    return data_&#91;i]&#91;j];
  }
void SetElement(int i, int j, T val) override {
    if (i &lt; 0 || i >= this->rows_ || j &lt; 0 || j >= this->cols_)
      throw Exception(ExceptionType::OUT_OF_RANGE, "index is out of range");

    data_&#91;i]&#91;j] = val;
  }
</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>结果</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":508,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-16.png" alt="" class="wp-image-508"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>总结</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>project0还是偏简单的，根据一个矩阵的乘法来考察我们CPP的基本知识</p>
<!-- /wp:paragraph -->
