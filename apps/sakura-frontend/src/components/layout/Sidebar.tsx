import { ProfileCard } from "@/components/sidebar/ProfileCard"
import { MusicPlayer } from "@/components/sidebar/MusicPlayer"

export function Sidebar() {
  return (
    <aside className="w-80 shrink-0">
      <ProfileCard />
      <MusicPlayer />
    </aside>
  )
} 