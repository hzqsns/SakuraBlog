---
title: CS144 Lab0: networking warmup
excerpt: '' 
author: Sakura
publishDate: '2023-06-19'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/129010898_p0_master1200.jpg' 
slug: 'CS144-Lab0'
date: 2023-06-19 19:34:00
tags:
  - Network
category:
  - CS144
---
<!-- wp:heading -->
<h2>设置环境</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>这里直接借用了朋友的服务器，里面有配置好的Linux环境，在这里我非常感谢他，虽然我自己也有服务器拿来做这个博客了</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Fetch a Page</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":522,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-17-781x1024.png" alt="" class="wp-image-522"/><figcaption>直接照着做就行了</figcaption></figure>
<!-- /wp:image -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:image {"id":523,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-18.png" alt="" class="wp-image-523"/></figure>
<!-- /wp:image -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:image {"id":524,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-19.png" alt="" class="wp-image-524"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":525,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-20.png" alt="" class="wp-image-525"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>Send yourself an email</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":526,"sizeSlug":"large","linkDestination":"none","className":"is-style-default"} -->
<figure class="wp-block-image size-large is-style-default"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-21-652x1024.png" alt="" class="wp-image-526"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":527,"width":661,"height":387,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large is-resized"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-22.png" alt="" class="wp-image-527" width="661" height="387"/><figcaption>不知道为什么这里user unknown了，跳过</figcaption></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>Listening and connecting</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":528,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-23.png" alt="" class="wp-image-528"/><figcaption>我们用telnet充当客户端程序，向服务器发出不同的连接请求，现在我们用telnet来模拟服务器。先打开一个终端窗口输入netcat -v -l -p 9090，然后在另一个终窗口中输入telnet localhost 9090，客户端和服务器之间就建立起了连接，此后在任意窗口键入的内容在回车后都会显示在另外一个窗口</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":529,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-24.png" alt="" class="wp-image-529"/><figcaption>这里直接netcat -lvp会报getnameinfo: Temporary failure in name resolution，Google了一下发现还要加一个参数-n即可</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":530,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-25.png" alt="" class="wp-image-530"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2><strong>Writing a network program using an OS stream socket</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>接下来，我们利用Linux提供的套接字编程接口实现一个小的页面获取程序webget。我们需要从github上克隆代码仓库到本地。课程建议使用现代的C++风格（2011），并提供了很多详细的建议，我把重要的条目（还包括一条Git的使用建议）列在这里，供自己在后续实验中参考和学习：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>Never use malloc() or free()； never use new or delete. 绝对不要手动分配内存</li><li>Essentially never use raw pointers (*), and use "smart" pointers (unique ptr or shared ptr) only when necessary. (You will not need to use these in CS144.) 只有当你必要的时候才使用智能指针（当然指的是CS144本课程内）</li><li>Avoid templates, threads, locks, and virtual functions. (You will not need to use these in CS144.)避免使用模板 线程、锁、以及虚函数（当然指的是CS144本课程内）</li><li>Avoid C-style strings (char *str) or string functions (strlen(), strcpy()). These are pretty error-prone. Use a std::string instead. 不要使用C风格的字符串以及字符串处理函数</li><li>Never use C-style casts (e.g., (FILE *)x). Use a C++ static cast if you have to (you generally will not need this in CS144). 别使用文件 指针</li><li>Prefer passing function arguments by const reference (e.g.: const Address &amp; address). const</li><li>Make every variable const unless it needs to be mutated.</li><li>Make every method const unless it needs to mutate the object.</li><li>Avoid global variables, and give every variable the smallest scope possible.</li><li>Make frquent small commits as you work, and use commit messages that identify what changed and why.</li><li><a href="https://link.zhihu.com/?target=https%3A//cs144.github.io/doc/lab0/" target="_blank" rel="noreferrer noopener">Sponge: Main Page (cs144.github.io)</a>&nbsp;Sponge库使用指南，这个库建立在Linux提供的网络编程接口之上，这使我们的套接字编程实验变得更简单。我们的任务是实现<a href="https://link.zhihu.com/?target=http%3A//webget.cc" target="_blank" rel="noreferrer noopener">http://webget.cc</a>中的get_URL函数</li></ul>
<!-- /wp:list -->

<!-- wp:image {"id":531,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-26.png" alt="" class="wp-image-531"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":532,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/08/image-27.png" alt="" class="wp-image-532"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":533,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-1024x602.png" alt="" class="wp-image-533"/><figcaption>照着简介去写对应的代码即可</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":534,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-1.png" alt="" class="wp-image-534"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2><strong>An in-memory reliable byte stream</strong></h2>
<!-- /wp:heading -->

<!-- wp:image {"id":536,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-3.png" alt="" class="wp-image-536"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>到目前为止，您已经看到了可靠字节流的抽象在通过Internet进行通信时是如何有用的，即使Internet本身只提供“最佳努力”(不可靠)数据报的服务。<br>为了完成本周的实验，您将在一台计算机的内存中实现一个提供这种抽象的对象。(你可能在cs110中做过类似的事情。)字节写在“输入”端，也可以按相同的顺序从“输出”端读取。字节流是有限的:写入器可以结束输入，然后不能再写入任何字节。当读取器读取到流的末尾时，它将到达“EOF”(文件末尾)，并且不能再读取字节。<br>您的字节流也将被流控制，以限制其在任何给定时间的内存消耗。该对象被初始化为特定的“容量”:在任何给定点，它愿意在自己的内存中存储的最大字节数。字节流将限制写入器在任何给定时刻的写入量，以确保流不会超过其存储容量。当读取器读取字节并从流中耗尽它们时，写入器可以写入更多的字节。您的字节流用于单个线程—您不必担心并发的写/读、锁定或竞争条件。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>需要明确的是:字节流是有限的，但是在写入器结束输入并完成流之前，它几乎可以是任意长的4。您的实现必须能够处理比容量长得多的流。容量限制了给定点内存中(已写入但尚未读取)的字节数，但不限制流的长度。一个只有一个字节容量的对象仍然可以携带一个tb级和tb级长的流，只要写入器每次写入一个字节，并且在允许写入下一个字节之前读取器读取每个字节。</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":537,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-4-689x1024.png" alt="" class="wp-image-537"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>总结：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Lab0 要求我们实现一个<strong>在内存中的</strong>&nbsp;有序可靠字节流（有点类似于管道）</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>要求</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><li>字节流可以从<strong>写入端</strong>写入，并以<strong>相同的顺序</strong>，从<strong>读取端</strong>读取</li><li>字节流是有限的，写者可以终止写入。而读者可以在读取到字节流末尾时，产生EOF标志，不再读取。</li><li>所实现的字节流必须支持<strong>流量控制</strong>，以控制内存的使用。当所使用的缓冲区爆满时，将禁止写入操作。直到读者读取了一部分数据后，空出了一部分缓冲区内存，才让写者写入。</li><li>写入的字节流可能会很长，必须考虑到字节流大于缓冲区大小的情况。即便缓冲区只有1字节大小，所实现的程序也必须支持正常的写入读取操作。</li></ul>
<!-- /wp:list -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>在单线程环境下执行，因此不用考虑各类条件竞争问题。</p></blockquote>
<!-- /wp:quote -->

<!-- wp:paragraph -->
<p>这是在<strong>内存</strong>中的有序可靠字节流，接下来的实验会让我们在<strong>不可靠网络</strong>中实现一个这样的可靠字节流，而这便是<strong>传输控制协议（Transmission Control Protocol，TCP）</strong></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>//byte_stream.hh
#ifndef SPONGE_LIBSPONGE_BYTE_STREAM_HH
#define SPONGE_LIBSPONGE_BYTE_STREAM_HH

#include &lt;deque>
#include &lt;string>

//! \brief An in-order byte stream.

//! Bytes are written on the "input" side and read from the "output"
//  字节被写入“输入”端，并从“输出”端读取。
//! side.  The byte stream is finite: the writer can end the input,
//! and then no more bytes can be written.
//  字节流是有限的:写入器可以结束输入，然后不能再写入字节。
class ByteStream {
  private:
    // Your code here -- add private members as necessary.

    // Hint: This doesn't need to be a sophisticated data structure at
    // all, but if any of your tests are taking longer than a second,
    // that's a sign that you probably want to keep exploring
    // different approaches.
    /*
    这根本不需要是复杂的数据结构，但如果任何测试花费的时间超过一秒，
    这表明您可能想要继续探索不同的方法。
    */
    std::deque&lt;char> deque_;
    size_t capacity_size_;  //缓冲区的大小
    size_t written_size_;   //要写入的大小
    size_t read_size_;      //要读出去的大小
    bool end_input_;

    bool _error{};  //!&lt; Flag indicating that the stream suffered an error.

  public:
    //! Construct a stream with room for `capacity` bytes.
    ByteStream(const size_t capacity);

    //! \name "Input" interface for the writer
    //!@{

    //! Write a string of bytes into the stream. Write as many
    //! as will fit, and return how many were written.
    //! \returns the number of bytes accepted into the stream
    size_t write(const std::string &amp;data);

    //! \returns the number of additional bytes that the stream has space for
    size_t remaining_capacity() const;

    //! Signal that the byte stream has reached its ending
    void end_input();

    //! Indicate that the stream suffered an error.
    void set_error() { _error = true; }
    //!@}

    //! \name "Output" interface for the reader
    //!@{

    //! Peek at next "len" bytes of the stream
    //! \returns a string
    std::string peek_output(const size_t len) const;

    //! Remove bytes from the buffer
    void pop_output(const size_t len);

    //! Read (i.e., copy and then pop) the next "len" bytes of the stream
    //! \returns a string
    std::string read(const size_t len);

    //! \returns `true` if the stream input has ended
    bool input_ended() const;

    //! \returns `true` if the stream has suffered an error
    bool error() const { return _error; }

    //! \returns the maximum amount that can currently be read from the stream
    size_t buffer_size() const;

    //! \returns `true` if the buffer is empty
    bool buffer_empty() const;

    //! \returns `true` if the output has reached the ending
    bool eof() const;
    //!@}

    //! \name General accounting
    //!@{

    //! Total number of bytes written
    size_t bytes_written() const;

    //! Total number of bytes popped
    size_t bytes_read() const;
    //!@}
};

#endif  // SPONGE_LIBSPONGE_BYTE_STREAM_HH
</code></pre>
<!-- /wp:code -->

<!-- wp:code -->
<pre class="wp-block-code"><code>//byte_stream.cc
#include "byte_stream.hh"

// Dummy implementation of a flow-controlled in-memory byte stream.
// 内存中流控制字节流的虚拟实现

// For Lab 0, please replace with a real implementation that passes the
// automated checks run by `make check_lab0`.

// You will need to add private members to the class declaration in `byte_stream.hh`
// 您需要在' byte_stream.hh '的类声明中添加私有成员。

// template &lt;typename... Targs>
// void DUMMY_CODE(Targs &amp;&amp;... /* unused */) {}

using namespace std;

ByteStream::ByteStream(const size_t capacity)
    : deque_(), capacity_size_(capacity), written_size_(0), read_size_(0), end_input_(false), _error(false) {}

//! Write a string of bytes into the stream. Write as many
//! as will fit, and return how many were written.
//! \returns the number of bytes accepted into the stream
/*将一个字节串写入流。 写入尽可能多的内容，并返回已写入的内容。 返回流接受的字节数 */
size_t ByteStream::write(const string &amp;data) {
    // DUMMY_CODE(data);
    if (end_input_)
        return 0;
    size_t write_size = std::min(data.size(), capacity_size_ - deque_.size());
    written_size_ += write_size;
    for (size_t i = 0; i &lt; write_size; i++)
        deque_.push_front(data&#91;i]);
    return write_size;
}

//! \param&#91;in] len bytes will be copied from the output side of the buffer
string ByteStream::peek_output(const size_t len) const {
    // DUMMY_CODE(len);
    std::string res = "";
    size_t temp = len;
    auto it = deque_.rbegin();
    while (temp-- &amp;&amp; it != deque_.rend()) {
        res += (*it);
        it++;
    }

    return res;
}

//! \param&#91;in] len bytes will be removed from the output side of the buffer
void ByteStream::pop_output(const size_t len) {
    //  DUMMY_CODE(len);
    size_t temp = len;
    while (!deque_.empty() &amp;&amp; temp--) {
        deque_.pop_back();
        read_size_++;
    }
}

//! Read (i.e., copy and then pop) the next "len" bytes of the stream
//! \param&#91;in] len bytes will be popped and returned
//! \returns a string
std::string ByteStream::read(const size_t len) {
    // DUMMY_CODE(len);
    std::string res = this->peek_output(len);
    this->pop_output(len);
    return res;
}

// Signal that the byte stream has reached its ending
void ByteStream::end_input() { end_input_ = true; }

//! \returns `true` if the stream input has ended
bool ByteStream::input_ended() const { return end_input_; }

//! \returns the maximum amount that can currently be read from the stream
size_t ByteStream::buffer_size() const { return deque_.size(); }

//! \returns `true` if the buffer is empty
bool ByteStream::buffer_empty() const { return deque_.empty(); }

//! \returns `true` if the output has reached the ending
bool ByteStream::eof() const { return end_input_ &amp;&amp; deque_.empty(); }

//! Total number of bytes written
size_t ByteStream::bytes_written() const { return written_size_; }

//! Total number of bytes popped
size_t ByteStream::bytes_read() const { return read_size_; }

//! \returns the number of additional bytes that the stream has space for
size_t ByteStream::remaining_capacity() const { return capacity_size_ - deque_.size(); }
</code></pre>
<!-- /wp:code -->

<!-- wp:image {"id":539,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-6.png" alt="" class="wp-image-539"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->
