// 添加global对象的polyfill，解决@vitalets/google-translate-api在浏览器中的兼容性问题
window.global = window

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/markdown.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
