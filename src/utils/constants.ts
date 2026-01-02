export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/Account/Login',
  
  // Owners
  OWNERS: '/Owners',
  OWNERS_SEARCH: '/Owners/Search',
  
  // Pets
  PETS: '/Pets',
  PETS_SEARCH: '/Pets/Search',
  PETS_BY_OWNER: (ownerId: number) => `/Pets/OwnerId/${ownerId}`,
  
  // Vaccines
  VACCINES: '/Vaccines',
  VACCINES_SEARCH: '/Vaccines/Search',
  
  // Vaccine Stocks
  VACCINE_STOCKS: '/VaccineStocks',
  VACCINE_STOCKS_SEARCH: '/VaccineStocks/Search',
  
  // Vaccine Records
  VACCINE_RECORDS: '/VaccineRecords',
  VACCINE_RECORDS_SEARCH: '/VaccineRecords/Search',
  
  // Codes
  CODES: '/Codes',
  CODES_SEARCH: '/Codes/Search',
  SPECIES_OPTIONS: '/Cache/Codes/Species/Options',
  
  // Roles
  ROLES: '/Roles',
  
  // Veterinarians
  VETERINARIANS: '/Veterinarians',
};