"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { UsersTable } from "@/components/dashboard/users-table";

export default function UsersPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Console"
        title="Users"
        description="Teammates own tasks. Everyone here is a real record in the TaskFlow API."
      />
      <UsersTable />
    </div>
  );
}
