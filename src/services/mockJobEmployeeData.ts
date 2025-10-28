// Mock data for job openings
export const mockJobOpenings = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    description: 'We are seeking a talented Senior Full Stack Developer to join our growing engineering team. You will be responsible for developing and maintaining web applications using modern technologies.',
    department: 'Engineering',
    location: 'San Francisco, CA',
    employment_type: 'Full-time' as const,
    experience_required: '5+ years',
    skills_required: [
      'React',
      'Node.js',
      'TypeScript',
      'PostgreSQL',
      'AWS',
      'Docker',
      'Git'
    ],
    responsibilities: [
      'Design and develop scalable web applications',
      'Collaborate with cross-functional teams to define and deliver new features',
      'Participate in code reviews and maintain code quality',
      'Mentor junior developers and contribute to technical decisions',
      'Optimize applications for maximum speed and scalability'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      '5+ years of experience in full-stack development',
      'Strong proficiency in React and Node.js',
      'Experience with cloud platforms (AWS preferred)',
      'Knowledge of database design and optimization',
      'Strong problem-solving and communication skills'
    ],
    salary_range: '$120,000 - $180,000',
    is_active: true,
    created_at: '2025-10-01T08:00:00Z',
    updated_at: '2025-10-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    description: 'Join our design team as a UX/UI Designer and help create intuitive and engaging user experiences for our products. You will work closely with product managers and developers.',
    department: 'Design',
    location: 'Remote',
    employment_type: 'Full-time' as const,
    experience_required: '3+ years',
    skills_required: [
      'Figma',
      'Adobe Creative Suite',
      'Prototyping',
      'User Research',
      'Wireframing',
      'HTML/CSS',
      'Design Systems'
    ],
    responsibilities: [
      'Create user-centered designs for web and mobile applications',
      'Conduct user research and usability testing',
      'Develop wireframes, prototypes, and design specifications',
      'Collaborate with developers to ensure design implementation',
      'Maintain and evolve design systems and guidelines'
    ],
    qualifications: [
      "Bachelor's degree in Design, HCI, or related field",
      '3+ years of experience in UX/UI design',
      'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
      'Strong portfolio demonstrating design process and solutions',
      'Understanding of front-end development principles',
      'Excellent communication and collaboration skills'
    ],
    salary_range: '$80,000 - $120,000',
    is_active: true,
    created_at: '2025-10-05T09:15:00Z',
    updated_at: '2025-10-16T14:20:00Z'
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    description: 'We are looking for a skilled DevOps Engineer to help us build and maintain our infrastructure. You will work on automating deployments, monitoring systems, and ensuring high availability.',
    department: 'Engineering',
    location: 'Austin, TX',
    employment_type: 'Full-time' as const,
    experience_required: '4+ years',
    skills_required: [
      'AWS',
      'Kubernetes',
      'Docker',
      'Terraform',
      'Jenkins',
      'Python',
      'Bash',
      'Monitoring'
    ],
    responsibilities: [
      'Design and implement CI/CD pipelines',
      'Manage cloud infrastructure and resources',
      'Automate deployment and configuration processes',
      'Monitor system performance and reliability',
      'Implement security best practices and compliance'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      '4+ years of experience in DevOps or system administration',
      'Strong experience with AWS and containerization technologies',
      'Proficiency in infrastructure as code (Terraform, CloudFormation)',
      'Experience with monitoring and logging tools',
      'Strong scripting skills in Python or Bash'
    ],
    salary_range: '$110,000 - $160,000',
    is_active: true,
    created_at: '2025-10-08T11:00:00Z',
    updated_at: '2025-10-17T16:45:00Z'
  },
  {
    id: 4,
    title: 'Product Manager',
    description: 'Lead product strategy and execution for our core platform. You will work with engineering, design, and business teams to deliver exceptional products to our customers.',
    department: 'Product',
    location: 'New York, NY',
    employment_type: 'Full-time' as const,
    experience_required: '5+ years',
    skills_required: [
      'Product Strategy',
      'Agile/Scrum',
      'Data Analysis',
      'User Research',
      'Roadmap Planning',
      'Stakeholder Management',
      'A/B Testing'
    ],
    responsibilities: [
      'Define product vision, strategy, and roadmap',
      'Collaborate with engineering and design teams',
      'Conduct market research and competitive analysis',
      'Analyze product metrics and user feedback',
      'Lead product launches and go-to-market strategies'
    ],
    qualifications: [
      "Bachelor's degree in Business, Engineering, or related field",
      '5+ years of product management experience',
      'Strong analytical and problem-solving skills',
      'Experience with agile development methodologies',
      'Excellent communication and leadership abilities',
      'Data-driven approach to product decisions'
    ],
    salary_range: '$130,000 - $190,000',
    is_active: true,
    created_at: '2025-10-10T13:30:00Z',
    updated_at: '2025-10-18T09:15:00Z'
  },
  {
    id: 5,
    title: 'Marketing Specialist',
    description: 'Join our marketing team to help drive brand awareness and lead generation. You will manage campaigns across multiple channels and analyze performance metrics.',
    department: 'Marketing',
    location: 'Chicago, IL',
    employment_type: 'Full-time' as const,
    experience_required: '2+ years',
    skills_required: [
      'Digital Marketing',
      'Google Analytics',
      'SEO/SEM',
      'Content Marketing',
      'Social Media',
      'Email Marketing',
      'HubSpot'
    ],
    responsibilities: [
      'Develop and execute marketing campaigns',
      'Manage social media presence and content calendar',
      'Analyze campaign performance and ROI',
      'Collaborate on content creation and SEO optimization',
      'Support lead generation and nurturing activities'
    ],
    qualifications: [
      "Bachelor's degree in Marketing, Communications, or related field",
      '2+ years of digital marketing experience',
      'Proficiency in marketing automation tools',
      'Strong analytical skills and attention to detail',
      'Creative thinking and content creation abilities',
      'Knowledge of SEO and SEM best practices'
    ],
    salary_range: '$55,000 - $75,000',
    is_active: true,
    created_at: '2025-10-12T10:00:00Z',
    updated_at: '2025-10-18T11:30:00Z'
  },
  {
    id: 6,
    title: 'Data Scientist',
    description: 'Help us unlock insights from our data to drive business decisions. You will work on machine learning models, data analysis, and building data-driven solutions.',
    department: 'Data & Analytics',
    location: 'Seattle, WA',
    employment_type: 'Full-time' as const,
    experience_required: '3+ years',
    skills_required: [
      'Python',
      'Machine Learning',
      'SQL',
      'Pandas',
      'TensorFlow',
      'Statistics',
      'Data Visualization'
    ],
    responsibilities: [
      'Build and deploy machine learning models',
      'Analyze large datasets to identify trends and insights',
      'Collaborate with business teams to solve analytical problems',
      'Create data visualizations and reports',
      'Maintain and improve existing data pipelines'
    ],
    qualifications: [
      "Master's degree in Data Science, Statistics, or related field",
      '3+ years of experience in data science or analytics',
      'Strong programming skills in Python and SQL',
      'Experience with machine learning frameworks',
      'Knowledge of statistical analysis and modeling',
      'Ability to communicate complex findings to non-technical stakeholders'
    ],
    salary_range: '$100,000 - $150,000',
    is_active: false,
    created_at: '2025-09-28T14:20:00Z',
    updated_at: '2025-10-16T12:00:00Z'
  }
];

