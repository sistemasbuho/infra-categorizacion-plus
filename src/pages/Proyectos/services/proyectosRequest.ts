import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from '../../../shared/services/axiosRequest';

export interface TagInfo {
  id: string;
  created_at: string;
  modified_at: string;
  nombre: string;
  created_by: number;
  modified_by: number;
}

export interface ColaboradorInfo {
  id: number;
  nombre: string;
  email: string;
}

export interface Colaborador {
  id: number;
  username: string;
  email: string;
  nombre_completo: string;
}

export interface Tag {
  id: string;
  nombre: string;
  created_at: string;
  modified_at: string;
  created_by: number;
  modified_by: number;
}

export interface TagsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tag[];
}

export interface Keyword {
  palabras_clave: string[];
}

export interface Proyecto {
  id: string;
  tags_info: TagInfo[];
  colaboradores_info: ColaboradorInfo[];
  created_at: string;
  modified_at: string;
  proyecto_id: string;
  keyword: string[] | Keyword;
  nombre: string;
  activo: boolean;
  created_by: number | null;
  modified_by: number | null;
}

let config: AxiosRequestConfig = {};

export async function searchColaboradores(
  nombre: string
): Promise<Colaborador[]> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: 'usuarios/buscar/',
    params: {
      nombre: nombre,
    },
  };
  return categorizationPlusRequest<Colaborador[]>(config);
}

export async function getTags(
  page: number = 1,
  pageSize: number = 50,
  search?: string
): Promise<TagsPaginatedResponse> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: 'tags/',
    params: {
      page,
      page_size: pageSize,
      ...(search && { search }),
    },
  };
  return categorizationPlusRequest<TagsPaginatedResponse>(config);
}

export interface ProyectoELT {
  id: string;
  nombre: string;
}

export async function searchProyectosELT(
  nombre: string
): Promise<ProyectoELT[]> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: 'proyectos/buscar-proyecto-etl/',
    params: {
      nombre,
    },
  };
  return categorizationPlusRequest<ProyectoELT[]>(config);
}

export async function getProyectos(
  filters: Record<string, string> = {}
): Promise<Proyecto[]> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: 'proyecto-categorizacion/',
    params: {
      ...filters,
    },
  };
  return categorizationPlusRequest<Proyecto[]>(config);
}

export async function getProyecto(id: string): Promise<Proyecto> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `proyecto-categorizacion/${id}/`,
  };
  return categorizationPlusRequest<Proyecto>(config);
}

export async function createProyecto(proyectoData: {
  proyecto_id: string;
  nombre: string;
  keyword?: Keyword;
  colaboradores?: number[];
  tags?: string[];
}): Promise<Proyecto> {
  config = {
    method: 'POST',
    url: 'proyecto-categorizacion/',
    data: proyectoData,
  };
  return categorizationPlusRequest<Proyecto>(config);
}

export async function updateProyecto(
  id: string,
  proyectoData: Partial<{
    proyecto_id: string;
    nombre: string;
    keyword?: Keyword;
    colaboradores?: number[];
    tags?: string[];
    activo?: boolean;
  }>
): Promise<Proyecto> {
  const config: AxiosRequestConfig = {
    method: 'PATCH',
    url: `proyecto-categorizacion/${id}/`,
    data: proyectoData,
  };
  return categorizationPlusRequest<Proyecto>(config);
}

export async function deleteProyecto(id: string): Promise<void> {
  const config: AxiosRequestConfig = {
    method: 'DELETE',
    url: `proyecto-categorizacion/${id}/`,
  };
  return categorizationPlusRequest<void>(config);
}

export function getKeywordsArray(keyword: string[] | Keyword): string[] {
  if (Array.isArray(keyword)) {
    return keyword;
  }
  return keyword.palabras_clave || [];
}
