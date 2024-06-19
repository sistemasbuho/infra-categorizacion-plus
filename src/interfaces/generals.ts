export interface GeneralOption {
  id: number;
  nombre: string;
}

interface OriginalFragment {
  article_fragment?: string;
  start_index?: number;
  end_index?: number;
  articulo?: number;
  tag?: GeneralOption[];
  tema: GeneralOption[];
  tono?: number;
  activo?: GeneralOption[];
  pasivo?: GeneralOption[];
}

export interface Selection extends OriginalFragment {
  id: number;
  startIndex: number;
  length: number;
  text: string;
  selectionId?: number;
}

export interface article {
  proyecto: number;
  id: number;
  text: string;
}

export interface ArticleCategorization {
  tags: Tags[];
  temas: Temas[];
}

export interface headerArticle extends article {
  medio?: { id: number; nombre: string };
  autor?: { id: number; nombre: string };
  tipo_articulo?: { id: number; nombre: string };
  programa?: { id: number; nombre: string };
  fecha?: string;
}

export interface SelectOption {
  label: string;
  value: number;
}

export interface editCategorization {
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

export interface Categorization {
  article_fragment?: string;
  start_index?: number;
  end_index?: number;
  articulo?: number;
  tag?: number[];
  tema?: number[];
  tono?: number;
  activo?: string[];
  pasivo?: string[];
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

export interface Tags extends GeneralOption {}

export interface Temas extends GeneralOption {}

export interface Tipos extends GeneralOption {}

export interface Programas extends GeneralOption {}

export interface Tono extends GeneralOption {}
