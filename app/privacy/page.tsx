import LegalPageTemplate from "@/components/LegalPageTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Structural data integrity and privacy standards.",
};

const PRIVACY_CONTENT = [
  {
    id: "01",
    title: "Data Integrity",
    content:
      "We collect minimal technical parameters necessary for the deployment of bespoke web architectures. This includes diagnostic metadata and theme preferences required for sub-second rendering.",
  },
  {
    id: "02",
    title: "Database Encryption",
    content:
      "All database schemas and stored entities are protected by high-grade encryption protocols (At-Rest and In-Transit). Access is strictly restricted to authorized engineering personnel to maintain asset sanctity.",
  },
  {
    id: "03",
    title: "Project Artifacts",
    content:
      "The source code and assets shared during project cycles are stored on secure, encrypted edge servers. These artifacts are purged from development environments 90 days after project hand-off to ensure ultimate structural privacy.",
  },
  {
    id: "04",
    title: "Zero Third-Party Routing",
    content:
      "We do not sell metadata. Information is only processed through trusted infrastructure partners (Vercel, AWS) solely to ensure the high-availability of your digital legacy.",
  },
  {
    id: "05",
    title: "Liability & Compliance",
    content:
      "Scarabix provides the architectural framework; the client remains the sole legal 'Data Controller.' We assume no liability for the nature of the content or data end-users transmit through the deployed system.",
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageTemplate title="Privacy Policy" sections={PRIVACY_CONTENT} />
  );
}
