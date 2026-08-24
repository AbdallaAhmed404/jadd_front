import LegalPageTemplate from "@/components/LegalPageTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Operational guidelines and architectural service agreements.",
};

const TERMS_CONTENT = [
  {
    id: "01",
    title: "Code Architecture",
    content:
      'Scarabix specializes in bespoke digital artifacts. Once a project phase is "Inscribed in Code" (deployed), the engineering roadmap is locked to maintain structural integrity.',
  },
  {
    id: "02",
    title: "Project Lead Times",
    content:
      "Standard architectural drafting takes 10-14 business days. High-complexity deployments are scheduled based on system requirements and agency capacity.",
  },
  {
    id: "03",
    title: "Intellectual Property & Buyout",
    content:
      "Scarabix retains exclusive ownership of all source code and database schemas. Clients are granted a permanent usage license. Full transfer of the 'Source Artifact' (Original Code) is available for a buyout fee of 40% of the total project value.",
  },
  {
    id: "04",
    title: "Maintenance & Support",
    href: "/packages",
    content:
      "Each deployment includes a 90-day 'Stability Warranty' covering bug fixes and system calibration. Post-warranty support is offered via tiered packages: Hourly, Retainer (10hrs/mo), or 24/7 Mission-Critical monitoring.",
  },
  {
    id: "05",
    title: "Infrastructure & Hosting",
    content:
      "Systems optimized for Scarabix Managed Hosting ensure peak performance. If a client migrates to external infrastructure, Scarabix is absolved of liability regarding uptime, server-side latency, or security breaches.",
  },
  {
    id: "06",
    title: "System Latency (Client-Side)",
    content:
      "Project suspension occurs if client feedback exceeds a 14-day window. Resuming development requires a 'Re-activation Protocol' fee to re-allocate engineering resources.",
  },
  {
    id: "07",
    title: "Start-up Protocol (Deposit)",
    content:
      "To secure engineering resources and initiate architectural drafting, a fixed deposit of 25% of the total project valuation is required. This fee is non-refundable and serves as the official activation of the project roadmap.",
  },
];

export default function TermsPage() {
  return (
    <LegalPageTemplate title="Terms & Conditions" sections={TERMS_CONTENT} />
  );
}
