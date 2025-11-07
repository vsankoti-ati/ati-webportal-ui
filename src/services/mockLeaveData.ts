// Mock data for leave applications
export const mockLeaveApplications = [
  {
    id: 1,
    employee_id: '1',  // Admin User
    from_date: '2025-10-25',
    to_date: '2025-10-27',
    applied_date: '2025-10-15',
    status: 'PENDING',
    comment: 'Personal vacation to visit family',
    employee: {
      first_name: 'Admin',
      last_name: 'User',
      email_id: 'admin@atiwebportal.com'
    }
  },
  {
    id: 2,
    employee_id: '2',  // John Employee
    from_date: '2025-11-05',
    to_date: '2025-11-07',
    applied_date: '2025-10-10',
    status: 'APPROVED',
    comment: 'Medical appointment and recovery',
    employee: {
      first_name: 'John',
      last_name: 'Employee',
      email_id: 'employee@atiwebportal.com'
    }
  },
  {
    id: 3,
    employee_id: '101',
    from_date: '2025-10-30',
    to_date: '2025-11-01',
    applied_date: '2025-10-12',
    status: 'REJECTED',
    comment: 'Holiday celebration with family',
    employee: {
      first_name: 'John',
      last_name: 'Doe',
      email_id: 'john.doe@company.com'
    }
  },
  {
    id: 4,
    employee_id: '101',
    from_date: '2025-12-20',
    to_date: '2025-12-25',
    applied_date: '2025-10-18',
    status: 'PENDING',
    comment: 'Christmas vacation with extended family',
    employee: {
      first_name: 'John',
      last_name: 'Doe',
      email_id: 'john.doe@company.com'
    }
  },
  {
    id: 5,
    employee_id: '104',
    from_date: '2025-11-15',
    to_date: '2025-11-16',
    applied_date: '2025-10-16',
    status: 'APPROVED',
    comment: 'Personal emergency - family matter',
    employee: {
      first_name: 'Sarah',
      last_name: 'Wilson',
      email_id: 'sarah.wilson@company.com'
    }
  },
  {
    id: 6,
    employee_id: '105',
    from_date: '2025-11-28',
    to_date: '2025-11-29',
    applied_date: '2025-10-17',
    status: 'PENDING',
    comment: 'Thanksgiving holiday weekend',
    employee: {
      first_name: 'David',
      last_name: 'Brown',
      email_id: 'david.brown@company.com'
    }
  }
];

export const mockLeaveBalances = [
  {
    id: 1,
    employee_id: '1',  // Admin User
    leave_type: 'Annual Leave',
    leave_balance: 15,
    employee: {
      first_name: 'Admin',
      last_name: 'User',
      email_id: 'admin@atiwebportal.com'
    }
  },
  {
    id: 2,
    employee_id: '1',
    leave_type: 'Sick Leave',
    leave_balance: 8,
    employee: {
      first_name: 'Admin',
      last_name: 'User',
      email_id: 'admin@atiwebportal.com'
    }
  },
  {
    id: 3,
    employee_id: '2',  // John Employee
    leave_type: 'Annual Leave',
    leave_balance: 20,
    employee: {
      first_name: 'John',
      last_name: 'Employee',
      email_id: 'employee@atiwebportal.com'
    }
  },
  {
    id: 4,
    employee_id: '2',
    leave_type: 'Sick Leave',
    leave_balance: 12,
    employee: {
      first_name: 'John',
      last_name: 'Employee',
      email_id: 'employee@atiwebportal.com'
    }
  },
  {
    id: 5,
    employee_id: '101',  // John Doe
    leave_type: 'Annual Leave',
    leave_balance: 18,
    employee: {
      first_name: 'John',
      last_name: 'Doe',
      email_id: 'john.doe@company.com'
    }
  },
  {
    id: 6,
    employee_id: '101',
    leave_type: 'Sick Leave',
    leave_balance: 10,
    employee: {
      first_name: 'John',
      last_name: 'Doe',
      email_id: 'john.doe@company.com'
    }
  },
  {
    id: 7,
    employee_id: '102',  // Jane Smith
    leave_type: 'Annual Leave',
    leave_balance: 22,
    employee: {
      first_name: 'Jane',
      last_name: 'Smith',
      email_id: 'jane.smith@company.com'
    }
  },
  {
    id: 8,
    employee_id: '102',
    leave_type: 'Sick Leave',
    leave_balance: 14,
    employee: {
      first_name: 'Jane',
      last_name: 'Smith',
      email_id: 'jane.smith@company.com'
    }
  }
];

// Mock service functions that simulate API calls
export const mockLeaveService = {
  // Simulate API delay
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  async getAllApplications() {
    await this.delay();
    console.log('Mock API: Fetching all leave applications');
    return mockLeaveApplications;
  },

  async getEmployeeApplications(employeeId: string) {
    await this.delay();
    console.log(`Mock API: Fetching leave applications for employee ${employeeId}`);
    return mockLeaveApplications.filter(app => app.employee_id.toString() === employeeId.toString());
  },

  async getLeaveBalance(employeeId: string) {
    await this.delay();
    console.log(`Mock API: Fetching leave balance for employee ${employeeId}`);
    return mockLeaveBalances.filter(balance => balance.employee_id.toString() === employeeId.toString());
  },

  async createApplication(application: {
    employee_id: string;
    from_date: string;
    to_date: string;
    comment?: string;
  }) {
    await this.delay();
    console.log('Mock API: Creating new leave application', application);
    
    const newApplication = {
      id: mockLeaveApplications.length + 1,
      ...application,
      applied_date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      comment: application.comment || '',
      employee: {
        first_name: 'Current',
        last_name: 'User',
        email_id: 'current.user@company.com'
      }
    };
    
    mockLeaveApplications.push(newApplication);
    return newApplication;
  },

  async updateApplicationStatus(
    id: number,
    update: { status: string; comment?: string }
  ) {
    await this.delay();
    console.log(`Mock API: Updating application ${id} status`, update);
    
    const application = mockLeaveApplications.find(app => app.id === id);
    if (application) {
      application.status = update.status;
      if (update.comment) {
        application.comment = update.comment;
      }
      return application;
    }
    throw new Error('Application not found');
  },

  async updateLeaveBalance(id: number, leave: any) {
    await this.delay();
    console.log(`Mock API: Updating leave balance ${id}`, leave);
    
    const balance = mockLeaveBalances.find(b => b.id === id);
    if (balance) {
      Object.assign(balance, leave);
      return balance;
    }
    throw new Error('Leave balance not found');
  }
};