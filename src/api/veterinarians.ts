import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export interface Veterinarian {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  licenseNumber?: string;
  createdAt?: string;
  version: number;
}

export const veterinariansApi = {
  getAll: async (): Promise<Veterinarian[]> => {
    const response = await axiosInstance.get<Veterinarian[]>(
      API_ENDPOINTS.VETERINARIANS
    );
    return response.data;
  },

  getById: async (id: string): Promise<Veterinarian> => {
    const response = await axiosInstance.get<Veterinarian>(
      `${API_ENDPOINTS.VETERINARIANS}/${id}`
    );
    return response.data;
  },
};