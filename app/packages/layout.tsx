import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages",
  description: "Bespoke digital architecture and maintenance tiers for long-term scaling.",
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
