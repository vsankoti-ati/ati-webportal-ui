export interface JobOpening {
  id: number;
  title: string;
  description: string;
  department: string;
  location: string;
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience_required: string;
  skills_required: string[];
  responsibilities: string[];
  qualifications: string[];
  salary_range?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateJobOpeningDto extends Omit<JobOpening, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateJobOpeningDto extends Partial<CreateJobOpeningDto> {}