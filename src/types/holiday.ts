export interface Holiday {
  id: number;
  name: string;
  date: string;
  description?: string;
  type: 'public' | 'company' | 'client';
  calendar_id: number;
  calendar?: HolidayCalendar;
  is_optional?: boolean;
  created_at: string;
  updated_at: string;
}

export interface HolidayCalendar {
  id: number;
  name: string;
  description?: string;
  type: 'ati' | 'client';
  client_id?: number;
  client_name?: string;
  is_active: boolean;
  color: string; // For UI display
  created_at: string;
  updated_at: string;
  holidays?: Holiday[];
}

export interface CreateHolidayDto {
  name: string;
  date: string;
  description?: string;
  type: 'public' | 'company' | 'client';
  calendar_id: number;
  is_optional?: boolean;
}

export interface CreateHolidayCalendarDto {
  name: string;
  description?: string;
  type: 'ati' | 'client';
  client_id?: number;
  color: string;
}