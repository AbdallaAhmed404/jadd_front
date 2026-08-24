import TimeLogRegistry from "@/src/components/admin/time-log-registry";
import { TimeLog, Task, TeamMember, Project } from "@/src/types/backend";

export const dynamic = "force-dynamic";

type TimeLogWithData = TimeLog & { 
  task: Task & { project: Project }, 
  member: TeamMember 
};

export default async function TimeLogsPage() {
  // STUB: Empty data for decoupled frontend
  const logs: TimeLogWithData[] = [];
  const tasks: (Task & { project: Project })[] = [];
  const members: TeamMember[] = [];

  return (
    <div className="flex flex-col min-h-full bg-[#050505]">
      <TimeLogRegistry 
        initialLogs={logs}
        tasks={tasks}
        members={members}
      />
    </div>
  );
}
