---
title: CS144 Lab Checkpoint 1: stitching substrings into a byte stream
excerpt: '' 
author: Sakura
publishDate: '2023-06-21'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/128922685_p0_master1200.jpg' 
slug: 'CS144-Lab1'
date: 2023-06-21 19:37:00
tags:
  - Network
category:
  - CS144
---

<!-- wp:image {"id":546,"width":840,"height":351,"sizeSlug":"large","linkDestination":"none","className":"is-style-default"} -->
<figure class="wp-block-image size-large is-resized is-style-default"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-8.png" alt="" class="wp-image-546" width="840" height="351"/><figcaption>在Lab 0中，您使用internet流套接字从网站获取信息并发送电子邮件消息，使用Linux内置的传输控制协议(TCP)实现。这个TCP实现成功地产生了一对可靠的按顺序的字节流(一个从您发送到服务器，另一个从相反的方向发送)，即使底层网络只发送“最努力”的数据报。我们的意思是:可以丢失、重新排序、修改或复制的短数据包。您还自己在一台计算机的内存中实现了字节流抽象。在接下来的四周中，您将实现TCP，以在由不可靠的数据报网络分隔的一对计算机之间提供字节流抽象。<br></figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":547,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-9-1024x676.png" alt="" class="wp-image-547"/><figcaption><strong>这个图片中所表示的是TCP的整体结构 ;</strong><br><strong>TCP实现中的模块和数据流的安排ByteStreamwas Lab0。TCP的工作是在一个不可靠的数据报网络上传输两个bytestreams(每个方向一个)，这样写到连接一端套接字的字节就可以作为字节在对等端读取，反之亦然。Lab1是StreamReassembler，而在Lab 2、3和4中，你将实现tcpreceiver、TCPSender，然后tcpconnectionto将它们绑定在一起。</strong></figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":549,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-11.png" alt="" class="wp-image-549"/><figcaption>我为什么要这么做?在不同的不太可靠的服务之上提供服务或抽象是造成网络中许多有趣问题的原因。在过去的40年里，研究人员和实践者已经弄清楚了如何在互联网上传递各种各样的东西——信息和电子邮件、超链接文档、搜索引擎、声音和视频、虚拟世界、协作文件共享、数字货币。<br>TCP自己的角色是使用不可靠的数据报提供一对可靠的字节流，这就是典型的例子之一。一种合理的观点认为，TCP实现被认为是地球上使用最广泛的重要计算机程序。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":550,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-12.png" alt="" class="wp-image-550"/><figcaption>我们将在接下来的实验中分别实现：<br>Lab1&nbsp;<code>StreamReassembler</code>：实现一个流重组器，一个将字节流的字串或者小段按照正确顺序来拼接回连续字节流的模块<br>Lab2&nbsp;<code>TCPReceiver</code>：实现入站字节流的TCP部分。<br>Lab3&nbsp;<code>TCPSender</code>：实现出站字节流的TCP部分。<br>Lab4&nbsp;<code>TCPConnection</code>: 结合之前的工作来创建一个有效的 TCP 实现。最后我们可以使用这个 TCP 实现来和真实世界的服务器进行通信。<br><br><br></figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>  <strong>在LAB1实验中，我们将要去实现一个TCP 接收器的模块，把字串放入序列中。</strong><br>  <strong>TCP发送方将其字节流划分为多个短段(每个不超过1460字节的子字符串)，以便每个短段都能装入数据报中。但是网络可能会重新排序这些数据报，或者丢弃它们，或者不止一次地发送它们。接收端必须将这些段重新组装成它们开始时的连续字节流。</strong><br>  <strong>在本实验中，您将编写负责此重组的数据结构:一个StreamReassembler。它将接收由字符串字节组成的子字符串，以及该字符串在更大的流中的第一个字节的索引。流的每个字节都有自己独特的索引，从0开始并向上计数。streamreassembler将拥有输出的abytestream:一旦reassembler知道流的下一个字节，就会将其写入bytestream。所有者可以随时访问和读取bytestream</strong></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>FAQs</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>索引从0开始</li><li>我的实现效率应该有多高效?请不要将此视为构建一个空间或时间效率非常低的数据结构的挑战——该数据结构将是您的TCP实现的基础。一个大致的预期是，每个新的Lab1测试可以在不到半秒的时间内完成。（本实验对时间作要求）</li><li>不一致的子字符串应该如何处理? 你可以假设它们不存在。也就是说，您可以假设存在一个惟一的底层字节流，并且所有子字符串都是它的(准确的)片段。</li><li>我可以用什么? 你可以使用标准库中任何你觉得有用的部分。特别是，我们希望您至少使用一种数据结构。</li><li>何时应该将字节写入流？尽快。一个字节不应该出现在流中的唯一情况是，在它之前还有一个字节还没有被“推送”。</li><li>提供给push substring()函数的子字符串可能重叠吗？使是的</li><li>我需要添加私有成员到StreamReassembler吗？子字符串可以以任何顺序到达，因此数据结构必须“记住”子字符串，直到它们准备好放入流中——也就是说，直到它们之前的所有索引都被写入。</li><li>什么时候应该将字节写入流?越快越好？一个字节不应该在流中的唯一情况是，当它前面有一个字节时，它的还没有被“推”。</li><li>我们可以重新组装数据结构来存储重叠的子字符串吗？不。&nbsp;有可能实现一个存储重叠的“接口正确”的重组程序子字符串。&nbsp;但是允许重新组装者这样做会破坏“容量”的概念作为内存限制。&nbsp;我们将把存储重叠子字符串视为分级时的样式冲突。&nbsp;</li></ul>
<!-- /wp:list -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2>环境配置</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>当前我们的实验代码位于&nbsp;<code>master</code>&nbsp;分支，而在完成 Lab1 之前需要合并一些 Lab1 的依赖代码，因此执行以下命令：</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>git merge origin/lab1-startercode</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>然后重新编译即可</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>重点分析</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":551,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-13-1024x679.png" alt="" class="wp-image-551"/><figcaption>You may fifind this picture useful as you implement the StreamReassembler and work through<br>the tests—it’s not always natural what the “right” behavior is.</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>个人理解：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>蓝色部分是已经bytesteam提交给上层用户的部分，我们不用再管</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>绿色部分是已经push进bytesteam的部分，但还尚未被用户所读取</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>红色部分表示相当于提前到来或者说是错序的TCP包，这个时候我们不能把它们丢弃，于是乎得用一个辅助存储的东西提前存起来</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>capacity相当于绿色加上红色部分的最大容量，注意，这里红色部分加上绿色部分不等于capacity这两个都是动态更新的部分</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>思路分析</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>最开始的思路<ul><li>首先一开始我就想到了一个很棘手的问题，那就是如果有包提前到达了怎么办</li><li>显然我们不能直接丢弃，而是用一个存储器存起来，但是这就涉及到了一个判重的问题，因为有可能不同包对应序号区间可能有重叠的部分（每一个字节都对应一个index）</li><li>那么我们就需要判重，判重完之后再进一步push进bytesteam</li><li>一开始想到的暴力方法就是不管什么字符串我都一股脑地往哈希表里面存放</li><li>然后再从头开始一点一点存放，直到bytesteam满了为止</li><li>但是显然这种时间复杂度就得对每个字符都得遍历一次</li><li>但是我没想到比较好的优化方法，于是就放弃了</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:list -->
<ul><li>后来觉得还是应该从下标开始入手，因为push_string里面给了index和data</li><li>那么我们就可以搞清楚传入这个TCP包的序号的区间范围[index,index+data.size()]<ul><li>我们提前设置一个变量<strong>_next_assembled_index</strong></li><li>_next_assembled_index之前的都已经重组完毕并且装进了bytesteam，[_next_assembled_index,+∞)后下标对应的还未装配</li><li>当且仅当我们要push进bytesteam的index == <strong>_next_assembled_index</strong>的时候才允许插入，这样我们就保证了TCP包的顺序</li><li>同时我们定义一个哈希表来存放push不了的字符串，即_unassembled_string_mp，其中key为每个字符串的index（起始下标），value为字符串<ul><li>首先判断前面重叠的情况<ul><li>对于新插入进来的字符串data，我们首先在_unassembled_string_mp中里data的index最近的下标对应的字符串pre_string，判断pre_string的后部与data的前部是否有重叠的部分，如果有重叠的部分那么就舍弃掉重叠的部分，从data不与pre_string重叠的部分下标new_idx开始</li></ul></li><li>然后我们得判断后面重叠的情况<ul><li>我们找到了new_idx，那么我们以new_idx为基准，找到离new_idx后面距离最近的index下标对应的字符串post_string，判断post_string的前部与data的后部是否有重叠的部分<ul><li>这里需要分两种情况<ul><li>如果只是部分重叠，那么我们就截取掉后面重叠的部分，得到最终要插入的字符串大小_data_size</li><li>如果完全重叠，即当前字符串完全重叠了后面的字符串，那么我们就首先在<strong>_unassembled_string_mp</strong>中删除掉那个字符串，重新寻找离index后面最近的那个字符串post_string2然后再继续判断当前字符串与post_string2的重复情况，注意这里的代码可以直接复用</li></ul></li></ul></li></ul></li></ul></li><li>于是我们得到了完全不重复的字符串，对应起始序号new_idx，长度_data_size，在该字符串data内部对应的起始下标为_data_start_pos</li><li>下一步我们需要判断能否插入到bytesteam里面，于是我们需要判断能够接收的最大范围下标与当前字符串起始下标的关系<ul><li>当前能够接收的下标为<strong>_next_assembled_index</strong>，bytesteam已经接收大小为_output.buffer_size()，能够接收的最大容量为_capacity</li><li>那么能够接收的最远下标为_next_assembled_index + _capacity - _output.buffer_size()</li><li>当且仅当new_idx小于等于这个最远下标的时候才进行插入<ul><li>能够全部插入到bytesteam中就插入</li><li>如果有一部分插入不到bytesteam中就重新插入到<strong>_unassembled_string_mp</strong>中</li></ul></li></ul></li><li>最后在从头遍历一次<strong>_unassembled_string_mp</strong>，如果有满足条件的字符串对应下标等于<strong>_next_assembled_index</strong>，那么就可以执行插入，跟上面一样要注意bytesteam是否已经满了的因素</li><li>最后判断当前push_string的eof是否为真，如果为真我们就找到了最末尾字符串对应序号_eof_index = index+data.size()</li><li>如果<strong>_next_assembled_index</strong> &gt;= <strong>_eof_index</strong>说明就执行到了末尾，调用_output.end_put()告诉bytesteam执行到了末尾</li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:code -->
<pre class="wp-block-code"><code>//stream_reassembler.hh
#ifndef SPONGE_LIBSPONGE_STREAM_REASSEMBLER_HH
#define SPONGE_LIBSPONGE_STREAM_REASSEMBLER_HH

