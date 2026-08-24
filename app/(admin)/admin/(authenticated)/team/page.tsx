import React from "react";
import AdminRegistry from "@/src/components/admin/admin-registry";

export const dynamic = "force-dynamic";

export default function UsersPage() {

  return (
    <div className="flex flex-col min-h-full bg-[#050505]">

      <div >
        <AdminRegistry 
        />
      </div>
    </div>
  );
}
