"use client";

import React from "react";
import BlogsPage from "../../../page/blogs/Blogs";
import ProtectedRoute from "../../../routes/ProtectedRoute";

export default function Blogs() {
  return (
    <ProtectedRoute>
      <BlogsPage />
    </ProtectedRoute>
  );
}
