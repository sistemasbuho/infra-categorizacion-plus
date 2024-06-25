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
  tag_details?: GeneralOption[];
  tema_details?: GeneralOption[];
  pasivo_details?: GeneralOption[];
  activo_details?: GeneralOption[];
}

export interface article {
  proyecto: number;
  id: number;
  text: string;
  titulo: string;
  image_media_file?: string;
  state: boolean;
}

export interface ArticleCategorization {
  tags: Tags[];
  temas: Temas[];
}

export interface headerArticle extends article {
  medio?: GeneralOption;
  autor?: GeneralOption;
  tipo_articulo?: { id: number; nombre: string };
  programa?: { id: number; nombre: string };
  fecha?: string;
}

export interface SelectOption {
  label: string;
  value: number;
  isNew?: boolean;
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

export interface Medios extends GeneralOption {
  isNew?: boolean;
}

export interface Autores extends GeneralOption {
  isNew?: boolean;
}
