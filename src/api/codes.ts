import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import type { Code, SelectOption } from '../types/pet';

export const codesApi = {
  getAll: async (): Promise<Code[]> => {
    const response = await axiosInstance.get<Code[]>(API_ENDPOINTS.CODES);
    return response.data;
  },

  getSpeciesOptions: async (): Promise<SelectOption[]> => {
    const response = await axiosInstance.get<SelectOption[]>(
      API_ENDPOINTS.SPECIES_OPTIONS
    );
    return response.data;
  },

  getBreedsBySpecies: async (speciesId: number): Promise<Code[]> => {
    const response = await axiosInstance.post<Code[]>(
      API_ENDPOINTS.CODES_SEARCH,
      {
        codeType: 'Breed',
        parentId: speciesId,
      }
    );
    return response.data;
  },
};