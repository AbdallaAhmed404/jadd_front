import React from "react";
import ProjectDetailView from "@/src/components/admin/project-detail-view";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // STUB: Mocking deep project data for decoupled frontend
  const mockProject = {
    id: Number(id),
    title: "MOCK_PROJECT_" + id,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    client: { id: 1, name: "MOCK_CLIENT" },
    milestones: [],
    invoices: [],
    expenses: [],
    metadata: []
  };

  return (
    <div className="flex flex-col min-h-full bg-black">
      <ProjectDetailView project={mockProject as any} />
    </div>
  );
}
