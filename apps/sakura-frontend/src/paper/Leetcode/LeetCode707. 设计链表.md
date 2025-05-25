---
title: LeetCode707. 设计链表
excerpt: '' 
author: Sakura
publishDate: '2022-02-15'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/108032956_p0_master1200.jpg' 
slug: 'LeetCode-707'
date: 2022-02-15 18:09:00
tags:
  - 链表
category:
  - 算法题
  - Leetcode
---

<!-- wp:image {"id":311,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/02/image-755x1024.png" alt="" class="wp-image-311"/></figure>
<!-- /wp:image -->

<!-- wp:list -->
<ul><li>点评<ul><li>思路比较简单，但是里面的很多细节值得我们注意</li><li>比如链表定义的虚拟头结点和尾结点，在增删的时候需要对应修改</li><li>以及额外定义的链表长度对应的修改</li></ul></li><li>代码如下</li></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>class MyLinkedList {
public:
    // 定义链表节点结构体
    struct LinkedNode {
        int val;
        LinkedNode* next;
        LinkedNode(int val):val(val), next(nullptr){}
    };
    int nowlength;//链表现有的长度
    LinkedNode* dummy = nullptr;//虚拟的头节点
    LinkedNode* tail = nullptr;//尾结点，指向链表最后一个结点
    
    MyLinkedList() {//链表初始化
        dummy = new LinkedNode(-1);
        tail = dummy;
        nowlength = 0;
    }
    //获取链表中第 index 个节点的值。如果索引无效，则返回-1
    int get(int index) {
        if(index &lt; 0 || index > nowlength-1) return -1;//索引无效返回-1
        if(index == 0) return dummy->next->val;//index = 0,直接返回第一个结点
        if(index == nowlength-1) return tail->val;//index == nowlength-1,直接返回尾结点对应值
        auto t = dummy->next;
        while(index--)//否则遍历index次找到对应结点返回值
        {
            t = t->next;
        }
        return t->val;
    }
    //在链表的第一个元素之前添加一个值为 val 的节点。插入后，新节点将成为链表的第一个节点。
    void addAtHead(int val) {
        auto t = new LinkedNode(val);
        t->next = dummy->next;
        dummy->next = t;
        if(t->next == nullptr) tail = t;//如果此时插入后结点右边为空，则把该结点赋值给尾结点
        nowlength++;
    }
    //将值为 val 的节点追加到链表的最后一个元素。
    void addAtTail(int val) {
        if(tail == nullptr) addAtHead(val);//如果链表为空的话，直接调用addAtHead函数
        else{//否则直接在尾结点插入元素
            auto t = new LinkedNode(val);
            tail->next = t;
            tail = t;
            nowlength++;
        }
    }
    //在链表中的第 index 个节点之前添加值为 val  的节点。如果 index 等于链表的长度，则该节点将附加到链表的末尾。如果 index 大于链表长度，则不会插入节点。如果index小于0，则在头部插入节点。
    void addAtIndex(int index, int val) {
        if(index &lt;= 0) addAtHead(val);//如果index小于0，则在头部插入节点
        else if(index == nowlength)//如果 index 等于链表的长度，则该节点将附加到链表的末尾
        {
            addAtTail(val);
        }
        else if(index > 0 &amp;&amp; index &lt; nowlength)//否则，从头结点遍历index次到对应结点进行插入操作
        {
            auto t = dummy;
            while(index--)
            {
                t = t->next;
            }
            auto insertNode = new LinkedNode(val);
            insertNode->next = t->next;
            t->next = insertNode;
            nowlength++;
        }
    }
    //deleteAtIndex(index)：如果索引 index 有效，则删除链表中的第 index 个节点。
    void deleteAtIndex(int index) {
        if(index >= 0 &amp;&amp; index &lt; nowlength)//如果索引 index 有效
        {
            auto t = dummy;
            while(index--)
            {
                t = t->next;
            }
            auto deleteNode = t->next;
            if(deleteNode == tail)//如果删除结点是尾结点的话，则把尾结点前移
            {
                tail = t;
            }
            t->next = t->next->next;
            delete(deleteNode);
            nowlength--;
        }
    }
};

/**
 * Your MyLinkedList object will be instantiated and called as such:
 * MyLinkedList* obj = new MyLinkedList();
 * int param_1 = obj->get(index);
 * obj->addAtHead(val);
 * obj->addAtTail(val);
 * obj->addAtIndex(index,val);
 * obj->deleteAtIndex(index);
 */</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->