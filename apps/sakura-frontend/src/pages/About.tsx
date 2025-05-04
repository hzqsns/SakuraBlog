import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function About() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>关于我</CardTitle>
            </CardHeader>
            <CardContent>
                <p>这是关于我的页面内容。</p>
            </CardContent>
        </Card>
    )
}
