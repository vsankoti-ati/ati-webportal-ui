import { Employee } from '../services/employee';

export interface Project {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Timesheet {
  id: number;
  employee_id: number;
  employee?: Employee;
  start_date: string;
  end_date: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submission_date?: string;
  approval_date?: string;
  approved_by_employee_id?: number;
  approved_by?: Employee;
  created_at: string;
  updated_at: string;
  time_entries?: TimeEntry[];
  approvals?: Approval[];
}

export interface TimeEntry {
  id: number;
  timesheet_id: number;
  project_id: number;
  project?: Project;
  entry_date: string;
  start_time: string;
  end_time: string;
  hours_worked: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Approval {
  id: number;
  timesheet_id: number;
  approver_employee_id: number;
  approver?: Employee;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_date?: string;
  comments?: string;
  created_at: string;
  updated_at: string;
}

// Interfaces for API requests
export interface CreateProjectDto {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status?: 'active' | 'completed' | 'on_hold' | 'cancelled';
}

export interface CreateTimesheetDto {
  start_date: string;
  end_date: string;
}

export interface CreateTimeEntryDto {
  project_id: number;
  entry_date: string;
  start_time: string;
  end_time: string;
  hours_worked: number;
  notes?: string;
}

export interface CreateApprovalDto {
  approval_status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}