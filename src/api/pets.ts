import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

import type { Pet, PetCreateDto, PetUpdateDto, PetSearchDto } from '../types/pet';

// Backend'den dönen paket yapısı
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const petsApi = {
  // Tüm hayvanları getir
  getAll: async (): Promise<Pet[]> => {
    const response = await axiosInstance.get<Pet[]>(API_ENDPOINTS.PETS);
    return response.data;
  },

  // ID'ye göre getir
  getById: async (id: number): Promise<Pet> => {
    const response = await axiosInstance.get<Pet>(`${API_ENDPOINTS.PETS}/${id}`);
    return response.data;
  },

  // Sahibe göre getir
  getByOwnerId: async (ownerId: number): Promise<Pet[]> => {
    const response = await axiosInstance.get<Pet[]>(
      API_ENDPOINTS.PETS_BY_OWNER(ownerId)
    );
    return response.data;
  },

  // Ekle
  create: async (data: PetCreateDto): Promise<Pet> => {
    const response = await axiosInstance.post<ApiResponse<Pet>>(
      API_ENDPOINTS.PETS,
      data
    );
    return response.data.data;
  },

  // Güncelle
  update: async (id: number, data: PetUpdateDto): Promise<Pet> => {
    const response = await axiosInstance.put<ApiResponse<Pet>>(
      `${API_ENDPOINTS.PETS}/${id}`,
      data
    );
    return response.data.data;
  },

  // Sil
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.PETS}/${id}`);
  },

  // Ara
  search: async (criteria: PetSearchDto): Promise<Pet[]> => {
    const response = await axiosInstance.post<Pet[]>(
      API_ENDPOINTS.PETS_SEARCH,
      criteria
    );
    return response.data;
  },
};