import { api } from '@/lib/api';
import { Project, CreateProjectDto } from '@/types/timesheet';

// Check if we should use mock data
const useMockData = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                    process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

// Mock Projects Data
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'E-Commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    start_date: '2025-09-01',
    end_date: '2025-12-31',
    status: 'active',
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2025-09-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'React Native mobile application for iOS and Android',
    start_date: '2025-08-15',
    end_date: '2025-11-30',
    status: 'active',
    created_at: '2025-08-15T00:00:00Z',
    updated_at: '2025-08-15T00:00:00Z'
  },
  {
    id: 3,
    name: 'Database Migration',
    description: 'Migrating legacy database to cloud infrastructure',
    start_date: '2025-10-01',
    end_date: '2025-12-15',
    status: 'active',
    created_at: '2025-10-01T00:00:00Z',
    updated_at: '2025-10-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'API Integration',
    description: 'Third-party API integration and microservices architecture',
    start_date: '2025-09-15',
    end_date: '2025-10-30',
    status: 'active',
    created_at: '2025-09-15T00:00:00Z',
    updated_at: '2025-09-15T00:00:00Z'
  },
  {
    id: 5,
    name: 'Legacy System Upgrade',
    description: 'Upgrading legacy systems to modern tech stack',
    start_date: '2025-07-01',
    end_date: '2025-09-30',
    status: 'completed',
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-09-30T00:00:00Z'
  }
];

export const fetchProjects = async (): Promise<Project[]> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockProjects;
  }
  
  const response = await api.get('/projects');
  return response.data;
};

export const fetchActiveProjects = async (): Promise<Project[]> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProjects.filter(p => p.status === 'active');
  }
  
  const response = await api.get('/projects/active');
  return response.data;
};

export const fetchProject = async (id: number): Promise<Project> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const project = mockProjects.find(p => p.id === id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    return project;
  }
  
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data: CreateProjectDto): Promise<Project> => {
  if (useMockData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newProject: Project = {
      id: Math.max(...mockProjects.map(p => p.id)) + 1,
      name: data.name,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      status: data.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockProjects.push(newProject);
    return newProject;
  }
  
  const response = await api.post('/projects', data);
  return response.data;
};