// Mock data for employees
export const mockEmployees = [
  {
    id: 101,
    first_name: 'John',
    last_name: 'Doe',
    role: 'Senior Software Engineer',
    email_id: 'john.doe@company.com',
    address_line_1: '123 Tech Street',
    address_line_2: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94105',
    phone_number: '(555) 123-4567',
    hire_date: '2023-01-15',
    is_active: true,
    comment: 'Excellent performance in React and Node.js development',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2025-10-15T10:30:00Z'
  },
  {
    id: 102,
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'UX Designer',
    email_id: 'jane.smith@company.com',
    address_line_1: '456 Design Avenue',
    city: 'Austin',
    state: 'TX',
    zip_code: '73301',
    phone_number: '(555) 234-5678',
    hire_date: '2022-08-20',
    is_active: true,
    comment: 'Led several successful product redesign projects',
    created_at: '2022-08-20T09:00:00Z',
    updated_at: '2025-10-12T14:20:00Z'
  },
  {
    id: 103,
    first_name: 'Mike',
    last_name: 'Johnson',
    role: 'DevOps Engineer',
    email_id: 'mike.johnson@company.com',
    address_line_1: '789 Cloud Boulevard',
    address_line_2: 'Suite 200',
    city: 'Seattle',
    state: 'WA',
    zip_code: '98101',
    phone_number: '(555) 345-6789',
    hire_date: '2023-06-10',
    is_active: true,
    comment: 'Implemented robust CI/CD pipelines and infrastructure automation',
    created_at: '2023-06-10T10:15:00Z',
    updated_at: '2025-10-18T09:45:00Z'
  },
  {
    id: 104,
    first_name: 'Sarah',
    last_name: 'Wilson',
    role: 'Product Manager',
    email_id: 'sarah.wilson@company.com',
    address_line_1: '321 Strategy Lane',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    phone_number: '(555) 456-7890',
    hire_date: '2022-03-01',
    is_active: true,
    comment: 'Outstanding leadership in product strategy and cross-team collaboration',
    created_at: '2022-03-01T11:30:00Z',
    updated_at: '2025-10-17T16:15:00Z'
  },
  {
    id: 105,
    first_name: 'David',
    last_name: 'Brown',
    role: 'Marketing Manager',
    email_id: 'david.brown@company.com',
    address_line_1: '654 Marketing Plaza',
    city: 'Chicago',
    state: 'IL',
    zip_code: '60601',
    phone_number: '(555) 567-8901',
    hire_date: '2023-09-15',
    is_active: true,
    comment: 'Drove 40% increase in lead generation through digital campaigns',
    created_at: '2023-09-15T13:00:00Z',
    updated_at: '2025-10-16T11:20:00Z'
  },
  {
    id: 106,
    first_name: 'Emily',
    last_name: 'Chen',
    role: 'Data Scientist',
    email_id: 'emily.chen@company.com',
    address_line_1: '987 Analytics Drive',
    address_line_2: 'Floor 15',
    city: 'Boston',
    state: 'MA',
    zip_code: '02101',
    phone_number: '(555) 678-9012',
    hire_date: '2022-11-08',
    is_active: true,
    comment: 'Developed ML models that improved customer retention by 25%',
    created_at: '2022-11-08T14:45:00Z',
    updated_at: '2025-10-14T08:30:00Z'
  },
  {
    id: 107,
    first_name: 'Robert',
    last_name: 'Taylor',
    role: 'HR Specialist',
    email_id: 'robert.taylor@company.com',
    address_line_1: '111 People Street',
    city: 'Denver',
    state: 'CO',
    zip_code: '80201',
    phone_number: '(555) 789-0123',
    hire_date: '2021-05-20',
    is_active: false,
    comment: 'Left company for career advancement opportunity',
    created_at: '2021-05-20T15:30:00Z',
    updated_at: '2025-09-30T17:00:00Z'
  },
  {
    id: 108,
    first_name: 'Lisa',
    last_name: 'Anderson',
    role: 'Frontend Developer',
    email_id: 'lisa.anderson@company.com',
    address_line_1: '222 Code Avenue',
    city: 'Portland',
    state: 'OR',
    zip_code: '97201',
    phone_number: '(555) 890-1234',
    hire_date: '2024-02-01',
    is_active: true,
    comment: 'Specializes in React and modern frontend technologies',
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2025-10-18T12:15:00Z'
  }
];

