import { ProfileCard } from '@/components/sidebar/ProfileCard'
import { MusicPlayer } from '@/components/sidebar/MusicPlayer'
import { TagCloud } from '@/components/sidebar/TagCloud'

export function Sidebar() {
    return (
        <aside className="w-80 shrink-0 space-y-6">
            <ProfileCard />
            <TagCloud />
            <MusicPlayer />
        </aside>
    )
}