#include "byte_stream.hh"

#include &lt;cstdint&gt;
#include &lt;map&gt;
#include &lt;string&gt;

//! \brief A class that assembles a series of excerpts from a byte stream (possibly out of order,
//! possibly overlapping) into an in-order byte stream.
/*将字节流的一系列摘录(可能是无序的，可能是重叠的)汇编成有序字节流的类。*/
class StreamReassembler {
  private:
    // Your code here -- add private members as necessary.
    //_next_assembled_index之前的都已经重组完毕并且装进了bytesteam，&#91;_next_assembled_index,+∞)后下标对应的还未装配
    size_t _next_assembled_index;
    //_unassembled_bytes_num
    size_t _unassembled_bytes_num;
    //设置为最后一个结束字符的下标
    size_t _eof_index;
    //_unassembled_string_mp存放整个数据，其中key为index，value为string，表示暂存的字符串
    std::map&lt;size_t, std::string&gt; _unassembled_string_mp;
    ByteStream _output;  //!&lt; The reassembled in-order byte stream 重新组装的有序字节流
    size_t _capacity;    //!&lt; The maximum number of bytes

  public:
    //! \brief Construct a `StreamReassembler` that will store up to `capacity` bytes.
    //         构造一个将存储最多“容量”字节的“StreamReassembler”。
    //! \note This capacity limits both the bytes that have been reassembled,
    //! and those that have not yet been reassembled.
    //         这种容量限制了已重组的字节和尚未重组的字节。
    StreamReassembler(const size_t capacity);

