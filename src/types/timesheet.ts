import { Employee } from '../services/employee';

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Timesheet {
  id: number;
  employeeId: string;
  employee?: Employee;
  startDate: string;
  endDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submissionDate?: string;
  approvalDate?: string;
  approvedByEmployeeId?: string;
  approvedBy?: Employee;
  createdAt: string;
  updatedAt: string;
  timeEntries?: TimeEntry[];
  approvals?: Approval[];
}

export interface TimeEntry {
  id: number;
  timesheetId: number;
  projectId: number;
  project?: Project;
  entryDate: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Approval {
  id: number;
  timesheetId: number;
  approverEmployeeId: string;
  approver?: Employee;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedDate?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

// Interfaces for API requests
export interface CreateProjectDto {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status?: 'active' | 'completed' | 'on_hold' | 'cancelled';
}

export interface CreateTimesheetDto {
  employeeId: string;
  startDate: string;
  endDate: string;
}

export interface CreateTimeEntryDto {
  projectId: number;
  entryDate: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  notes?: string;
}

export interface CreateApprovalDto {
  approvalStatus: 'pending' | 'approved' | 'rejected';
  comments?: string;
}