---
title: CS144 Lab Checkpoint 3: the TCP sender
excerpt: '' 
author: Sakura
publishDate: '2023-06-29'
coverImage: 'https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/128707966_p0_master1200.jpg' 
slug: 'CS144-Lab3'
date: 2023-06-29 19:39:00
tags:
  - Network
category:
  - CS144
---

<!-- wp:heading -->
<h2>PDF总览</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":587,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-42-1024x825.png" alt="" class="wp-image-587"/><figcaption>建议：在实现之前阅读整个实验文件。 <br>在Lab0中，你实现了流控制的字节流（ByteStream）的抽象概念。<br>在Lab1和2中，你实现了将不可靠的数据报中携带的段转换为传入的字节流的工具：StreamReassembler和TCPReceiver。 <br>现在，在<strong>Lab</strong>3中，你将实现连接的另一端。TCPSender是一个工具，它将传出的字节流转换为段，成为不可靠数据报的有效载荷。<br>最后，在<strong>Lab</strong>4中，你将结合前几个实验的工作，创建一个工作的TCP实现：一个包含TCPSender和TCPReceiver的TCPConnection。你将用它来与互联网上的真实服务器对话。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":588,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-43-1024x614.png" alt="" class="wp-image-588"/><figcaption>环境配置，跟之前几个类似，这里不再赘述</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":589,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-44-1024x281.png" alt="" class="wp-image-589"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":590,"sizeSlug":"large","linkDestination":"none","className":"is-style-default"} -->
<figure class="wp-block-image size-large is-style-default"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-45-1024x720.png" alt="" class="wp-image-590"/><figcaption>TCP是一个协议，通过不可靠的数据报可靠地传递一对流量控制的字节流（每个方向一个）。两方参与TCP连接，每一方同时作为 "发送方"（其自身发出的字节流）和 "接收方"（传入的字节流）行事。这两方被称为连接的 "端点"，或 "对等体"。<br>本周，你将实现TCP的 "发送方 "部分，负责从ByteStream（由发送方应用程序创建并写入）中读取数据，并将该数据流转化为一连串发出的TCP段。在远端，一个TCP接收器1将这些段（那些到达的段--它们不一定都能到达）转回原始字节流，并将确认和窗口广告发回给发送方。<br>TCP发送方和接收方各自负责TCP段的一部分。TCP发送方写下TCPSegment中与实验2中的TCP接收方有关的所有字段：即序列号(seqno)、SYN标志、有效载荷(payload)和FIN标志。然而，TCP发送方只读取由接收方写入段中的字段：ackno和窗口大小。下面是一个TCP网段的结构，只强调了将由发送方读取的字段。<br>解释TCP Receiver：重要的是要记住，接收方可以是有效TCP接收方的任何实现<br>不一定是你自己的<strong>TCP Receiver</strong>。互联网标准有价值的一点是如何实现<br>它们在端点之间建立了一种公共语言，而在其他情况下，端点的行为可能非常不同。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":591,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-46-1024x848.png" alt="" class="wp-image-591"/><figcaption>这将会是TCPSender要做到的几件事：<br>1. 跟踪接收方的窗口（处理传入的acknos和窗口大小）。<br>2. 在可能的情况下，通过从ByteStream中读取，创建新的TCP段（如果需要的话，包括SYN和FIN标志），并发送它们，来填充窗口。<br>3. 跟踪已经发送但接收方尚未确认的片段——我们称这些片段为“未完成的”片段<br>4. 如果发送的片段经过了足够长的时间，并且尚未得到确认，则重新发送</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":592,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-47-1024x656.png" alt="" class="wp-image-592"/><figcaption>您的TCPSender将发送一组TCPsegments。每个将包含一个来自输出ByteStream的(可能是empty)子字符串，用序号进行索引以指示其在流中的位置，并在流的开始和末尾分别用SYN标志和FIN标志进行标记。<br>除了发送这些段之外，TCPSender还必须跟踪其未完成的段，直到它们所占用的序列号被完全确认为止。TCPSender的所有者将定期调用TCPSender的tick方法，以指示时间的流逝。TCPSender负责查看其未处理的tcpsegment集合，并决定最古老的发送段是否已处理过长时间而未得到确认(也就是说，未确认其所有序列号)。如果是，则需要重新传输(再次发送)。<br>Outstanding for too long：这些都是基于TCP“真正”规则的简化版本:RFC 6298，建议5.1到5.6。这里的版本稍微简化了一些，但是您的TCP实现仍然能够与Internet上的真实服务器进行通信<br>以下是关于 "未完成时间过长 "的规则。你要实现这个逻辑，它有点详细，但我们不希望你担心隐藏的测试用例试图绊倒你，或者把它当作SAT考试中的文字问题。本周我们会给你一些合理的单元测试，一旦你完成了整个TCP的实现，我们会在实验4中进行更全面的集成测试。只要你100%地通过这些测试，并且你的实现是合理的，你就会没事。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":593,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-48-1024x250.png" alt="" class="wp-image-593"/><figcaption>我为什么要这样做？总的目标是让发送方及时检测到段丢失并需要重新发送的情况。重发前的等待时间是很重要的：你不希望发件人等待太长时间来重发一个网段（因为这会延迟流向接收应用程序的字节），但你也不希望它重发一个如果发件人再等一会儿就会被确认的网段--那会浪费互联网的宝贵容量。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>规则</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":595,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-50-1024x201.png" alt="" class="wp-image-595"/><figcaption>每隔几毫秒，你的TCPSender的tick方法就会被调用一次，它的参数是告诉你自上次调用该方法以来已经过了多少毫秒。用这个来保持TCPSender活着的总毫秒数的概念。请不要试图从操作系统或CPU调用任何 "时间 "或 "时钟 "函数--tick方法是你对时间流逝的唯一访问。这样可以保持事情的确定性和可测试性。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":596,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-51-1024x173.png" alt="" class="wp-image-596"/><figcaption>当TCPSender被构建时，它被赋予一个参数，告诉它重传超时（RTO）的 "初始值"。RTO是在重新发送一个未完成的TCP段之前要等待的毫秒数。RTO的值会随时间变化，但 "初始值 "保持不变。启动代码将RTO的 "初始值 "保存在一个名为<br>_initial_retransmission_timeout的成员变量中</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":597,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-52-1024x141.png" alt="" class="wp-image-597"/><figcaption>你将实现重传定时器：一个可以在某个时间启动的警报，一旦RTO过了<strong>（或 "过期"）</strong>，警报就会响起。我们强调，这种时间流逝的概念来自于被调用的tick方法--而不是通过获取一天中的实际时间。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":598,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-53-1024x167.png" alt="" class="wp-image-598"/><figcaption>每次发送一个包含数据（序列空间中的非零长度）的段（不管是第一次还是重传），如果定时器没有运行，就启动它，使它在RTO毫秒后过期（对于RTO的当前值）。对于"过期"，我们的意思是，时间将在未来一定数量的毫秒内用完。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":599,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-54-1024x51.png" alt="" class="wp-image-599"/><figcaption>当所有未完成的数据都被确认时，停止重传定时器。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":600,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-55-1024x491.png" alt="" class="wp-image-600"/><figcaption>如果调用tick的时候重传计时器已经过期：<br>(a)重新发送尚未被TCP接收方完全确认的最早的（最低序列号）段。你需要在一些内部数据结构中存储未发送的段，以便能够做到这一点。<br>(b)如果窗口大小不为零：<br>(i)追踪连续重传的数量，并因为你刚刚重传了什么而增加它。你的TCPConnection将使用这些信息来决定连接是否无望（连续重传次数过多）并需要中止。<br>(ii)将RTO的值增加一倍。这被称为 "指数回退"--它在糟糕的网络上放慢了重传速度，以避免进一步堵塞工作。<br>(c)重置重传定时器并启动它，使其在RTO毫秒后失效（考虑到你可能刚刚把RTO的值增加了一倍！）。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":602,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-56-1024x280.png" alt="" class="wp-image-602"/><figcaption>当接收方给发送方一个确认成功收到新数据的ackno(该ackno反映了一个绝对的序列号，大于之前的任何ackno)：<br>（a）将RTO调回其 "初始值"。<br>（b）如果发送方有任何未完成的数据，重新启动重传定时器，使其在RTO毫秒后失效（对于RTO的当前值）。<br>（c）将 "连续重传 "的计数重设为零。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":603,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-57-1024x113.png" alt="" class="wp-image-603"/><figcaption>我们建议在一个单独的类中实现重传定时器的功能，但这取决于你。如果你这样做，请把它添加到现有的文件（tcp sender.hh和tcp sender.cc）中。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":604,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-58-1024x293.png" alt="" class="wp-image-604"/><figcaption>好了！我们已经讨论了TCP发送方所做的基本概念（给定一个传出的字节流（ByteStream），将其分割成若干段发送到接收方。我们已经讨论了TCP发送方所做工作的基本思路（给定一个传出的ByteStream，将其分割成若干段，发送给接收方，如果它们没有很快得到确认，就继续重发）。我们还讨论了何时得出结论，认为一个未完成的段丢失了，需要重新发送。<br>现在是你的TCPSender将提供的具体接口的时候了。有四个重要的事件需要它来处理，每一个事件都可能最终发送一个TCPSegment。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":605,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-59-1024x389.png" alt="" class="wp-image-605"/><figcaption>TCPSender被要求填满窗口：它从其输入的ByteStream中读取并以TCPSegments的形式发送尽可能多的字节，只要有新的字节被读取并且窗口中有可用空间。<br>你要确保你发送的每一个TCPSegment都完全适合在接收器的窗口内。使每个单独的TCPSegment尽可能大，但不能大于TCPConfig::MAX PAYLOAD SIZE（1452字节）所给的值。<br>你可以使用TCPSegment::length in sequence space()方法来计算一个段所占用的序列号的总数。记住，SYN和FIN标志也各占用一个序列号，这意味着它们在窗口中占用了空间。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":606,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-60-1024x283.png" alt="" class="wp-image-606"/><figcaption>如果窗口大小为零，我应该怎么做？如果接收方宣布窗口大小为零，填充窗口的方法应该像窗口大小为一一样。发送方最终可能会发送一个字节，被接收方拒绝（并且没有确认），但这也会激起接收方发送一个新的确认段，显示其窗口中已经打开了更多空间。如果没有这一点，发件人将永远不会知道它被允许再次开始发送。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":607,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-61-1024x207.png" alt="" class="wp-image-607"/><figcaption>从接收方收到一个段，传达窗口的新左（= ackno）和右（= ackno+窗口大小）边缘。TCPSender应该查看其未完成的段的集合，并删除任何现在已经被完全确认的段（ackno大于段中的所有序列号）。如果有新的空间被打开，TCPSender应该再次填充窗口</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":608,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-62-1024x118.png" alt="" class="wp-image-608"/><figcaption>时间已经过去了——从上次调用该方法到现在已经经过了一定的毫秒数。发送方可能需要重传未完成的段</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":609,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-63-1024x210.png" alt="" class="wp-image-609"/><figcaption>TCPSender应该生成并发送一个在序列空间中长度为零的TCPSegment，并且序列号设置正确。 如果所有者（你下周要实现的TCPConnection）想发送一个空的ACK段，这就很有用。<br>注意：像这样一个不占用序列号的段，不需要作为 "未完成 "来跟踪，也不会被重传。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":610,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-64-1024x126.png" alt="" class="wp-image-610"/><figcaption>为了完成实验3，请查看文档中的完整接口，网址是https://cs144.github.io/doc/lab3/class_t_c_p_sender.html，并在tcp sender.hh和tcp sender.cc文件中实现完整的TCPSender公共接口。我们希望你能添加私有方法和成员变量，可能还有一个辅助类。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":611,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-65-1024x299.png" alt="" class="wp-image-611"/><figcaption>为了测试你的代码，测试套件将期望它通过一系列的情况演变--从发送第一个 SYN 段，到发送所有数据，到发送 FIN 段，最后是 FIN 段被确认。我们认为你不需要制作更多的状态变量来跟踪这些 "状态"--这些状态只是由你的TCPSender类中已经暴露的公共接口所定义。但是为了帮助你理解测试结果，这里有一张TCPSender在流的生命周期中的预期演变图。(你不必担心错误状态或RST标志，直到Lab4）。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":612,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-66-1024x1014.png" alt="" class="wp-image-612"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2><strong>FAQs and special cases</strong></h2>
<!-- /wp:heading -->

