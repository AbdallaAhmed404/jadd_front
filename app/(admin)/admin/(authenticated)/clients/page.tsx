import React from "react";
import ClientRegistry from "@/src/components/admin/client-registry";

export const dynamic = "force-dynamic";

export default function ClientsPage() {

  return (
    <div className="flex flex-col min-h-full bg-[#050505]">
      <ClientRegistry />
    </div>
  );
}
