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
  isActive?: boolean; 
}


export interface VeterinarianSearchDto {
  userName?: string;
  firstName?: string;
  lastName?: string;
  licenseNumber?: string;
}

export interface VeterinarianUpdateDto {
  firstName?: string;
  lastName?: string;
  licenseNumber?: string;
  version: number;
}

export const veterinariansApi = {
  getAll: async () => (await axiosInstance.get(API_ENDPOINTS.VETERINARIANS)).data,

  getById: async (id: string) =>
    (await axiosInstance.get(`${API_ENDPOINTS.VETERINARIANS}/${id}`)).data,

  search: async (criteria: VeterinarianSearchDto) =>
    (await axiosInstance.post(`${API_ENDPOINTS.VETERINARIANS}/Search`, criteria)).data,


  update: async (id: string, data: VeterinarianUpdateDto) =>
    (await axiosInstance.put(`${API_ENDPOINTS.VETERINARIANS}/${id}`, data)).data,

  delete: async (id: string) =>
    await axiosInstance.delete(`${API_ENDPOINTS.VETERINARIANS}/${id}`),
  activate: (id: string) =>
    axiosInstance.post(`${API_ENDPOINTS.VETERINARIANS}/${id}/Activate`),

  deactivate: (id: string) =>
    axiosInstance.post(`${API_ENDPOINTS.VETERINARIANS}/${id}/Deactivate`),
};
