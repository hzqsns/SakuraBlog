import { Layout } from '@/components/layout/Layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { Friends } from '@/pages/Friends'
import { Archive } from '@/pages/Archive'

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/archive" element={<Archive />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
