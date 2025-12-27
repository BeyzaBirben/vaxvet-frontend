export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  tcKimlikNo: string;
  address: string;
  phoneNumber: string;
  emergencyPerson?: string;
  emergencyPhone?: string;
  createdAt?: string;
  version: number;
}

export interface OwnerCreateDto {
  firstName: string;
  lastName: string;
  tcKimlikNo: string;
  address: string;
  phoneNumber: string;
  emergencyPerson?: string;
  emergencyPhone?: string;
}

export interface OwnerUpdateDto {
  firstName?: string;
  lastName?: string;
  tcKimlikNo?: string;
  address?: string;
  phoneNumber?: string;
  emergencyPerson?: string;
  emergencyPhone?: string;
  version?: number;
}

export interface OwnerSearchDto {
  id?: number;
  firstName?: string;
  lastName?: string;
  tcKimlikNo?: string;
  phoneNumber?: string;
}