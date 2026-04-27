"use client";

import { SimpleResourcePage, asReactNode } from "@/components/admin/SimpleResourcePage";

export default function AdminNewsPage() {
  return (
    <SimpleResourcePage
      title="News & Blog"
      endpoint="/news"
      columns={[
        { key: "title", header: "Title", render: (r) => asReactNode(r.title) },
        { key: "published", header: "Status", render: (r) => (r.published ? "Published" : "Draft") },
        { key: "views", header: "Views" },
      ]}
      fields={[
        { key: "slug", label: "Slug", required: true },
        { key: "en", label: "Title (EN)", nested: "title", required: true },
        { key: "ar", label: "Title (AR)", nested: "title" },
        { key: "en", label: "Excerpt (EN)", nested: "excerpt", required: true },
        { key: "ar", label: "Excerpt (AR)", nested: "excerpt" },
        { key: "en", label: "Content (EN, markdown ok)", nested: "content", required: true },
        { key: "ar", label: "Content (AR)", nested: "content" },
      ]}
    />
  );
}
