"use client";

import { SimpleResourcePage } from "@/components/admin/SimpleResourcePage";

export default function AdminExperiencePage() {
  return (
    <SimpleResourcePage
      title="Experience"
      endpoint="/experience"
      columns={[
        { key: "company", header: "Company" },
        { key: "role", header: "Role" },
        { key: "start", header: "Start" },
        { key: "end", header: "End" },
      ]}
      fields={[
        { key: "company", label: "Company", required: true },
        { key: "role", label: "Role", required: true },
        { key: "start", label: "Start (e.g. Jan 2026)", required: true },
        { key: "end", label: "End (or 'Present')" },
        { key: "location", label: "Location" },
        { key: "order", label: "Order", type: "number" },
      ]}
    />
  );
}
