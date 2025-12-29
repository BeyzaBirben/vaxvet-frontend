import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import type { 
  Vaccine, 
  VaccineCreateDto, 
  VaccineUpdateDto, 
  VaccineSearchDto 
} from '../types/vaccine';

export const vaccinesApi = {
  getAll: async (): Promise<Vaccine[]> => {
    const response = await axiosInstance.get<Vaccine[]>(API_ENDPOINTS.VACCINES);
    return response.data;
  },

  getById: async (id: number): Promise<Vaccine> => {
    const response = await axiosInstance.get<Vaccine>(
      `${API_ENDPOINTS.VACCINES}/${id}`
    );
    return response.data;
  },

  create: async (data: VaccineCreateDto): Promise<Vaccine> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.VACCINES,
      data
    );
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  update: async (id: number, data: VaccineUpdateDto): Promise<Vaccine> => {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.VACCINES}/${id}`,
      data
    );
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.VACCINES}/${id}`);
  },

  search: async (criteria: VaccineSearchDto): Promise<Vaccine[]> => {
    const response = await axiosInstance.post<Vaccine[]>(
      API_ENDPOINTS.VACCINES_SEARCH,
      criteria
    );
    return response.data;
  },
};