export interface Code {
  id: number;
  codeType: string;
  codeName: string;
  parentId?: number;
  version?: number;
  createdAt?: string;
}

export interface CodeCreateDto {
  codeType: string;
  codeName: string;
  parentId?: number;
}

export interface CodeUpdateDto {
  codeType?: string;
  codeName?: string;
  parentId?: number;
}

export interface CodeSearchDto {
  id?: number;
  codeType?: string;
  codeName?: string;
  parentId?: number;
}

export interface SelectOption {
  value: number;
  label: string;
}