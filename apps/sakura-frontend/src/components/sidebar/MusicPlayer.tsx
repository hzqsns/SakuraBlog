import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function MusicPlayer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">音乐播放器</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <img
            src="https://via.placeholder.com/150"
            alt="专辑封面"
            className="h-40 w-40 rounded-md mb-4 object-cover"
          />
          <h4 className="font-medium">歌曲名称</h4>
          <p className="text-sm text-gray-500 mb-4">歌手名</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
            <div className="bg-primary h-1.5 rounded-full w-1/3"></div>
          </div>
          <div className="flex justify-between w-full text-xs text-gray-500">
            <span>1:23</span>
            <span>3:45</span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button size="icon" variant="ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </Button>
            <Button size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
            </Button>
            <Button size="icon" variant="ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 