"use client";

import { SimpleResourcePage, asReactNode } from "@/components/admin/SimpleResourcePage";

export default function AdminVenturesPage() {
  return (
    <SimpleResourcePage
      title="Ventures"
      endpoint="/ventures"
      columns={[
        { key: "name", header: "Name" },
        { key: "role", header: "Role" },
        { key: "category", header: "Category" },
        { key: "url", header: "URL", render: (r) => asReactNode(r.url) },
      ]}
      fields={[
        { key: "slug", label: "Slug", required: true },
        { key: "name", label: "Name", required: true },
        { key: "role", label: "Role", required: true },
        { key: "en", label: "Description (EN)", nested: "description", required: true },
        { key: "ar", label: "Description (AR)", nested: "description" },
        { key: "url", label: "URL" },
        { key: "category", label: "Category (Tech/E-Commerce/Logistics/Consulting/Founded)", required: true },
        { key: "accent", label: "Accent (brand|violet)" },
        { key: "order", label: "Order", type: "number" },
      ]}
    />
  );
}
