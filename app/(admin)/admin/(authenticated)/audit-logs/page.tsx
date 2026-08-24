import AuditLogRegistry from "../../../../../src/components/admin/audit-log-registry";
import { AuditLog, TeamMember } from "@/src/types/backend";

export const dynamic = "force-dynamic";

type AuditWithMember = AuditLog & { member: TeamMember | null };

export default async function AuditLogsPage() {
  const logs: AuditWithMember[] = [];

  return (
    <div className="flex flex-col min-h-full bg-[#050505]">
      <AuditLogRegistry initialLogs={logs as AuditWithMember[]} />
    </div>
  );
}
