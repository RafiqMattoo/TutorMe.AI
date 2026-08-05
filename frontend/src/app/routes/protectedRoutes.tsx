import type React from 'react'
import { Navigate, Route, useLocation } from 'react-router-dom'
import { canAccess } from '../../shared/auth/roles'
import { useAuthStore } from '../../shared/store/authStore'
import DashboardPage from '../../features/dashboard/pages/DashboardPage'
import DeliveriesPage from '../../features/deliveries/pages/DeliveriesPage'
import ExplainerPage from '../../features/explainer/pages/ExplainerPage'
import FlashcardsPage from '../../features/flashcards/pages/FlashcardsPage'
import StudyFlashcardsPage from '../../features/flashcards/pages/StudyFlashcardsPage'
import LessonPlanDetailPage from '../../features/lesson-plans/pages/LessonPlanDetailPage'
import LessonPlansPage from '../../features/lesson-plans/pages/LessonPlansPage'
import MaterialsPage from '../../features/materials/pages/MaterialsPage'
import QuizzesPage from '../../features/quizzes/pages/QuizzesPage'
import TakeQuizPage from '../../features/quizzes/pages/TakeQuizPage'
import RecitePage from '../../features/recite/pages/RecitePage'
import ScenesPage from '../../features/scenes/pages/ScenesPage'
import SchoolsPage from '../../features/schools/pages/SchoolsPage'
import SimpleBotPage from '../../features/simple-bot/pages/SimpleBotPage'
import StudentFormPage from '../../features/students/pages/StudentFormPage'
import StudentsPage from '../../features/students/pages/StudentsPage'
import TodayPage from '../../features/today/pages/TodayPage'
import TransportPage from '../../features/transport/pages/TransportPage'
import TutorPage from '../../features/tutor/pages/TutorPage'
import EnrollmentsPage from '../../features/users/pages/EnrollmentsPage'
import RolesPage from '../../features/users/pages/RolesPage'
import UsersPage from '../../features/users/pages/UsersPage'
import AdminLayout from '../../shared/components/layout/AdminLayout'
import AcademicStructurePage from '../../features/academics/pages/AcademicStructurePage'
import ApprovalsPage from '../../features/approvals/pages/ApprovalsPage'
import ArticleFormPage from '../../features/articles/pages/ArticleFormPage'
import ArticlesPage from '../../features/articles/pages/ArticlesPage'
import CategoriesPage from '../../features/categories/pages/CategoriesPage'
import VideosPage from '../../features/video/pages/VideoPage'
import VideoDescriptionPage from '../../features/video/pages/VideoDescriptionPage'
import AudioRecapPage from '@/features/audio-recap/pages/AudioRecapPage'
import CreateVideoPage from '@/features/video/pages/CreateVideoPage'
import SelectMaterialsPage from '@/features/video/pages/SelectMaterialsPage'


function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function RoleRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  return canAccess(user?.role, location.pathname) ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

export const protectedRoutes = (
  <Route
    path="/"
    element={
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    }
  >
    <Route path="video/materials" element={<RoleRoute><SelectMaterialsPage /></RoleRoute>} />
    <Route path="materials" element={<RoleRoute><MaterialsPage /></RoleRoute>} />
    <Route path="create-video" element={<RoleRoute><CreateVideoPage /></RoleRoute>} />
    <Route index element={<Navigate to="/dashboard" replace />} />
    <Route path="dashboard" element={<RoleRoute><DashboardPage /></RoleRoute>} />
    <Route path="today" element={<RoleRoute><TodayPage /></RoleRoute>} />
    <Route path="deliveries" element={<RoleRoute><DeliveriesPage /></RoleRoute>} />
    <Route path="schools" element={<RoleRoute><SchoolsPage /></RoleRoute>} />
    <Route path="approvals" element={<RoleRoute><ApprovalsPage /></RoleRoute>} />
    <Route path="users" element={<RoleRoute><UsersPage /></RoleRoute>} />
    <Route path="roles" element={<RoleRoute><RolesPage /></RoleRoute>} />
    <Route path="enrollments" element={<RoleRoute><EnrollmentsPage /></RoleRoute>} />
    <Route path="articles" element={<RoleRoute><ArticlesPage /></RoleRoute>} />
    <Route path="articles/new" element={<RoleRoute><ArticleFormPage /></RoleRoute>} />
    <Route path="articles/:id/edit" element={<RoleRoute><ArticleFormPage /></RoleRoute>} />
    <Route path="categories" element={<RoleRoute><CategoriesPage /></RoleRoute>} />

    <Route path="materials" element={<RoleRoute><MaterialsPage /></RoleRoute>} />


    <Route path="tutor" element={<RoleRoute><TutorPage /></RoleRoute>} />
    <Route path="simple-bot" element={<RoleRoute><SimpleBotPage /></RoleRoute>} />
    <Route path="flashcards" element={<RoleRoute><FlashcardsPage /></RoleRoute>} />
    <Route path="flashcards/:id/study" element={<RoleRoute><StudyFlashcardsPage /></RoleRoute>} />
    <Route path="quizzes" element={<RoleRoute><QuizzesPage /></RoleRoute>} />
    <Route path="quizzes/:id/take" element={<RoleRoute><TakeQuizPage /></RoleRoute>} />
    <Route path="recite" element={<RoleRoute><RecitePage /></RoleRoute>} />
    <Route path="explain" element={<RoleRoute><ExplainerPage /></RoleRoute>} />
    <Route path="video" element={<RoleRoute><VideosPage /></RoleRoute>} />
    <Route path="video/:id" element={<RoleRoute><VideoDescriptionPage /></RoleRoute>} />
    <Route path="scenes" element={<RoleRoute><ScenesPage /></RoleRoute>} />
    <Route path="academics" element={<RoleRoute><AcademicStructurePage /></RoleRoute>} />
    <Route path="students" element={<RoleRoute><StudentsPage /></RoleRoute>} />
    <Route path="students/new" element={<RoleRoute><StudentFormPage /></RoleRoute>} />
    <Route path="students/:id/edit" element={<RoleRoute><StudentFormPage /></RoleRoute>} />
    <Route path="transport" element={<RoleRoute><TransportPage /></RoleRoute>} />
    <Route path="lesson-plans" element={<RoleRoute><LessonPlansPage /></RoleRoute>} />
    <Route path="lesson-plans/:id" element={<RoleRoute><LessonPlanDetailPage /></RoleRoute>} />
    <Route path="audio-recap" element={<RoleRoute><AudioRecapPage /></RoleRoute>} />
 
  </Route>
);
