"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterRegistry() {
    const pathname = usePathname();
    const decommissionedNodes = ["/404", "/500"];
    const isDecommissioned = decommissionedNodes.includes(pathname);
    const isAdminRoute = pathname.startsWith("/admin");

    if (isDecommissioned || isAdminRoute) return null;

    return <Footer />;
}
