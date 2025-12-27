export interface Pet {
  id: number;
  name: string;
  microchipNumber: string;
  petPassportNumber?: string;
  gender: number;
  color?: string;
  speciesId: number;
  breedId: number;
  ownerId: number;
  createdAt?: string;
  version: number;
  
  // Navigation properties
  species?: Code;
  breed?: Code;
  owner?: Owner;
}

export interface Code {
  id: number;
  codeType: string;
  codeName: string;
  parentId?: number;
  version?: number;
}

export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
}

export interface PetCreateDto {
  name: string;
  microchipNumber: string;
  petPassportNumber?: string;
  gender: number;
  color?: string;
  speciesId: number;
  breedId: number;
  ownerId: number;
}

export interface PetUpdateDto {
  name?: string;
  microchipNumber?: string;
  petPassportNumber?: string;
  gender?: number;
  color?: string;
  speciesId?: number;
  breedId?: number;
  ownerId?: number;
  version?: number;
}

export interface PetSearchDto {
  id?: number;
  name?: string;
  ownerId?: number;
  speciesId?: number;
  breedId?: number;
  microchipNumber?: string;
}

export interface SelectOption {
  value: number;
  label: string;
}