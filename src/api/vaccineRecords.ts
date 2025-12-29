import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import type { 
  VaccineRecord, 
  VaccineRecordCreateDto, 
  VaccineRecordUpdateDto, 
  VaccineRecordSearchDto 
} from '../types/vaccine';

export const vaccineRecordsApi = {
  getAll: async (): Promise<VaccineRecord[]> => {
    const response = await axiosInstance.get<VaccineRecord[]>(
      API_ENDPOINTS.VACCINE_RECORDS
    );
    return response.data;
  },

  getById: async (id: number): Promise<VaccineRecord> => {
    const response = await axiosInstance.get<VaccineRecord>(
      `${API_ENDPOINTS.VACCINE_RECORDS}/${id}`
    );
    return response.data;
  },

  create: async (data: VaccineRecordCreateDto): Promise<VaccineRecord> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.VACCINE_RECORDS,
      data
    );
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  update: async (id: number, data: VaccineRecordUpdateDto): Promise<VaccineRecord> => {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.VACCINE_RECORDS}/${id}`,
      data
    );
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.VACCINE_RECORDS}/${id}`);
  },

  search: async (criteria: VaccineRecordSearchDto): Promise<VaccineRecord[]> => {
    const response = await axiosInstance.post<VaccineRecord[]>(
      API_ENDPOINTS.VACCINE_RECORDS_SEARCH,
      criteria
    );
    return response.data;
  },
};