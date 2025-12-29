
import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import type { Code, CodeCreateDto, CodeUpdateDto, CodeSearchDto, SelectOption } from '../types/codes';

export const codesApi = {
  getAll: async (): Promise<Code[]> => {
    const response = await axiosInstance.get<Code[]>(API_ENDPOINTS.CODES);
    return response.data;
  },

  getById: async (id: number): Promise<Code> => {
    const response = await axiosInstance.get<Code>(`${API_ENDPOINTS.CODES}/${id}`);
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

  create: async (data: CodeCreateDto): Promise<Code> => {
    const response = await axiosInstance.post<Code>(
      API_ENDPOINTS.CODES,
      data
    );
    return response.data;
  },

  update: async (id: number, data: CodeUpdateDto): Promise<Code> => {
    const response = await axiosInstance.put<Code>(
      `${API_ENDPOINTS.CODES}/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.CODES}/${id}`);
  },

  search: async (criteria: CodeSearchDto): Promise<Code[]> => {
    const response = await axiosInstance.post<Code[]>(
      API_ENDPOINTS.CODES_SEARCH,
      criteria
    );
    return response.data;
  },
};