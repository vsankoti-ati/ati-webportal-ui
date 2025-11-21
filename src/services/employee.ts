import { api } from '@/lib/api';
import { mockEmployeeService } from './mockJobEmployeeData';

// Helper function to check if we should use mock data (evaluated at runtime)
const shouldUseMockData = () => {
  return process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
         (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL);
};

// Helper function to transform API response (snake_case) to Employee interface (camelCase)
const transformToEmployee = (apiEmployee: any): Employee => {
  return {
    id: apiEmployee.id,
    firstName: apiEmployee.firstName || apiEmployee.first_name,
    lastName: apiEmployee.lastName || apiEmployee.last_name,
    role: apiEmployee.role,
    emailId: apiEmployee.email || apiEmployee.email_id,
    addressLine1: apiEmployee.addressLine1 || apiEmployee.address_line_1,
    addressLine2: apiEmployee.addressLine2 || apiEmployee.address_line_2,
    city: apiEmployee.city,
    state: apiEmployee.state,
    zipCode: apiEmployee.zipCode || apiEmployee.zip_code,
    phoneNumber: apiEmployee.phoneNumber || apiEmployee.phone_number,
    hireDate: apiEmployee.hireDate || apiEmployee.hire_date,
    isActive: apiEmployee.isActive !== undefined ? apiEmployee.isActive : apiEmployee.is_active,
    comment: apiEmployee.comment,
    createdAt: apiEmployee.createdAt || apiEmployee.created_at,
    updatedAt: apiEmployee.updatedAt || apiEmployee.updated_at,
    roles: apiEmployee.roles ? apiEmployee.roles.map((role: any) => ({
      id: role.id,
      name: role.name,
      description: role.description,
    })) : [],
  };
};

// Helper function to transform CreateEmployeeDto (camelCase) to API format (snake_case)
const transformToApiFormat = (employee: Partial<CreateEmployeeDto>): any => {
  const apiFormat: any = {};
  
  if (employee.firstName !== undefined) apiFormat.first_name = employee.firstName;
  if (employee.lastName !== undefined) apiFormat.last_name = employee.lastName;
  if (employee.role !== undefined) apiFormat.role = employee.role;
  if (employee.emailId !== undefined) apiFormat.email_id = employee.emailId;
  if (employee.addressLine1 !== undefined) apiFormat.address_line_1 = employee.addressLine1;
  if (employee.addressLine2 !== undefined) apiFormat.address_line_2 = employee.addressLine2;
  if (employee.city !== undefined) apiFormat.city = employee.city;
  if (employee.state !== undefined) apiFormat.state = employee.state;
  if (employee.zipCode !== undefined) apiFormat.zip_code = employee.zipCode;
  if (employee.phoneNumber !== undefined) apiFormat.phone_number = employee.phoneNumber;
  if (employee.hireDate !== undefined) apiFormat.hire_date = employee.hireDate;
  if (employee.isActive !== undefined) apiFormat.is_active = employee.isActive;
  if (employee.comment !== undefined) apiFormat.comment = employee.comment;
  
  return apiFormat;
};

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  emailId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  hireDate: string;
  isActive: boolean;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  roles?: RoleDto[];
}

export interface RoleDto {
  id: number;
  name?: string;
  description?: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  role: string;
  emailId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  hireDate: string;
  isActive?: boolean;
  comment?: string;
}

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employees list');
      const mockData = await mockEmployeeService.getAll();
      return mockData.map(transformToEmployee);
    }
    const response = await api.get('/employees');
    return response.data.map(transformToEmployee);
  },

  async getProfile(): Promise<Employee> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employee profile');
      const mockData = await mockEmployeeService.getProfile();
      return transformToEmployee(mockData);
    }
    const response = await api.get('/employees/profile');
    return transformToEmployee(response.data);
  },

  async getById(id: string): Promise<Employee> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employee by ID');
      const mockData = await mockEmployeeService.getById(id);
      return transformToEmployee(mockData);
    }
    const response = await api.get(`/employees/${id}`);
    return transformToEmployee(response.data);
  },

  async getByEmail(email: string): Promise<Employee> {
    console.log('getByEmail called with:', email, 'shouldUseMockData:', shouldUseMockData());
    
    if (shouldUseMockData()) {
      console.log('Using mock data for employee by email');
      const allEmployees = await mockEmployeeService.getAll();
      const employee = allEmployees.find(emp => emp.email_id === email);
      if (!employee) {
        throw new Error(`Employee not found with email: ${email}`);
      }
      return transformToEmployee(employee);
    }
    
    console.log('Making API call to fetch employee by email');
    const response = await api.get(`/employees/email/${email}`);
    return transformToEmployee(response.data);
  },

  async create(employee: CreateEmployeeDto): Promise<Employee> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employee creation');
      const apiFormat = transformToApiFormat(employee);
      const mockData = await mockEmployeeService.create(apiFormat);
      return transformToEmployee(mockData);
    }
    const apiFormat = transformToApiFormat(employee);
    const response = await api.post('/employees', apiFormat);
    return transformToEmployee(response.data);
  },

  async update(id: string, employee: Partial<CreateEmployeeDto>): Promise<Employee> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employee update');
      const apiFormat = transformToApiFormat(employee);
      const mockData = await mockEmployeeService.update(id, apiFormat);
      return transformToEmployee(mockData);
    }
    const apiFormat = transformToApiFormat(employee);
    const response = await api.patch(`/employees/${id}`, apiFormat);
    return transformToEmployee(response.data);
  },

  async delete(id: string): Promise<void> {
    if (shouldUseMockData()) {
      console.log('Using mock data for employee deletion');
      return mockEmployeeService.delete(id);
    }
    await api.delete(`/employees/${id}`);
  },
};