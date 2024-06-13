import { generalRequest } from './funcs';

export async function getArticleData(id: string | number) {
  return await generalRequest(`articulos/${id}/fragmentos`);
}

export async function getTagCategorization(body) {
  return await generalRequest(`buscar_variables`, 'POST', { body });
}
