import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeView from './views/HomeView'
import AdminView from './views/AdminView'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </BrowserRouter>
  )
}
