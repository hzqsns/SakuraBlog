import { APlayer } from 'aplayer-react'
import 'aplayer/dist/APlayer.min.css'

export function MusicPlayer() {
    // 改回单个 audio 对象
    const audio = {
        name: 'Merry Christmas Mr. Lawrence',
        artist: '坂本龍一',
        url: 'https://music.163.com/song/media/outer/url?id=4899152.mp3', // 更新为本地文件路径
        cover: 'https://p1.music.126.net/woiqainQI-orV_RuUuOVRw==/716881581353216.jpg?param=130y130', // 确保提供了封面URL
        lrc: '' // 可选：LRC歌词内容
    }

    // 直接返回APlayer组件
    return (
        <APlayer
            audio={audio} // 使用单个 audio 对象
            theme="auto" // 让主题色根据封面自动调整
            autoPlay={true}
            volume={0.7}
            // 如果需要播放列表，则需要将 audio 设为数组
            // 参考文档：https://aplayer-react.js.org/docs/api
        />
    )
}
