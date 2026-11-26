"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "../../routes/ProtectedRoute";
import DashboardLayout from "../../layout/DashboardLayout";

export default function Layout({ children }) {
  // The sign-in page lives under /dashboard but must not be guarded.
  if (usePathname() === "/dashboard/login") return children;

  // The dashboard always uses the dark "portfolio" DaisyUI theme (tailwind.config.cjs).
  return (
    <div data-theme="portfolio" className="min-h-screen bg-base-100 text-base-content">
      <ProtectedRoute>
        <DashboardLayout>{children}</DashboardLayout>
      </ProtectedRoute>
    </div>
  );
}
