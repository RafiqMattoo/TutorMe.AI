import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import SchoolsPage from './pages/schools/SchoolsPage'
import UsersPage from './pages/users/UsersPage'
import RolesPage from './pages/users/RolesPage'
import EnrollmentsPage from './pages/users/EnrollmentsPage'
import ArticlesPage from './pages/articles/ArticlesPage'
import ArticleFormPage from './pages/articles/ArticleFormPage'
import CategoriesPage from './pages/categories/CategoriesPage'
import { canAccess } from './auth/roles'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

function RoleRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user)
  const location = useLocation()
  return canAccess(user?.role, location.pathname) ? <>{children}</> : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<RoleRoute><DashboardPage /></RoleRoute>} />
          <Route path="schools" element={<RoleRoute><SchoolsPage /></RoleRoute>} />
          <Route path="users" element={<RoleRoute><UsersPage /></RoleRoute>} />
          <Route path="roles" element={<RoleRoute><RolesPage /></RoleRoute>} />
          <Route path="enrollments" element={<RoleRoute><EnrollmentsPage /></RoleRoute>} />
          <Route path="articles" element={<RoleRoute><ArticlesPage /></RoleRoute>} />
          <Route path="articles/new" element={<RoleRoute><ArticleFormPage /></RoleRoute>} />
          <Route path="articles/:id/edit" element={<RoleRoute><ArticleFormPage /></RoleRoute>} />
          <Route path="categories" element={<RoleRoute><CategoriesPage /></RoleRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
