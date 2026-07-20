import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { protectedRoutes } from './routes/protectedRoutes'
import { publicRoutes } from './routes/publicRoutes'
import SelectMaterialsPage from '@/features/video/pages/SelectMaterialsPage'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes}
        {protectedRoutes}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route
  path="/video/materials"
  element={<SelectMaterialsPage />}
/>
      </Routes>
    </BrowserRouter>
  )
}
