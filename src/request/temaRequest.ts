import { AxiosRequestConfig } from 'axios';
import { categorizationPlusRequest } from './axiosRequest';
import { TemaResponse } from '../context/TemaContext';

let config: AxiosRequestConfig = {};

export async function getTemas() {
  config = {
    method: 'GET',
    url: 'temas/',
  };
  return await categorizationPlusRequest<TemaResponse[]>(config);
}

export async function createTema(newTema: TemaResponse) {
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
    method: 'delete',
    url: `temas/${temaId}/`,
  };
  return await categorizationPlusRequest<TemaResponse>(config);
}
