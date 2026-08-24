import React from "react";
import DashboardSidebar from "@/src/components/admin/dashboard-sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  // const session = cookieStore.get("admin_session");

  // if (!session) {
  //   redirect("/admin/login");
  // }

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-scarab-gold selection:text-black">
      {/* GLOBAL ADMIN SIDEBAR */}
      <DashboardSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}
