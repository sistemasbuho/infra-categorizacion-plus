import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from './axiosRequest';
import { Articulo, PaginatedResponse } from '../hooks/useArticulosLideres';

let config: AxiosRequestConfig = {};

export async function getArticulosLideres(
  page: number,
  pageSize: number,
  filters: Record<string, string> = {}
): Promise<PaginatedResponse<Articulo>> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: 'articulos/',
    params: {
      page,
      page_size: pageSize,
      ...filters,
    },
  };
  return categorizationPlusRequest<PaginatedResponse<Articulo>>(config);
}

export async function changeEstadoArticulo(
  articulo_id: string,
  accion: boolean,
  motivo: string
): Promise<void> {
  config = {
    method: 'POST',
    url: 'articulos/estado-borrado/',
    data: {
      articulo_id,
      accion: accion ? 'borrar' : 'reactivar',
      motivo,
    },
  };
  await categorizationPlusRequest(config);
}
