export interface Vaccine {
  id: number;
  name: string;
  manufacturer: string;
  createdAt?: string;
  version: number;
}

export interface VaccineCreateDto {
  name: string;
  manufacturer: string;
}

export interface VaccineUpdateDto {
  name?: string;
  manufacturer?: string;
}

export interface VaccineSearchDto {
  id?: number;
  name?: string;
  manufacturer?: string;
}

// Vaccine Stock Types
export interface VaccineStock {
  id: number;
  vaccineId: number;
  stockDate: string;
  serialId: string;
  quantity: number;
  unitPrice: number;
  expirationDate: string;
  createdAt?: string;
  version: number;
  
  // Navigation
  vaccine?: Vaccine;
}

export interface VaccineStockCreateDto {
  vaccineId: number;
  stockDate: string;
  serialId: string;
  quantity: number;
  unitPrice: number;
  expirationDate: string;
}

export interface VaccineStockUpdateDto {
  vaccineId?: number;
  stockDate?: string;
  serialId?: string;
  quantity?: number;
  unitPrice?: number;
  expirationDate?: string;
  version?: number;
}

export interface VaccineStockSearchDto {
  id?: number;
  vaccineId?: number;
  serialId?: string;
  stockDate?: string;
  expirationDate?: string;
}

// Vaccine Record Types
export interface VaccineRecord {
  id: number;
  petId: number;
  vaccineId: number;
  veterinarianId: string;
  vaccineStockId: number;
  vaccinationDate: string;
  nextDueDate?: string;
  createdAt?: string;
  version: number;
  
  // Navigation
  pet?: {
    id: number;
    name: string;
    owner?: {
      firstName: string;
      lastName: string;
    };
  };
  vaccine?: Vaccine;
  veterinarian?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  vaccineStock?: VaccineStock;
}

export interface VaccineRecordCreateDto {
  petId: number;
  vaccineId: number;
  veterinarianId: string;
  vaccineStockId: number;
  vaccinationDate: string;
  nextDueDate?: string;
}

export interface VaccineRecordUpdateDto {
  petId?: number;
  vaccineId?: number;
  veterinarianId?: string;
  vaccineStockId?: number;
  vaccinationDate?: string;
  nextDueDate?: string;
  version?: number;
}

export interface VaccineRecordSearchDto {
  id?: number;
  petId?: number;
  vaccineId?: number;
  veterinarianId?: string;
  vaccineStockId?: number;
}