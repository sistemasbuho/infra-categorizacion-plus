import { AxiosRequestConfig } from 'axios';
import {
  Publicacion,
  PaginatedResponse,
} from '../hooks/usePublicacionesLideres';
import { categorizationPlusRequest } from '../../../shared/services/axiosRequest';

export async function getPublicacionesLideres(
  page: number,
  pageSize: number,
  filters: Record<string, string> = {}
): Promise<PaginatedResponse<Publicacion>> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: 'redes/listar-publicaciones',
    params: {
      page,
      page_size: pageSize,
      ...filters,
    },
  };
  return categorizationPlusRequest<PaginatedResponse<Publicacion>>(config);
}

export async function changeEstadoPublicacion(
  publicacion_id: string,
  accion: boolean,
  motivo: string
): Promise<void> {
  const config: AxiosRequestConfig = {
    method: 'POST',
    url: 'redes-borrados/estado-borrado/',
    data: {
      publicacion_id,
      accion: accion ? 'borrar' : 'reactivar',
      motivo,
    },
  };
  return categorizationPlusRequest<void>(config);
}
