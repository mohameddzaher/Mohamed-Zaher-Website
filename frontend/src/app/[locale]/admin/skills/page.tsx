"use client";

import { SimpleResourcePage } from "@/components/admin/SimpleResourcePage";

export default function AdminSkillsPage() {
  return (
    <SimpleResourcePage
      title="Skills"
      endpoint="/skills"
      columns={[
        { key: "name", header: "Skill" },
        { key: "category", header: "Track" },
        { key: "level", header: "Level" },
      ]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "category", label: "Category (engineering/business/leadership)", required: true },
        { key: "level", label: "Level (0-100)", type: "number" },
        { key: "order", label: "Order", type: "number" },
      ]}
    />
  );
}
