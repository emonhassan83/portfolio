"use client";

import React from "react";
import ProtectedRoute from "../../routes/ProtectedRoute";
import DashboardLayout from "../../layout/DashboardLayout";

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
