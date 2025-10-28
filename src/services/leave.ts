import axios from 'axios';
import { mockLeaveService } from './mockLeaveData';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Check if we should use mock data (same logic as auth)
const useMockData = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                    process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

export interface Leave {
  id: number;
  employee_id: number;
  leave_type: string;
  leave_balance: number;
  employee: {
    first_name: string;
    last_name: string;
    email_id: string;
  };
}

export interface LeaveApplication {
  id: number;
  employee_id: number;
  from_date: string;
  to_date: string;
  applied_date: string;
  status: string;
  comment?: string;
  employee: {
    first_name: string;
    last_name: string;
    email_id: string;
  };
}

export const leaveService = {
  // Leave balance endpoints
  async getLeaveBalance(employeeId: number): Promise<Leave[]> {
    if (useMockData) {
      console.log('Using mock data for leave balance');
      return mockLeaveService.getLeaveBalance(employeeId);
    }
    const response = await axios.get(`${API_URL}/leaves/employee/${employeeId}`);
    return response.data;
  },

  async updateLeaveBalance(id: number, leave: Partial<Leave>): Promise<Leave> {
    if (useMockData) {
      console.log('Using mock data for leave balance update');
      return mockLeaveService.updateLeaveBalance(id, leave);
    }
    const response = await axios.patch(`${API_URL}/leaves/${id}`, leave);
    return response.data;
  },

  // Leave application endpoints
  async getAllApplications(): Promise<LeaveApplication[]> {
    if (useMockData) {
      console.log('Using mock data for all applications');
      return mockLeaveService.getAllApplications();
    }
    const response = await axios.get(`${API_URL}/leave-applications`);
    return response.data;
  },

  async getEmployeeApplications(employeeId: number): Promise<LeaveApplication[]> {
    if (useMockData) {
      console.log('Using mock data for employee applications');
      return mockLeaveService.getEmployeeApplications(employeeId);
    }
    const response = await axios.get(`${API_URL}/leave-applications/employee/${employeeId}`);
    return response.data;
  },

  async createApplication(application: {
    employee_id: number;
    from_date: string;
    to_date: string;
    comment?: string;
  }): Promise<LeaveApplication> {
    if (useMockData) {
      console.log('Using mock data for application creation');
      return mockLeaveService.createApplication(application);
    }
    const response = await axios.post(`${API_URL}/leave-applications`, application);
    return response.data;
  },

  async updateApplicationStatus(
    id: number,
    update: { status: string; comment?: string }
  ): Promise<LeaveApplication> {
    if (useMockData) {
      console.log('Using mock data for application status update');
      return mockLeaveService.updateApplicationStatus(id, update);
    }
    const response = await axios.patch(`${API_URL}/leave-applications/${id}`, update);
    return response.data;
  },
};