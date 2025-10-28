import axios from 'axios';
import { employeeService, Employee, CreateEmployeeDto } from '../../src/services/employee';
import { mockEmployeeService } from '../../src/services/mockJobEmployeeData';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the mock service
jest.mock('../../src/services/mockJobEmployeeData', () => ({
  mockEmployeeService: {
    getAll: jest.fn(),
    getProfile: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('employeeService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const mockEmployee: Employee = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    role: 'Developer',
    email_id: 'john.doe@example.com',
    address_line_1: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    phone_number: '555-1234',
    hire_date: '2023-01-01',
    is_active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  };

  const mockCreateEmployeeDto: CreateEmployeeDto = {
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'Designer',
    email_id: 'jane.smith@example.com',
    address_line_1: '456 Oak St',
    city: 'Boston',
    state: 'MA',
    zip_code: '02101',
    phone_number: '555-5678',
    hire_date: '2023-02-01',
  };

  describe('getAll', () => {
    it('should use mock data when NEXT_PUBLIC_SKIP_MSAL is true', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'true';
      const mockEmployees = [mockEmployee];
      (mockEmployeeService.getAll as jest.Mock).mockResolvedValue(mockEmployees);

      const result = await employeeService.getAll();

      expect(mockEmployeeService.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockEmployees);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should use mock data in development without API_URL', async () => {
      (process.env as any).NODE_ENV = 'development';
      delete process.env.NEXT_PUBLIC_API_URL;
      const mockEmployees = [mockEmployee];
      (mockEmployeeService.getAll as jest.Mock).mockResolvedValue(mockEmployees);

      const result = await employeeService.getAll();

      expect(mockEmployeeService.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockEmployees);
    });

    it('should call API when not using mock data', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'false';
      (process.env as any).NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      const mockEmployees = [mockEmployee];
      mockedAxios.get.mockResolvedValue({ data: mockEmployees });

      const result = await employeeService.getAll();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.example.com/employees');
      expect(result).toEqual(mockEmployees);
    });
  });

  describe('getProfile', () => {
    it('should use mock data when configured', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'true';
      (mockEmployeeService.getProfile as jest.Mock).mockResolvedValue(mockEmployee);

      const result = await employeeService.getProfile();

      expect(mockEmployeeService.getProfile).toHaveBeenCalled();
      expect(result).toEqual(mockEmployee);
    });

    it('should call API when not using mock data', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'false';
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      mockedAxios.get.mockResolvedValue({ data: mockEmployee });

      const result = await employeeService.getProfile();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.example.com/employees/profile');
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('getById', () => {
    it('should use mock data when configured', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'true';
      (mockEmployeeService.getById as jest.Mock).mockResolvedValue(mockEmployee);

      const result = await employeeService.getById(1);

      expect(mockEmployeeService.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEmployee);
    });

    it('should call API when not using mock data', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'false';
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      mockedAxios.get.mockResolvedValue({ data: mockEmployee });

      const result = await employeeService.getById(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.example.com/employees/1');
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('create', () => {
    it('should use mock data when configured', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'true';
      (mockEmployeeService.create as jest.Mock).mockResolvedValue(mockEmployee);

      const result = await employeeService.create(mockCreateEmployeeDto);

      expect(mockEmployeeService.create).toHaveBeenCalledWith(mockCreateEmployeeDto);
      expect(result).toEqual(mockEmployee);
    });

    it('should call API when not using mock data', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'false';
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      mockedAxios.post.mockResolvedValue({ data: mockEmployee });

      const result = await employeeService.create(mockCreateEmployeeDto);

      expect(mockedAxios.post).toHaveBeenCalledWith('https://api.example.com/employees', mockCreateEmployeeDto);
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('update', () => {
    const updateData = { first_name: 'Updated Name' };

    it('should use mock data when configured', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'true';
      (mockEmployeeService.update as jest.Mock).mockResolvedValue(mockEmployee);

      const result = await employeeService.update(1, updateData);

      expect(mockEmployeeService.update).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(mockEmployee);
    });

    it('should call API when not using mock data', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'false';
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      mockedAxios.patch.mockResolvedValue({ data: mockEmployee });

      const result = await employeeService.update(1, updateData);

      expect(mockedAxios.patch).toHaveBeenCalledWith('https://api.example.com/employees/1', updateData);
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('delete', () => {
    it('should use mock data when configured', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'true';
      (mockEmployeeService.delete as jest.Mock).mockResolvedValue(undefined);

      await employeeService.delete(1);

      expect(mockEmployeeService.delete).toHaveBeenCalledWith(1);
    });

    it('should call API when not using mock data', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'false';
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      mockedAxios.delete.mockResolvedValue({});

      await employeeService.delete(1);

      expect(mockedAxios.delete).toHaveBeenCalledWith('https://api.example.com/employees/1');
    });
  });
});