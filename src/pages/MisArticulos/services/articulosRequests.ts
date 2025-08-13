import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from '../../../shared/services/axiosRequest';
import { Articulo, PaginatedResponse } from '../hooks/useArticulos';

export async function getArticulos(
  page: number,
  pageSize: number,
  filters: Record<string, string> = {}
): Promise<PaginatedResponse<Articulo>> {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: 'articulos/usuario-articulos/',
    params: {
      page,
      page_size: pageSize,
      ...filters,
    },
  };
  return categorizationPlusRequest<PaginatedResponse<Articulo>>(config);
}
