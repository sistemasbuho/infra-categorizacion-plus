import { Categorization, editCategorization } from '../interfaces/generals';
import { GeneralRequest } from './funcs';

/*
============================================================
==    Todas las funciones asincronas deberán estar aquí   ==
============================================================
*/

// Formulario de categorización
export async function getTagCategorization(query: string, projectId: number) {
  return await GeneralRequest(`buscar_variables`, 'POST', {
    id: Date.now(),
    nombre: query,
    modelo: 'Tag',
    proyecto_id: projectId,
  });
}

export async function getTemaCategorization(query: string, projectId: number) {
  return await GeneralRequest('buscar_variables', 'POST', {
    id: Date.now(),
    nombre: query,
    modelo: 'Tema',
    proyecto_id: projectId,
  });
}

export async function getTonoCategorization(query: string) {
  return await GeneralRequest('buscar_variables', 'POST', {
    id: Date.now(),
    nombre: query,
    modelo: 'Tono',
  });
}

export async function getActivoPasivoCategorization(query: string) {
  return await GeneralRequest('buscar_variables', 'POST', {
    id: Date.now(),
    nombre: query,
    modelo: 'Actor',
  });
}

// Fragmento
export async function postFragment(articleID: number, body: Categorization) {
  return await GeneralRequest(`articulo/${articleID}/fragmentos`, 'POST', body);
}

export async function editFragment(
  articleID: number,
  fragmentID: number,
  body: editCategorization
) {
  return await GeneralRequest(
    `articulo/${articleID}/fragmentos/${fragmentID}`,
    'PUT',
    body
  );
}

export async function deleteFragment(articleID: number, fragmentID: number) {
  return await GeneralRequest(
    `articulo/${articleID}/fragmentos/${fragmentID}`,
    'DELETE',
    {}
  );
}

// Articulo
export async function getArticleData(id: string | number) {
  return await GeneralRequest(`articulos/${id}/fragmentos`);
}

export async function postArticleCategorization(
  articleID: number,
  body: { tema: number[]; tag: number[] }
) {
  return await GeneralRequest(`articulos/${articleID}`, 'POST', body);
}

export async function deleteArticleCategorization(articleID: number) {
  return await GeneralRequest(`articulos/${articleID}`, 'DELETE', {});
}

// Encabezado
export async function postHeader(id: number, body) {
  return await GeneralRequest(`completar_articulo/${id}`, 'POST', body);
}

export async function searchMedio(query: string) {
  return await GeneralRequest('buscar_variables', 'POST', {
    id: 1,
    nombre: query,
    modelo: 'Medio_general',
  });
}

export async function searchAutor(query: string) {
  return await GeneralRequest('buscar_variables', 'POST', {
    id: 1,
    nombre: query,
    modelo: 'Actor_general',
  });
}

export async function putArticle(id: number, body) {
  return await GeneralRequest(`estado_borrar/${id}`, 'PUT', body);
}

export async function finishArticle(id: number) {
  return await GeneralRequest(`finalizar/${id}`, 'PUT');
}

export async function reportarTiempo(id: number, body) {
  return await GeneralRequest(`registrar_tiempo/${id}`, 'PUT', body);
}

export async function editArticleText(id: number, body: string) {
  return await GeneralRequest(`editar_texto/${id}`, 'PUT', body);
}
