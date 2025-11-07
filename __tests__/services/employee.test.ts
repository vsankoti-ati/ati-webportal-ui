// Mock localStorage before any imports
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock axios and api module before importing employee service
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock the api module
jest.mock('../../src/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock the mock service
jest.mock('../../src/services/mockJobEmployeeData', () => ({
  mockEmployeeService: {
    getAll: jest.fn(),
    getProfile: jest.fn(),
    getById: jest.fn(),
    getByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

import { employeeService, Employee, CreateEmployeeDto } from '../../src/services/employee';
import { mockEmployeeService } from '../../src/services/mockJobEmployeeData';
import { api } from '../../src/lib/api';

const mockedApi = api as jest.Mocked<typeof api>;

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
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Developer',
    emailId: 'john.doe@example.com',
    addressLine1: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phoneNumber: '555-1234',
    hireDate: '2023-01-01',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const mockCreateEmployeeDto: CreateEmployeeDto = {
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'Designer',
    emailId: 'jane.smith@example.com',
    addressLine1: '456 Oak St',
    city: 'Boston',
    state: 'MA',
    zipCode: '02101',
    phoneNumber: '555-5678',
    hireDate: '2023-02-01',
  };

  describe('getAll', () => {
    it('should use mock data when NEXT_PUBLIC_SKIP_MSAL is true', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'true';
      const mockEmployees = [mockEmployee];
      (mockEmployeeService.getAll as jest.Mock).mockResolvedValue(mockEmployees);

      const result = await employeeService.getAll();

      expect(mockEmployeeService.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockEmployees);
      expect(mockedApi.get).not.toHaveBeenCalled();
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
      mockedApi.get.mockResolvedValue({ data: mockEmployees });

      const result = await employeeService.getAll();

      expect(mockedApi.get).toHaveBeenCalledWith('/employees');
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
      mockedApi.get.mockResolvedValue({ data: mockEmployee });

      const result = await employeeService.getProfile();

      expect(mockedApi.get).toHaveBeenCalledWith('/employees/profile');
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('getById', () => {
    it('should use mock data when configured', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'true';
      (mockEmployeeService.getById as jest.Mock).mockResolvedValue(mockEmployee);

      const result = await employeeService.getById('1');

      expect(mockEmployeeService.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockEmployee);
    });

    it('should call API when not using mock data', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'false';
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      mockedApi.get.mockResolvedValue({ data: mockEmployee });

      const result = await employeeService.getById('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/employees/1');
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
      mockedApi.post.mockResolvedValue({ data: mockEmployee });

      const result = await employeeService.create(mockCreateEmployeeDto);

      expect(mockedApi.post).toHaveBeenCalledWith('/employees', expect.any(Object));
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('update', () => {
    const updateData = { firstName: 'Updated Name' };

    it('should use mock data when configured', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'true';
      (mockEmployeeService.update as jest.Mock).mockResolvedValue(mockEmployee);

      const result = await employeeService.update('1', updateData);

      expect(mockEmployeeService.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(mockEmployee);
    });

    it('should call API when not using mock data', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'false';
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      mockedApi.patch.mockResolvedValue({ data: mockEmployee });

      const result = await employeeService.update('1', updateData);

      expect(mockedApi.patch).toHaveBeenCalledWith('/employees/1', expect.any(Object));
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('delete', () => {
    it('should use mock data when configured', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'true';
      (mockEmployeeService.delete as jest.Mock).mockResolvedValue(undefined);

      await employeeService.delete('1');

      expect(mockEmployeeService.delete).toHaveBeenCalledWith('1');
    });

    it('should call API when not using mock data', async () => {
      process.env.NEXT_PUBLIC_SKIP_MSAL = 'false';
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      mockedApi.delete.mockResolvedValue({});

      await employeeService.delete('1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/employees/1');
    });
  });
});