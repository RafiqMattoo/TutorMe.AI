import { Route } from 'react-router-dom'
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";

export const publicRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
  
    <Route path="/register" element={<RegisterPage />} />
  </>
)

