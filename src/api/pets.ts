import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import type { Pet, PetCreateDto, PetUpdateDto, PetSearchDto } from '../types/pet';

export const petsApi = {
  getAll: async (): Promise<Pet[]> => {
    const response = await axiosInstance.get<Pet[]>(API_ENDPOINTS.PETS);
    return response.data;
  },

  getById: async (id: number): Promise<Pet> => {
    const response = await axiosInstance.get<Pet>(`${API_ENDPOINTS.PETS}/${id}`);
    return response.data;
  },

  getByOwnerId: async (ownerId: number): Promise<Pet[]> => {
    const response = await axiosInstance.get<Pet[]>(
      API_ENDPOINTS.PETS_BY_OWNER(ownerId)
    );
    return response.data;
  },

  create: async (data: PetCreateDto): Promise<Pet> => {
    const response = await axiosInstance.post(API_ENDPOINTS.PETS, data);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  update: async (id: number, data: PetUpdateDto): Promise<Pet> => {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.PETS}/${id}`,
      data
    );
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.PETS}/${id}`);
  },

  search: async (criteria: PetSearchDto): Promise<Pet[]> => {
    const response = await axiosInstance.post<Pet[]>(
      API_ENDPOINTS.PETS_SEARCH,
      criteria
    );
    return response.data;
  },
};