    //! \brief Receive a substring and write any newly contiguous bytes into the stream.
    //!        接收一个子字符串并将任何新连续的字节写入流。
    //! The StreamReassembler will stay within the memory limits of the `capacity`.
    //         StreamReassembler将停留在“容量”的内存限制内。
    //! Bytes that would exceed the capacity are silently discarded.
    //!        超过容量的字节将被静默丢弃。
    //! \param data the substring
    //! \param index indicates the index (place in sequence) of the first byte in `data`
    //               指示' data '中第一个字节的索引(按顺序排列)。
    //! \param eof the last byte of `data` will be the last byte in the entire stream
    //             ' data '的最后一个字节将是整个流中的最后一个字节
    void push_substring(const std::string &amp;data, const uint64_t index, const bool eof);

    //! \name Access the reassembled byte stream 访问重新组装的字节流
    //!@{
    const ByteStream &amp;stream_out() const { return _output; }
    ByteStream &amp;stream_out() { return _output; }
    //!@}

    //! The number of bytes in the substrings stored but not yet reassembled
    //! 已存储但尚未重组的子字符串中的字节数
    //! \note If the byte at a particular index has been pushed more than once, it
    //! should only be counted once for the purpose of this function.
    //  如果位于特定索引的字节已经被推入多次，那么对于这个函数来说，它应该只计算一次。
    size_t unassembled_bytes() const;

