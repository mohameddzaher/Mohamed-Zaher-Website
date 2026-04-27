"use client";

import { SimpleResourcePage } from "@/components/admin/SimpleResourcePage";

export default function AdminCertificationsPage() {
  return (
    <SimpleResourcePage
      title="Certifications"
      endpoint="/certifications"
      columns={[
        { key: "name", header: "Name" },
        { key: "issuer", header: "Issuer" },
      ]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "issuer", label: "Issuer", required: true },
        { key: "credentialUrl", label: "Credential URL" },
        { key: "order", label: "Order", type: "number" },
      ]}
    />
  );
}
