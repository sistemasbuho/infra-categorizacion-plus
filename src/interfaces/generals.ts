export interface article {
  proyecto: number;
  id: number;
  text: string;
}

export interface categorization {
  tono: number;
  tag?: number;
  tema: number;
  activo?: number;
  pasivo?: number;
}

export interface GeneralRequestOptions {
  headers?: HeadersInit;
  body?: BodyInit;
}

export interface Selection {
  id: number;
  startIndex: number;
  length: number;
  text: string;
}

export interface NewSelection extends Selection {
  selectionId: number;
}

export interface OverlappingProps {
  startIndex: number;
  length: number;
  allSelections: Selection[];
}

export interface generalRequestProps {
  url: string;
  method?: string;
  options?: GeneralRequestOptions;
}

export interface generalRequestResponse {
  message: string;
  data: unknown;
  error: boolean;
}
