export interface article {
  proyecto: number;
  id: number;
  text: string;
}

export interface headerArticle extends article {
  medio?: { id: number; nombre: string };
  autor?: { id: number; nombre: string };
  tipo_articulo?: { id: number; nombre: string };
  programa?:{ id: number; nombre: string };
  fecha?: string;
}

// export interface categorization {
//   tono: number;
//   tag?: number;
//   tema: number;
//   activo?: number;
//   pasivo?: number;
// }

export interface newCategorization {
  article_fragment: string;
  start_index: number;
  end_index: number;
  articulo: number;
  tag: number[];
  tema: number[];
  tono: number;
  activo: string[];
  pasivo: string[];
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
