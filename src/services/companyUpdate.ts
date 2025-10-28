import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CompanyUpdate {
  id: number;
  title: string;
  description: string;
  type: string;
  createdAt: string;
  eventDate?: string;
}

export const companyUpdateService = {
  async getLatestUpdates(): Promise<CompanyUpdate[]> {
    const response = await axios.get(`${API_URL}/company-updates`);
    return response.data;
  },

  async createUpdate(update: Omit<CompanyUpdate, 'id' | 'createdAt'>): Promise<CompanyUpdate> {
    const response = await axios.post(`${API_URL}/company-updates`, update);
    return response.data;
  },

  async updateUpdate(id: number, update: Partial<CompanyUpdate>): Promise<CompanyUpdate> {
    const response = await axios.patch(`${API_URL}/company-updates/${id}`, update);
    return response.data;
  },

  async deleteUpdate(id: number): Promise<void> {
    await axios.delete(`${API_URL}/company-updates/${id}`);
  },
};