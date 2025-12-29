import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DAW from './components/DAW'

function App() {
  return (
    <BrowserRouter basename="/famous-ai-app">
      <Routes>
        <Route path="/" element={<DAW />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
