/**
 * SCARABIX Backend Type Definitions
 * These types are extracted from the Prisma schema to support a decoupled architecture.
 */

// ============================================================
//  SYSTEM ENUMS
// ============================================================

export type UserRole = 'ADMIN' | 'SUPERADMIN';
export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

// ============================================================
//  MODELS
// ============================================================

export interface TeamMember {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  status: string;
  isActive: boolean;
  lastSeen?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  status: ClientStatus;
  notes?: string | null;
  isArchived: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  projects?: Project[];
}

export interface Project {
  id: number;
  clientId: number;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  budget?: number | string | null;
  projectNote?: string | null;
  isArchived: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  client?: Client;
  invoices?: Invoice[];
  expenses?: Expense[];
  milestones?: Milestone[];
  tasks?: Task[];
  metadata?: ProjectMetadata[];
}

export interface ProjectMetadata {
  id: number;
  projectId: number;
  environment: string;
  url?: string | null;
  username?: string | null;
  password?: string | null;
  notes?: string | null;
  updatedAt: Date | string;
  project?: Project;
}

export interface Milestone {
  id: number;
  projectId: number;
  title: string;
  description?: string | null;
  dueDate?: Date | string | null;
  status: MilestoneStatus;
  isArchived: boolean;
  createdAt: Date | string;
  project?: Project;
  tasks?: Task[];
}

export interface Task {
  id: number;
  projectId: number;
  milestoneId?: number | null;
  assignedMemberId?: number | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | string | null;
  estimatedHrs?: number | string | null;
  isArchived: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  project?: Project;
  milestone?: Milestone | null;
  assignedMember?: TeamMember | null;
  timeLogs?: TimeLog[];
}

export interface TimeLog {
  id: number;
  taskId: number;
  memberId: number;
  hoursLogged: number | string;
  dateLogged: Date | string;
  notes?: string | null;
  createdAt: Date | string;
  task?: Task;
  member?: TeamMember;
}

export interface Invoice {
  id: number;
  projectId: number;
  invoiceNumber: string;
  amount: number | string;
  currency: string;
  status: InvoiceStatus;
  issueDate: Date | string;
  dueDate: Date | string;
  paidDate?: Date | string | null;
  createdAt: Date | string;
  project?: Project;
}

export interface Expense {
  id: number;
  projectId?: number | null;
  category: string;
  amount: number | string;
  currency: string;
  dateIncurred: Date | string;
  description?: string | null;
  createdAt: Date | string;
  project?: Project | null;
}

export interface AuditLog {
  id: number;
  tableName: string;
  recordId: number;
  action: string;
  memberId?: number | null;
  changeDate: Date | string;
  oldValues?: any;
  newValues?: any;
  member?: TeamMember | null;
}
