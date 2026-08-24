import FinanceRegistry from "@/src/components/admin/finance-registry";
import { Invoice, Expense, Project, Client } from "@/src/types/backend";

export const dynamic = "force-dynamic";

export default async function FinancePage() {

  return (
    <div className="flex flex-col min-h-full bg-[#050505]">
      <FinanceRegistry 
      />
    </div>
  );
}
