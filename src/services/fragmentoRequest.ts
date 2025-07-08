import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from './axiosRequest';

let config: AxiosRequestConfig = {};

export interface FragmentoCategorizacion {
  id?: string;
  articulo_id: string;
  fragment_text: string;
  start_index: number;
  end_index: number;
  tema?: string;
  tono?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

// Nuevo tipo para fragmentos que devuelve la API
export interface FragmentoAPI {
  id: string;
  articulo_id: string;
  created_at: string;
  modified_at: string | null;
  created_by: string | null;
  modified_by: string | null;
  height: number | null;
  indice_final: string;
  indice_inicial: string;
  tag: any[];
  tema: any[];
  texto: string;
  tono: string | null;
  width: number | null;
}

// Nuevo tipo para el artículo que devuelve la API
export interface ArticuloAPI {
  id: string;
  asignado_a: string | null;
  autor: string;
  borrado: boolean;
  categorizado: boolean;
  contenido: string;
  fecha_categorizacion: string | null;
  fecha_publicacion: string;
  medio: string;
  motivo_borrado: string | null;
  proyecto: string;
  resumen: string;
  tipo_publicacion: string | null;
  titulo: string;
  url: string;
}

// Nuevo tipo para la respuesta completa de categorizarArticulo
export interface CategorizarArticuloResponse {
  articulo: ArticuloAPI;
  fragmentos: FragmentoAPI[];
  total_fragmentos: number;
}

export interface ArticuloCategorizacion {
  articulo: {
    id: number;
    titulo: string;
    texto: string;
    resumen: string;
    url: string;
    autor: any;
    medio: {
      id: number;
      nombre: string;
    };
    tipo_articulo: any;
    fecha: string;
    programa: any;
    image_media_file?: string;
    audio_media_file?: string;
    state: boolean;
    finished: boolean;
  };
  fragmentos: FragmentoCategorizacion[];
  general: any[];
  keyword: Array<{ nombre: string }>;
  programa: Array<{ id: number; nombre: string }>;
  proyecto: Array<{ nombre: string }>;
  tags: Array<{
    id: number;
    nombre: string;
    tags: Array<{ id: number; nombre: string }>;
  }>;
  temas: Array<{ id: number; nombre: string }>;
  tipo: Array<{ id: number; nombre: string }>;
  siguiente_articulo: Array<{ id: number }>;
}

export async function getFragmentosCategorizacion(articulo_id: string) {
  config = {
    method: 'GET',
    url: 'fragmentos/categorizacion-articulo/',
    data: { articulo_id: '1261559' },
  };
  return await categorizationPlusRequest<ArticuloCategorizacion>(config);
}

export async function createFragmento(
  fragmento: Omit<FragmentoCategorizacion, 'id' | 'created_at' | 'updated_at'>
) {
  config = {
    method: 'POST',
    url: 'fragmentos/categorizacion-articulo/',
    data: fragmento,
  };
  return await categorizationPlusRequest<FragmentoCategorizacion>(config);
}

export async function updateFragmento(fragmento: FragmentoCategorizacion) {
  config = {
    method: 'PATCH',
    url: `fragmentos/categorizacion-articulo/${fragmento.id}/`,
    data: fragmento,
  };
  return await categorizationPlusRequest<FragmentoCategorizacion>(config);
}

export async function deleteFragmento(fragmentoId: string) {
  config = {
    method: 'DELETE',
    url: `fragmentos/categorizacion-articulo/${fragmentoId}/`,
  };
  return await categorizationPlusRequest<void>(config);
}

export async function finalizarArticulo(articulo_id: string) {
  config = {
    method: 'POST',
    url: 'fragmentos/finalizar-articulo/',
    data: { articulo_id },
  };
  return await categorizationPlusRequest<{ message: string }>(config);
}

export async function cambiarEstadoArticulo(
  articulo_id: string,
  estado: boolean
) {
  config = {
    method: 'PATCH',
    url: 'fragmentos/cambiar-estado-articulo/',
    data: { articulo_id, estado },
  };
  return await categorizationPlusRequest<{ message: string }>(config);
}

export async function categorizarArticulo(
  articulo_id: string,
  proyecto_id: string
) {
  config = {
    method: 'GET',
    url: 'fragmentos/categorizacion-articulo/',
    params: { articulo_id, proyecto_id },
  };
  return await categorizationPlusRequest<CategorizarArticuloResponse>(config);
}
