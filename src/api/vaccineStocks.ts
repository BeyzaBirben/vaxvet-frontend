import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import type { 
  VaccineStock, 
  VaccineStockCreateDto, 
  VaccineStockUpdateDto, 
  VaccineStockSearchDto 
} from '../types/vaccine';

export const vaccineStocksApi = {
  getAll: async (): Promise<VaccineStock[]> => {
    const response = await axiosInstance.get<VaccineStock[]>(
      API_ENDPOINTS.VACCINE_STOCKS
    );
    return response.data;
  },

  getById: async (id: number): Promise<VaccineStock> => {
    const response = await axiosInstance.get<VaccineStock>(
      `${API_ENDPOINTS.VACCINE_STOCKS}/${id}`
    );
    return response.data;
  },

  create: async (data: VaccineStockCreateDto): Promise<VaccineStock> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.VACCINE_STOCKS,
      data
    );
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  update: async (id: number, data: VaccineStockUpdateDto): Promise<VaccineStock> => {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.VACCINE_STOCKS}/${id}`,
      data
    );
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.VACCINE_STOCKS}/${id}`);
  },

  search: async (criteria: VaccineStockSearchDto): Promise<VaccineStock[]> => {
    const response = await axiosInstance.post<VaccineStock[]>(
      API_ENDPOINTS.VACCINE_STOCKS_SEARCH,
      criteria
    );
    return response.data;
  },
};