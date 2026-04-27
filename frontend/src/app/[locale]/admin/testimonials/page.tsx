"use client";

import { SimpleResourcePage, asReactNode } from "@/components/admin/SimpleResourcePage";

export default function AdminTestimonialsPage() {
  return (
    <SimpleResourcePage
      title="Testimonials"
      endpoint="/testimonials"
      columns={[
        { key: "name", header: "Author" },
        { key: "role", header: "Role" },
        { key: "company", header: "Company" },
        { key: "quote", header: "Quote", render: (r) => asReactNode(r.quote) },
      ]}
      fields={[
        { key: "name", label: "Author name", required: true },
        { key: "role", label: "Role" },
        { key: "company", label: "Company" },
        { key: "en", label: "Quote (EN)", nested: "quote", required: true },
        { key: "ar", label: "Quote (AR)", nested: "quote" },
        { key: "rating", label: "Rating (1-5)", type: "number" },
        { key: "order", label: "Order", type: "number" },
      ]}
    />
  );
}