<!-- wp:image {"id":613,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-67-1024x152.png" alt="" class="wp-image-613"/><figcaption>我如何 "发送 "一个片段？<br>把它推到片段输出队列中。就您的TCPSender而言，当您将它推入这个队列时，就认为它已经发送了。很快，所有者就会出现并弹出它(使用公共分段out()访问器方法)并真正发送它。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":614,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-68-1024x303.png" alt="" class="wp-image-614"/><figcaption>等等，我如何既“发送”一个段，又跟踪该段作为未完成的，这样我就知道以后要重传什么了?我不是要把每个片段都复印一份吗?那是浪费吗?<br>当您发送一个包含数据的段时，您可能希望将它推入段输出队列，并在一个数据结构中保留它的内部副本，以便跟踪未完成的segment，以备可能的重传。这并不是很浪费，因为segment的有效负载被存储为引用计数的只读字符串(Buffer对象)。所以不要担心它——它实际上并没有复制有效载荷数据。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":615,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-69-1024x130.png" alt="" class="wp-image-615"/><figcaption>在我从接收方获得一个ACK之前，我的TCPSender应该假设接收方的窗口大小是多少?<br>1个字节</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":616,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-70-1024x177.png" alt="" class="wp-image-616"/><figcaption>如果一个ACK只部分确认某些未完成的部分，我该怎么办?我应该试着剪掉被确认的字节吗?<br>TCP发送方可以做到这一点，但出于该类的目的，不需要太花哨。在它被完全确认之前(它所占用的所有序列号都小于ackno)，将每个segment视为未完全确认</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":617,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-71-1024x213.png" alt="" class="wp-image-617"/><figcaption>如果我发送了包含“a”、“b”和“c”的三个单独的段，并且它们从未得到确认，我以后可以在包含“abc”的一个大段中重新发送它们吗?还是我必须分别重传每个片段?<br>同样:TCP发送方可以做到这一点，但出于该类的目的，不需要太花哨。只需单独跟踪每个未完成的段，当重传计时器到期时，再次发送最早的未完成段。</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"id":619,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-72-1024x208.png" alt="" class="wp-image-619"/><figcaption>我是否应该在我的“未完成的”数据结构中存储空段，并在必要时重新传输它们?<br>不，唯一应该被跟踪为未完成的，可能被重传的片段，是那些传递了一些数据的片段。在序列空间中消耗了一定的长度。不占用序列号(没有有效负载、SYN或FIN)的段不需要被记住或重传</figcaption></figure>
<!-- /wp:image -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2>正式分析实验</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>阅读了一遍PDF我们可以粗略的知道了，Lab3的主要目的就是让我们实现一个TCP Sender</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":584} -->
<figure class="wp-block-image"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-40-1024x580.png" alt="" class="wp-image-584"/><figcaption>时刻牢记住这个图，这个图就是整个CS144的核心</figcaption></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>fill_window</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>TCPSender从Bytesteam中读取数据，然后以TCPSegments的形式发送尽可能多的字节，但是每个TCP段的大小都不能超过TCPConfig::MAX PAYLOAD SIZE(1452字节)（此时尚未发送）<ul><li>所以我们当_current_window_size > _besent_but_not_ack_bytes就一直重复发送数据，直到把窗口填满为止<ul><li>每个TCPSegment的payload都不能大于<strong>TCPConfig::MAX PAYLOAD SIZE(1452字节)</strong>，但同时此时能装下的payload还要和当前窗口进行比较，当前窗口的大小减去已经发送出去的数据大小同时还得判断当前包的header是否有SYN，如果有的话SYN也要占一个字节，那么对应的payload就是_current_window_size - _besent_but_not_ack_bytes - (_segment.header().syn ? 1 : 0)</li><li>注意此时虽然确定了最大能装的payload的大小，但是我们因为是从bytesteam里面去读取的字节，所以最后能装多少到payload里面还得由bytesteam能够read多少出来所决定，即string _payload = _stream.read(_payload_size);</li><li>那么我们此时还得判断是否字节流读取到了EOF，如果到了末尾，那么我们还需要在header前面加入FIN标志，首先我们得判断payload是否装满了，因为还要留出一个字节给FIN标志<ul><li>如果已经满了，那么此时就不能再继续装入</li><li>只能等下一个包再装入FIN</li></ul></li></ul></li><li>对于这个循环我们同样需要设置循环结束的条件<ul><li>一个就是如果当我们要发送的_segment如果没有任何数据，那么此时应该结束循环，因为此时虽然<strong>_current_window_size > _besent_but_not_ack_bytes</strong>，但是此时bytesteam已经读取不出来数据了，这个时候同样要结束循环</li><li>其次就是如果我们设置了FIN包的时候，我们同样需要结束这个发送包的循环</li></ul></li><li>需要注意的点<ul><li><strong>如果此时没有正在等待ACK回应的包</strong><ul><li>那么此时我们应该重新把RTO设置成初始的值<ul><li>即_RTO = _initial_retransmission_timeout，</li><li>如果不重置RTO的话，那么我们如果遇到网络拥挤的情况RTO的值会越来越大，但是网络拥挤完同样会变成宽松的状态，此时的RTO如果仍然维持一个比较大的值的话就会造成各种segment包超时</li></ul></li><li><strong>我们得把超时时间重新设置为0，_timecount = 0</strong><ul><li>因为如果没有等待ack的包的话，那么就不需要包需要统计超时的时间了，那么此时我们同样应该重置超时的时间</li></ul></li></ul></li><li>发送之后我们需要把_segment插入到等待ack的数据结构中，同时_besent_but_not_ack_bytes += _segment.length_in_sequence_space();</li><li>同时在发送完毕之后我们得更新下一个绝对seqno的值是多少以便下一个包的header使用，即_next_seqno += _segment.length_in_sequence_space();</li><li>如果接收方给的window_size为0的话，我们需要按照接收方的window_size为1去处理，因为为0的话就不会往接收方发送数据了，但是如果当做1来看待，这样我们会继续给接收方发送包，然后就起到了相当于轮询的效果，否则如果两者不通信，那么接收方的window_size重新变大的时候发送方根本就不知道这个消息。</li></ul></li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>代码如下</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>//! \brief create and send segments to fill as much of the window as possible
//         创建和发送段以尽可能多地填充窗口

/*
    TCPSender被要求填满窗口：它从其输入的ByteStream中读取并以TCPSegments的形式发送尽可能多的字节
    只要有新的字节被读取并且窗口中有可用空间。
    你要确保你发送的每一个TCPSegment都完全适合在接收器的窗口内。
    使每个单独的TCPSegment尽可能大，但不能大于TCPConfig::MAX PAYLOAD SIZE（1452字节）所给的值。
    你可以使用TCPSegment::length in sequence space()方法来计算一个段所占用的序列号的总数。
    记住，SYN和FIN标志也各占用一个序列号，这意味着它们在窗口中占用了空间。
*/
void TCPSender::fill_window() {
    //如果接收方接收的窗口为0的话，我们仍然设置发送窗口大小为1
    size_t _current_window_size = _latest_window_size ? _latest_window_size : 1;

    while (_current_window_size > _besent_but_not_ack_bytes) {
        TCPSegment _segment;
        //判断是否发过SYN包
        if (!_set_syn_flag) {
            //如果没发过就设置当前包的SYN标志为true
            _set_syn_flag = true;
            _segment.header().syn = true;
        }
        // 设置包的seqno
        // _segment.header().seqno = wrap(_next_seqno,_isn);
        //
        // 因为 WrappingInt32 next_seqno() const { return wrap(_next_seqno, _isn); }
        // 上下两种写法是等价的
        _segment.header().seqno = next_seqno();

        // 设置payload
        size_t _payload_size = min(TCPConfig::MAX_PAYLOAD_SIZE,
                                   _current_window_size - _besent_but_not_ack_bytes - (_segment.header().syn ? 1 : 0));
        string _payload = _stream.read(_payload_size);

        // 设置好payload之后，查看是否要加入fin
        // 首先判断是否从来未加入fin
        if (!_set_fin_flag) {
            // 然后再判断是否字节流读取到了EOF
            if (_stream.eof()) {
                //这个时候判断是否还有空间加入fin这一个字节
                if (_payload.size() + _besent_but_not_ack_bytes &lt; _current_window_size) {
                    _set_fin_flag = true;
                    _segment.header().fin = true;
                }
            }
        }

        _segment.payload() = Buffer(move(_payload));
        // 如果没有任何数据，则停止数据包的发送
        if (_segment.length_in_sequence_space() == 0)
            break;

        //如果没有正在等待ack的数据包，那我们重新设置超时时间
        if (_outgoing_mp.empty()) {
            _RTO = _initial_retransmission_timeout;
            _timecount = 0;
        }

        //发送
        _segments_out.push(_segment);

        //发送的同时得增加数据
        _besent_but_not_ack_bytes += _segment.length_in_sequence_space();
        _outgoing_mp.insert({_next_seqno, _segment});

        //更新下一个绝对seqno
        _next_seqno += _segment.length_in_sequence_space();

        if (_set_fin_flag) {
            break;
        }
    }
}</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>ack_received</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>对于接收方返回的ackno和window_size进行处理，如果整个包最右边的数据都已经确认完毕，那么我们就应该从追踪是否ACK的数据结构中删除掉要追踪的包，同时如果此时还存在空闲的空间的话，继续发包(fill_window)<ul><li>首先我们应该把传入的seqno变成absolute_seqno</li><li>然后我们需要判断不合理的条件，如果接收到的<strong>absolute_seqno</strong>比我们尚未发送的_next_seqno还要大的话说明接收到的是有问题的ack，此时直接return</li><li>然后我们去查看我们已经发送出去但尚未确认所追踪的TCP包的数据结构<ul><li>如果对应TCPSegment的右边也被完全确认的话<ul><li>此时从数据结构中清除掉这个<strong>TCPSegment</strong></li><li>_besent_but_not_ack_bytes减去这个<strong>TCPSegment</strong>的长度即减去_tmp_segment.length_in_sequence_space()</li><li>同时把RTO调回初始值，然后超时时间也重新开始计算，为什么要这么做呢，因为把能确认的<strong>TCPSegment</strong>都确认完毕之后我们得重新发包，重新发包就得重置RTO和超时时间了</li></ul></li><li>最后我们需要把全局的窗口大小设置为这个接收方传过来的窗口大小，即_latest_window_size = window_size;</li><li>然后再重新发包，fill_window();</li></ul></li></ul></li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>代码如下</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>//! \param ackno The remote receiver's ackno (acknowledgment number)
//               远程接收者的ackno(确认号)
//! \param window_size The remote receiver's advertised window size
//                     远程接收者的通告窗口大小
// 1. TCPSender应该查看其未完成的段的集合
//   1.1 并删除任何现在已经被完全确认的段（ackno大于段中的所有序列号）。
//   1.2 如果有新的空间被打开，TCPSender应该再次填充窗口
// 2. 当接收方给发送方一个确认成功收到新数据的ackno(该ackno反映了一个绝对的序列号，大于之前的任何ackno)：
// （a）将RTO调回其 "初始值"。
// （b）如果发送方有任何未完成的数据，重新启动重传定时器，使其在RTO毫秒后失效（对于RTO的当前值）。
// （c）将 "连续重传 "的计数重设为零。
void TCPSender::ack_received(const WrappingInt32 ackno, const uint16_t window_size) {
    // DUMMY_CODE(ackno, window_size);
    size_t _absolute_seqno = unwrap(ackno, _isn, _next_seqno);

    //如果想接收的绝对absolute_seq比我们尚未发送出去的_next_seqno还要大的话说明这个ack有问题
    if (_absolute_seqno > _next_seqno)
        return;
    // 1.查看未完成段的集合
    auto it = _outgoing_mp.begin();
    for (; it != _outgoing_mp.end();) {
        TCPSegment _tmp_segment = it->second;
        //如果这个段被完全确认的话
        if (it->first + _tmp_segment.length_in_sequence_space() &lt;= _absolute_seqno) {
            // 1.1 删除任何现在已经被完全确认的段（ackno大于段中的所有序列号）
            _besent_but_not_ack_bytes -= _tmp_segment.length_in_sequence_space();
            it = _outgoing_mp.erase(it);
            // 2. 接收成功
            // 2-a 将RTO调回其 "初始值"
            _RTO = _initial_retransmission_timeout;
            // 超时时间也重新开始计算
            _timecount = 0;

        } else {
            break;
        }
    }

    // 2-c 将 "连续重传 "的计数重设为零。
    _consecutive_retransmissions_times = 0;

    // 1.2 如果有新的空间被打开，TCPSender应该再次填充窗口
    _latest_window_size = window_size;
    fill_window();
}</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>Tick</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>这个函数被用来调用指示经过的时间长度，因为我们不能使用任意的系统时间</li><li>tick的参数ms_since_last_tick就是告诉你了经过上次调用tick之后又过了多少时间</li><li>所以我们在全局设置一个参数来记录这个时间即可，因为我们设置的是超时时间，所以我们每次直接用_timecount += ms_since_last_tick即可</li><li>有一个点需要在这里说的就是，为什么我们这里用超时时间，而不是全局用一个时间来记录，我之前也想过，但是如果用一个全局时间来记录的话，然后每次发送一个数据包就再额外记录一个时间，这样子那个RTO的值就不好判断了，你每次tick判断是否超时的时候，如果B包超时了RTO就要增大，但是你下一个tick的时候就要用这个两倍的RTO去判断是否超时了，但是A包对应的RTO仍然是之前那个没有变过的RTO，就这个会变得更麻烦，所以我就只用一个超时时间_timecount来判断是否超时了</li><li>如果此时_timecount > _RTO，说明此时超时了，如果此时窗口大小不为0的话说明是网络拥塞导致，此时RTO的值应该变为2倍，然后重置超时时间，重新发送这个包，同时连续重传的次数+1</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>代码如下</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>//! \param&#91;in] ms_since_last_tick the number of milliseconds since the last call to this method
//                                自最后一次调用此方法以来的毫秒数
void TCPSender::tick(const size_t ms_since_last_tick) {
    // DUMMY_CODE(ms_since_last_tick);
    //更新时间
    _timecount += ms_since_last_tick;

    //然后再查看是否有超时的段
    auto it = _outgoing_mp.begin();
    if (it != _outgoing_mp.end() &amp;&amp; _timecount >= _RTO) {
        //如果此时窗口大小不为0，说明是网络拥塞导致，此时RTO的值变为两倍
        if (_latest_window_size > 0)
            _RTO *= 2;
        //重置时间
        _timecount = 0;
        _segments_out.push(it->second);
        _consecutive_retransmissions_times++;
    }
}</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>send_empty_segment</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>生成并发送一个在seq空间中长度为0的空数据包，用于发送一个空的ACK段</li></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>代码如下</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>//! \brief Generate an empty-payload segment (useful for creating empty ACK segments)
//         生成空的有效负载段(用于创建空的ACK段)
void TCPSender::send_empty_segment() {
    TCPSegment _tcpsegment;
    _tcpsegment.header().seqno = next_seqno();
    _segments_out.push(_tcpsegment);
}
</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2>实验结果</h2>
<!-- /wp:heading -->

<!-- wp:image {"id":622,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="http://106.14.114.97/wp-content/uploads/2022/09/image-73.png" alt="" class="wp-image-622"/></figure>
<!-- /wp:image -->