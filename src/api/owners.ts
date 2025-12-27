import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import type { Owner, OwnerCreateDto, OwnerUpdateDto, OwnerSearchDto } from '../types/owner';

export const ownersApi = {
  // Get all owners
  getAll: async (): Promise<Owner[]> => {
    const response = await axiosInstance.get<Owner[]>(API_ENDPOINTS.OWNERS);
    return response.data;
  },

  // Get owner by ID
  getById: async (id: number): Promise<Owner> => {
    const response = await axiosInstance.get<Owner>(`${API_ENDPOINTS.OWNERS}/${id}`);
    return response.data;
  },

  // Create owner
  create: async (data: OwnerCreateDto): Promise<Owner> => {
    const response = await axiosInstance.post<{ success: boolean; data: Owner }>(
      API_ENDPOINTS.OWNERS,
      data
    );
    return response.data.data;
  },

  // Update owner
  update: async (id: number, data: OwnerUpdateDto): Promise<Owner> => {
    const response = await axiosInstance.put<{ success: boolean; data: Owner }>(
      `${API_ENDPOINTS.OWNERS}/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete owner
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.OWNERS}/${id}`);
  },

  // Search owners
  search: async (criteria: OwnerSearchDto): Promise<Owner[]> => {
    const response = await axiosInstance.post<Owner[]>(
      API_ENDPOINTS.OWNERS_SEARCH,
      criteria
    );
    return response.data;
  },
};