    //! \brief Is the internal state empty (other than the output stream)?
    //         内部状态是空的(除了输出流)?
    //! \returns `true` if no substrings are waiting to be assembled
    //         如果没有子字符串等待组装，则返回' true '
    bool empty() const;
};

#endif  // SPONGE_LIBSPONGE_STREAM_REASSEMBLER_HH
</code></pre>
<!-- /wp:code -->

<!-- wp:code -->
<pre class="wp-block-code"><code>//stream_reassembler.cc
#include "stream_reassembler.hh"

// Dummy implementation of a stream reassembler.

// For Lab 1, please replace with a real implementation that passes the
// automated checks run by `make check_lab1`.

// You will need to add private members to the class declaration in `stream_reassembler.hh`
// 您需要在' stream_reassemble .hh '的类声明中添加私有成员。

// template &lt;typename... Targs&gt;
// void DUMMY_CODE(Targs &amp;&amp;... /* unused */) {}

using namespace std;

StreamReassembler::StreamReassembler(const size_t capacity)
    : _next_assembled_index(0)
    , _unassembled_bytes_num(0)
    , _eof_index(-1)
    , _unassembled_string_mp()
    , _output(capacity)
    , _capacity(capacity) {}

//! \details This function accepts a substring (aka a segment) of bytes,
//! possibly out-of-order, from the logical stream, and assembles any newly
//! contiguous substrings and writes them into the output stream in order.
/*
该函数从逻辑流中接收一个子字符串(也称段)，可能是无序的字节，
并将任何新的字节汇编起来连续的子字符串，并按顺序将它们写入输出流。
*/