// Mock service functions
export const mockJobOpeningService = {
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  async fetchJobOpenings() {
    await this.delay();
    console.log('Mock API: Fetching job openings');
    return mockJobOpenings.filter(job => job.is_active);
  },

  async fetchJobOpening(id: number) {
    await this.delay();
    console.log(`Mock API: Fetching job opening ${id}`);
    const job = mockJobOpenings.find(job => job.id === id);
    if (!job) throw new Error('Job opening not found');
    return job;
  },

  async createJobOpening(data: any) {
    await this.delay();
    console.log('Mock API: Creating job opening', data);
    
    const newJob = {
      id: mockJobOpenings.length + 1,
      ...data,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockJobOpenings.push(newJob);
    return newJob;
  },

  async updateJobOpening(id: number, data: any) {
    await this.delay();
    console.log(`Mock API: Updating job opening ${id}`, data);
    
    const jobIndex = mockJobOpenings.findIndex(job => job.id === id);
    if (jobIndex === -1) throw new Error('Job opening not found');
    
    mockJobOpenings[jobIndex] = {
      ...mockJobOpenings[jobIndex],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    return mockJobOpenings[jobIndex];
  },

  async deleteJobOpening(id: number) {
    await this.delay();
    console.log(`Mock API: Deleting job opening ${id}`);
    
    const jobIndex = mockJobOpenings.findIndex(job => job.id === id);
    if (jobIndex === -1) throw new Error('Job opening not found');
    
    mockJobOpenings.splice(jobIndex, 1);
  }
};

export const mockEmployeeService = {
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  async getAll() {
    await this.delay();
    console.log('Mock API: Fetching all employees');
    return mockEmployees;
  },

  async getProfile() {
    await this.delay();
    console.log('Mock API: Fetching user profile');
    // Return current user (John Doe for mock)
    return mockEmployees[0];
  },

  async getById(id: number) {
    await this.delay();
    console.log(`Mock API: Fetching employee ${id}`);
    const employee = mockEmployees.find(emp => emp.id === id);
    if (!employee) throw new Error('Employee not found');
    return employee;
  },

  async create(employee: any) {
    await this.delay();
    console.log('Mock API: Creating employee', employee);
    
    const newEmployee = {
      id: Math.max(...mockEmployees.map(e => e.id)) + 1,
      ...employee,
      is_active: employee.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockEmployees.push(newEmployee);
    return newEmployee;
  },

  async update(id: number, employee: any) {
    await this.delay();
    console.log(`Mock API: Updating employee ${id}`, employee);
    
    const empIndex = mockEmployees.findIndex(emp => emp.id === id);
    if (empIndex === -1) throw new Error('Employee not found');
    
    mockEmployees[empIndex] = {
      ...mockEmployees[empIndex],
      ...employee,
      updated_at: new Date().toISOString()
    };
    
    return mockEmployees[empIndex];
  },

  async delete(id: number) {
    await this.delay();
    console.log(`Mock API: Deleting employee ${id}`);
    
    const empIndex = mockEmployees.findIndex(emp => emp.id === id);
    if (empIndex === -1) throw new Error('Employee not found');
    
    mockEmployees.splice(empIndex, 1);
  }
};