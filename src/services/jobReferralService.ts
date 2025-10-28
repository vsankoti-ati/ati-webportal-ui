import { api } from '@/lib/api';

interface JobReferral {
  id: number;
  job_opening_id: number;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  relationship: string;
  resume_url: string;
  notes?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  referred_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJobReferralDto extends Omit<JobReferral, 'id' | 'status' | 'referred_by' | 'created_at' | 'updated_at'> {}
export interface UpdateJobReferralDto extends Partial<CreateJobReferralDto> {
  status?: JobReferral['status'];
}

export const fetchJobReferrals = async (): Promise<JobReferral[]> => {
  const response = await api.get('/job-referrals');
  return response.data;
};

export const fetchMyReferrals = async (): Promise<JobReferral[]> => {
  const response = await api.get('/job-referrals/my-referrals');
  return response.data;
};

export const fetchJobReferral = async (id: number): Promise<JobReferral> => {
  const response = await api.get(`/job-referrals/${id}`);
  return response.data;
};

export const createJobReferral = async (data: CreateJobReferralDto): Promise<JobReferral> => {
  const response = await api.post('/job-referrals', data);
  return response.data;
};

export const updateJobReferral = async (id: number, data: UpdateJobReferralDto): Promise<JobReferral> => {
  const response = await api.patch(`/job-referrals/${id}`, data);
  return response.data;
};

export const deleteJobReferral = async (id: number): Promise<void> => {
  await api.delete(`/job-referrals/${id}`);
};