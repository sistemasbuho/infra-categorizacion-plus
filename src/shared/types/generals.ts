export type BasicProperties = {
  id: string | number;
  created_at?: string;
  modified_at?: string;
  created_by?: string;
  modified_by?: string;
};

export interface articleContext {
  articulo: article;
  fragments: Selection[];
  siguiente_articulo: number;
  proyecto: string;
  forms_data: {
    programa: GeneralOption[];
    tags: GeneralOption[];
    temas: GeneralOption[];
    tipo: GeneralOption[];
    general: {
      tag: GeneralOption[];
      tema: GeneralOption[];
    };
  };
  keywords: Keywords[];
  keys: Keywords[];
}

export interface Keywords {
  start_index: number;
  article_fragment: string;
  color: string;
}

interface OriginalFragment {
  id: number;
  article_fragment?: string;
  start_index?: number;
  end_index?: number;
  articulo?: number;
  tag?: GeneralOption[];
  tema?: GeneralOption[];
  tono?: number;
  activo?: GeneralOption[];
  pasivo?: GeneralOption[];
}

export interface HighlightSelection extends OriginalFragment {
  color?: string;
}

export interface GeneralOption {
  id: number;
  nombre: string;
}

export interface Selection extends OriginalFragment {
  selectionId?: number;
}

export interface article {
  proyecto: number;
  id: number;
  text: string;
  texto?: string;
  article_fragment?: string;
  titulo: string;
  image_media_file?: string;
  audio_media_file?: string;
  state: boolean;
  resumen?: string;
  medio?: Medios[];
  autor?: Autores[];
  programa?: { id: number; nombre: string };
  fecha?: string;
  asignado_a: number;
  tipo_articulo?: GeneralOption;
  url?: string;
}

export interface ArticleCategorization {
  tags: Tags[];
  temas: Temas[];
}

export interface headerArticle extends article {
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
  allFragments: Selection[];
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
