import { createBrowserRouter } from "react-router";
import LandingPage from "./features/landing/LandingPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import DashboardLayout from "./features/dashboard/DashboardLayout";
import OverviewPage from "./features/dashboard/pages/OverviewPage";
import ScanPage from "./features/dashboard/pages/ScanPage";
import HistoryPage from "./features/dashboard/pages/HistoryPage";
import DiagnosisDetailPage from "./features/dashboard/pages/DiagnosisDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "scan", element: <ScanPage /> },
      { path: "history", element: <HistoryPage /> },
      { path: "diagnosis/:id", element: <DiagnosisDetailPage /> },
    ],
  },
]);