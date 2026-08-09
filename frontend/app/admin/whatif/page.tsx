"use client";

import ProtectedRoute from "@/lib/components/ProtectedRoute";
import AdminPage from "@/app/dpmd/whatif/page";

export default function Wrapped() {
  return (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  );
}

