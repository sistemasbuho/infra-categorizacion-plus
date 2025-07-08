import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from './axiosRequest';
import { TemaResponse, PaginatedResponse } from '../hooks/useTemas';
import { LocalTema } from '../components/forms/TemaForm';

let config: AxiosRequestConfig = {};

export interface ProyectoResponse {
  id: string;
  nombre: string;
}

export async function getTemas(
  url?: string
): Promise<PaginatedResponse<TemaResponse>> {
  config = {
    method: 'GET',
    url: url || 'temas/',
  };
  return await categorizationPlusRequest<PaginatedResponse<TemaResponse>>(
    config
  );
}

export async function createTema(newTema: LocalTema) {
  config = {
    method: 'POST',
    url: 'temas/',
    data: newTema,
  };
  return await categorizationPlusRequest<TemaResponse>(config);
}

export async function updateTema(tema: TemaResponse) {
  config = {
    method: 'PATCH',
    url: `temas/${tema.id}/`,
    data: tema,
  };
  return await categorizationPlusRequest<TemaResponse>(config);
}

export async function deleteTema(temaId: TemaResponse['id']) {
  config = {
    method: 'DELETE',
    url: `temas/${temaId}/`,
  };
  return await categorizationPlusRequest<TemaResponse>(config);
}

export async function searchProyectos(
  query: string
): Promise<ProyectoResponse[]> {
  config = {
    method: 'GET',
    url: 'proyectos/buscar-proyecto/',
    params: { nombre: query },
  };
  return await categorizationPlusRequest<ProyectoResponse[]>(config);
}
