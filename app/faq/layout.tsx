import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Technical protocols and architectural inquiries.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
