import PlanningRegistry from "../../../../../src/components/admin/planning-registry";

export const dynamic = "force-dynamic";


export default async function PlanningPage() {

  return (
    <div className="flex flex-col min-h-full bg-[#050505]">
      <PlanningRegistry 
      />
    </div>
  );
}
