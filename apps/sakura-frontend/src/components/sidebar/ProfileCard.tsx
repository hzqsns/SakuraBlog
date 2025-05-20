import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

export function ProfileCard() {
    return (
        <Card className="mb-6">
            <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage
                        src="https://pub-07075d3d3f844b7cac01396dfa381361.r2.dev/b_889229ddd4fd1373a0a9ef5a8f18f64b.jpg"
                        alt="头像"
                    />
                    <AvatarFallback>Sakura</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold mb-1">Sakura</h3>
                <p className="text-sm text-gray-500 mb-4">浊以静之徐清，安以动之徐生</p>
                <div className="flex gap-2">
                    <Link
                        to="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors 
              bg-white hover:bg-gray-100 border border-gray-300 hover:border-gray-400
              shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
              active:translate-y-0.5 active:shadow-none"
                    >
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
                            className="h-4 w-4 mr-1"
                        >
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                        推特
                    </Link>
                    <Link
                        to="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors 
              bg-white hover:bg-gray-100 border border-gray-300 hover:border-gray-400
              shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
              active:translate-y-0.5 active:shadow-none"
                    >
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
                            className="h-4 w-4 mr-1"
                        >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                            <path d="M9 18c-4.51 2-5-2-7-2"></path>
                        </svg>
                        GitHub
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
