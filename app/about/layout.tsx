import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the Sons of the First Engineers architecting the next legacy.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
