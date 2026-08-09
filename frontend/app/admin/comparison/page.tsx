"use client";

import ProtectedRoute from "@/lib/components/ProtectedRoute";
import AdminPage from "@/app/dpmd/comparison/page";

export default function Wrapped() {
  return (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  );
}

