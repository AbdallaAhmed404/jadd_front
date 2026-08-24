import { Metadata } from "next";
import { serviceDetails } from "@/lib/services";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const service = serviceDetails[slug as keyof typeof serviceDetails];

  if (!service) {
    return {
      title: "Node Not Found",
    };
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export default function ServiceLayout({ children }: Props) {
  return <>{children}</>;
}
