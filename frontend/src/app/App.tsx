import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { protectedRoutes } from "./routes/protectedRoutes";
import { publicRoutes } from "./routes/publicRoutes";
import { Toaster } from 'react-hot-toast'


export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {publicRoutes}
        {protectedRoutes}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}