void StreamReassembler::push_substring(const string &amp;data, const size_t index, const bool eof) {
    // DUMMY_CODE(data, index, eof);

    // 1.首先处理传入字符串与前面的重叠情况
    //   根据迭代器找到前一个字符串
    // 首先根据upper_bound找到大于index的第一个字符串
    auto pos_iter = _unassembled_string_mp.upper_bound(index);
    // 这样它的前一个字符串就一定是比index小的那个字符串了
    if (pos_iter != _unassembled_string_mp.begin()) {
        pos_iter--;
    }
    // 重叠处理之后新字符串的起始位置
    size_t new_idx = index;
    //判断这个字符串与当前push进来的字符串的重叠情况
    if (pos_iter != _unassembled_string_mp.end() &amp;&amp; pos_iter-&gt;first &lt;= index) {
        string _pre_string = pos_iter-&gt;second;
        size_t _pre_index_start = pos_iter-&gt;first;
        size_t _pre_index_end = _pre_index_start + _pre_string.size() - 1;

        // 既然这个字符串是前一个字符串，那我们只用考虑是否重叠
        // 一种就是部分重叠，即当前字符串的前部与前一个字符串的后部重叠
        // 前面重叠的部分我们就不要了，最后再更新
        if (_pre_index_end &gt;= index) {
            new_idx = _pre_index_end + 1;
        }
    } else if (index &lt; _next_assembled_index) {
        // 如果当前字符串前面没有字符串
        // 那这个时候我们就看它的前面有没有已经被读取，如果index &lt;
        // _next_assembled_index，说明这个字符串前面有一部分已经被push进bytesteam了
        // 那么这个时候就从_next_assembled_index开始读起，_next_assembled_index之前的数据就不要了，因为已经加载进bytesteam了
        // 所以new_idx就是_next_assembled_index
        new_idx = _next_assembled_index;
    }

    // index是data第一个字节对应的下标，因为前面我们有可能要舍弃一部分字节
    // 所以我们要到data的中间new_idx开始处理，那么对应data真正的下标开始位置就是new_idx - index
    size_t _data_start_pos = new_idx - index;
    ssize_t _data_size = data.size() - _data_start_pos;

    // 2.然后再处理字符串与后面的重叠情况
    // 找到与当前字符串距离最近的后一个字符串
    pos_iter = _unassembled_string_mp.lower_bound(new_idx);
    // 这里我们需要注意的一个点就是，前面的字符串我们只用考察一次重叠的情况
    // 但是后面重叠的字符串我们需要考虑多次
    // 比如有可能当前的字符串范围很大包含了后面很多字符串
    while (pos_iter != _unassembled_string_mp.end() &amp;&amp; new_idx &lt;= pos_iter-&gt;first) {
        string _post_string = pos_iter-&gt;second;
        size_t _post_index_start = pos_iter-&gt;first;
        size_t _post_index_end = _post_index_start + _post_string.size();
        size_t _data_end_pos = new_idx + _data_size;
        // 如果存在重叠区域
        if (_data_end_pos &gt; _post_index_start) {
            // 如果只是部分重叠，即前一个字符串的后部与后一个字符串的前部产生重叠
            // 注意这里不能加等号，等号就意味着完全重叠了
            if (_data_end_pos &lt; _post_index_end) {
                //_post_index_start-1  - new_idx + 1
                _data_size = _post_index_start - new_idx;
                break;
            } else {  // 否则就是完全重叠，即前一个字符串全部把后一个字符串全部包含了
                // 那么我们此时去除掉这个完全重叠的字符串即可
                // 因为我们下一步就会push进bytesteam中，如果push不了我们也会将这个大的字符串重新插入_unassembled_string_mp中
                _unassembled_bytes_num -= _post_string.size();
                pos_iter = _unassembled_string_mp.erase(pos_iter);
                continue;
            }
        } else {  //如果不存在重叠区域，直接break掉
            break;
        }
    }

    // 我们此时找出了插入的new_idx以及插入长度_data_size
    // 但是我们还要查看我们能够接收的下标范围和当前插入的是否符合要求
    // _next_assembled_index是下一个可接收的下标
    // _capacity是总的容量，即相当于红色和绿色区域加起来的最大可接收大小
    // _output.buffer_size()即相当于bytesteam已经接收的大小，相当于绿色区域
    // 于是_end_accept_index就相当于找到了可以接收下标中最远的下标
    size_t _end_accept_index = _next_assembled_index + _capacity - _output.buffer_size();

    // 可以接收的范围为&#91;_next_assembled_index,_end_accept_index]
    // 如果_end_accept_index 比 new_idx要小的话说明当前的下标就不在我们接收的范围里面,只能被迫丢弃
    // if (_end_accept_index &lt; new_idx) {
    //     return;
    // } else

    if (_end_accept_index &gt;= new_idx) {  //如果能接收那就插入我们找出的字符
        if (_data_size &gt; 0) {
            string _push_data = data.substr(_data_start_pos, _data_size);
            if (new_idx ==
                _next_assembled_index) {  //如果当前起始下标正好与_next_assembled_index对应，插入到bytesteam中
                size_t _written_size = _output.write(_push_data);
                _next_assembled_index += _written_size;
                if (_written_size &lt;
                    _push_data.size()) {  //说明bytesteam已经满了，这个时候多的部分就要插入到_unassembled_string_mp中
                    string _spare_data = _push_data.substr(_written_size, _push_data.size() - _written_size);
                    _unassembled_bytes_num += _spare_data.size();
                    _unassembled_string_mp.insert({_next_assembled_index, _spare_data});
                }
            } else {  //否则，插入到_unassembled_string_mp中
                string _spare_data = _push_data.substr(0, _push_data.size());
                _unassembled_bytes_num += _spare_data.size();
                _unassembled_string_mp.insert({new_idx, _spare_data});
            }
        }
    }

    // 3.最后再处理一遍_unassembled_string_mp中看是否有能插入的
    auto iter = _unassembled_string_mp.begin();
    while (iter != _unassembled_string_mp.end()) {
        if (iter-&gt;first == _next_assembled_index) {
            size_t _written_num = _output.write(iter-&gt;second);
            _next_assembled_index += _written_num;
            if (_written_num &lt; iter-&gt;second.size()) {
                string _spare_data = iter-&gt;second.substr(_written_num);
                size_t _spare_data_size = iter-&gt;second.size() - _written_num;

                _unassembled_bytes_num += _spare_data_size;
                //插入没写到bytesteam的字符串
                _unassembled_string_mp.insert({_next_assembled_index, _spare_data});

                //同时还要删除掉原来的字符串，因为已经部分写到bytesteam了
                _unassembled_bytes_num -= iter-&gt;second.size();
                _unassembled_string_mp.erase(iter);

                //因为这个时候bytesteam已经写满了，所以不再循环了，直接break
                break;
            }
            _unassembled_bytes_num -= iter-&gt;second.size();
            iter = _unassembled_string_mp.erase(iter);
        } else {
            break;
        }
    }

    //判断eof
    if (eof) {
        _eof_index = index + data.size();
    }

    if (_eof_index &lt;= _next_assembled_index) {
        _output.end_input();
    }
}
//! The number of bytes in the substrings stored but not yet reassembled
//! 已存储但尚未重组的子字符串中的字节数
//! \note If the byte at a particular index has been pushed more than once, it
//! should only be counted once for the purpose of this function.
//  如果位于特定索引的字节已经被推入多次，那么对于这个函数来说，它应该只计算一次。
size_t StreamReassembler::unassembled_bytes() const { return _unassembled_bytes_num; }

//! \brief Is the internal state empty (other than the output stream)?
//         内部状态是空的(除了输出流)?
//! \returns `true` if no substrings are waiting to be assembled
//         如果没有子字符串等待组装，则返回' true '
bool StreamReassembler::empty() const { return _unassembled_bytes_num == 0; }
</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->