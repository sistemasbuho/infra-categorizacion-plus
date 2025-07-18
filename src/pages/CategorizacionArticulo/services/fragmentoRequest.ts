import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from '../../../shared/services/axiosRequest';

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
  temas: any[];
  texto: string;
  tono: string | null;
  width: number | null;
  activo?: any[];
  pasivo?: any[];
  activo_data?: any[];
  pasivo_data?: any[];
}

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

export interface CategorizarArticuloResponse {
  articulo: ArticuloAPI;
  fragmentos: FragmentoAPI[];
  total_fragmentos: number;
}

interface TagGeneral {
  id: string;
  nombre: string;
}

interface TemaGeneral {
  id: string;
  nombre: string;
}

interface CategorizacionGeneral {
  tags_generales: TagGeneral[];
  temas_generales: TemaGeneral[];
}

export interface ArticuloCategorizacion {
  articulo: {
    articulo_id: string;
    titulo: string;
    contenido: string;
    resumen: string;
    url: string;
    autor: string;
    medio: string;
    tipo_publicacion: string | null;
    fecha_publicacion: string;
    asignado_a: string | null;
    borrado: boolean;
    categorizado: boolean;
    fecha_categorizacion: string | null;
    motivo_borrado: string | null;
    proyecto: string | null;
    keywords: string[];
  };
  fragmentos: FragmentoAPI[];
  total_fragmentos: number;
  variables_categorizacion: any[];
  general?: any[];
  keyword?: Array<{ nombre: string }>;
  programa?: Array<{ id: number; nombre: string }>;
  tags?: Array<{
    id: number;
    nombre: string;
    tags: Array<{ id: number; nombre: string }>;
  }>;
  temas?: Array<{ id: number; nombre: string }>;
  tipo?: Array<{ id: number; nombre: string }>;
  siguiente_articulo?: Array<{ id: number }>;
  categorizacion_general?: CategorizacionGeneral;
}

export async function getFragmentosCategorizacion(
  articulo_id: string,
  proyecto_id: string
) {
  config = {
    method: 'GET',
    url: 'fragmentos/categorizacion-articulo/',
    params: { articulo_id, proyecto_id },
  };
  return await categorizationPlusRequest<ArticuloCategorizacion>(config);
}

export async function createFragmento(fragmentoData: {
  articulo_id: string;
  texto: string;
  indice_inicial: string;
  indice_final: string;
  tema_ids: string[];
  tono_id: string;
  tag_ids: string[];
  pasivo: string[];
  activo: string[];
}) {
  config = {
    method: 'POST',
    url: 'fragmentos/',
    data: fragmentoData,
  };
  return await categorizationPlusRequest<any>(config);
}

export async function updateFragmento(
  fragmentoId: string,
  fragmentoData: {
    texto: string;
    tema_ids: string[];
    tag_ids: string[];
    tono_id: string;
    activo: string[];
    pasivo: string[];
  }
) {
  config = {
    method: 'PATCH',
    url: `fragmentos/${fragmentoId}/`,
    data: fragmentoData,
  };
  return await categorizationPlusRequest<any>(config);
}

export async function deleteFragmento(fragmentoId: string) {
  config = {
    method: 'DELETE',
    url: `fragmentos/${fragmentoId}/`,
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

export async function updateArticuloHeader(
  articulo_id: string,
  headerData: {
    fecha_publicacion?: string;
    medio?: string;
    autor?: string;
    tipo_publicacion?: string;
    programa?: string;
  }
) {
  config = {
    method: 'PATCH',
    url: `encabezado-articulo/${articulo_id}/actualizar-encabezado/`,
    data: headerData,
  };
  return await categorizationPlusRequest<ArticuloAPI>(config);
}

export async function buscarTiposPublicacion(nombre: string) {
  config = {
    method: 'GET',
    url: 'tipo-publicacion/buscar/',
    params: { nombre },
  };
  return await categorizationPlusRequest<Array<{ id: string; nombre: string }>>(
    config
  );
}

export async function buscarMedios(nombre: string) {
  config = {
    method: 'GET',
    url: 'medio/',
    params: { nombre },
  };
  const response = await categorizationPlusRequest<{
    count: number;
    results: Array<{ uuid: string; nombre: string; genero: string | null }>;
  }>(config);

  return response.results || [];
}

export async function buscarAutores(nombre: string) {
  config = {
    method: 'GET',
    url: 'actores/',
    params: { nombre },
  };
  const response = await categorizationPlusRequest<{
    count: number;
    results: Array<{ uuid: string; nombre: string; genero: string }>;
  }>(config);

  return response.results || [];
}

export async function buscarProgramas(nombre: string) {
  config = {
    method: 'GET',
    url: 'programa-articulo/',
    params: { nombre },
  };
  const response = await categorizationPlusRequest<
    Array<{ id: string; nombre: string }>
  >(config);

  return response || [];
}

export async function updateCategorizacionGeneral(
  articulo_id: string,
  data: {
    tema_general?: string[];
    tag_general?: string[];
  }
) {
  config = {
    method: 'PATCH',
    url: `encabezado-articulo/${articulo_id}/actualizar-tags/`,
    data,
  };
  return await categorizationPlusRequest<any>(config);
}

export async function deleteCategorizacionGeneral(articulo_id: string) {
  config = {
    method: 'DELETE',
    url: `encabezado-articulo/${articulo_id}/eliminar-tags-temas-general/`,
  };
  return await categorizationPlusRequest<any>(config);
}
