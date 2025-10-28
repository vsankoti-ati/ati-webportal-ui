import { JobOpening, CreateJobOpeningDto, UpdateJobOpeningDto } from '@/types/jobOpening';
import { api } from '@/lib/api';
import { mockJobOpeningService } from './mockJobEmployeeData';

// Check if we should use mock data
const useMockData = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                    process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

export const fetchJobOpenings = async (): Promise<JobOpening[]> => {
  if (useMockData) {
    console.log('Using mock data for job openings');
    return mockJobOpeningService.fetchJobOpenings();
  }
  const response = await api.get('/job-openings');
  return response.data;
};

export const fetchJobOpening = async (id: number): Promise<JobOpening> => {
  if (useMockData) {
    console.log('Using mock data for job opening details');
    return mockJobOpeningService.fetchJobOpening(id);
  }
  const response = await api.get(`/job-openings/${id}`);
  return response.data;
};

export const createJobOpening = async (data: CreateJobOpeningDto): Promise<JobOpening> => {
  if (useMockData) {
    console.log('Using mock data for job opening creation');
    return mockJobOpeningService.createJobOpening(data);
  }
  const response = await api.post('/job-openings', data);
  return response.data;
};

export const updateJobOpening = async (id: number, data: UpdateJobOpeningDto): Promise<JobOpening> => {
  if (useMockData) {
    console.log('Using mock data for job opening update');
    return mockJobOpeningService.updateJobOpening(id, data);
  }
  const response = await api.patch(`/job-openings/${id}`, data);
  return response.data;
};

export const deleteJobOpening = async (id: number): Promise<void> => {
  if (useMockData) {
    console.log('Using mock data for job opening deletion');
    return mockJobOpeningService.deleteJobOpening(id);
  }
  await api.delete(`/job-openings/${id}`);
};