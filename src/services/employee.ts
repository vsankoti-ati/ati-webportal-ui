import axios from 'axios';
import { mockEmployeeService } from './mockJobEmployeeData';

// Helper function to check if we should use mock data (evaluated at runtime)
const shouldUseMockData = () => {
  return process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
         (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL);
};

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL;

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  email_id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  hire_date: string;
  is_active: boolean;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeDto {
  first_name: string;
  last_name: string;
  role: string;
  email_id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  hire_date: string;
  is_active?: boolean;
  comment?: string;
}

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employees list');
      return mockEmployeeService.getAll();
    }
    const response = await axios.get(`${getApiUrl()}/employees`);
    return response.data;
  },

  async getProfile(): Promise<Employee> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employee profile');
      return mockEmployeeService.getProfile();
    }
    const response = await axios.get(`${getApiUrl()}/employees/profile`);
    return response.data;
  },

  async getById(id: number): Promise<Employee> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employee by ID');
      return mockEmployeeService.getById(id);
    }
    const response = await axios.get(`${getApiUrl()}/employees/${id}`);
    return response.data;
  },

  async create(employee: CreateEmployeeDto): Promise<Employee> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employee creation');
      return mockEmployeeService.create(employee);
    }
    const response = await axios.post(`${getApiUrl()}/employees`, employee);
    return response.data;
  },

  async update(id: number, employee: Partial<CreateEmployeeDto>): Promise<Employee> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employee update');
      return mockEmployeeService.update(id, employee);
    }
    const response = await axios.patch(`${getApiUrl()}/employees/${id}`, employee);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employee deletion');
      return mockEmployeeService.delete(id);
    }
    await axios.delete(`${getApiUrl()}/employees/${id}`);
  },
};