import { OverlappingProps } from '../interfaces/generals';

import axios from 'axios';

export const isOverlappingFragment = ({
  startIndex,
  length,
  allSelections,
}: OverlappingProps): boolean => {
  const endIndex = Number(startIndex + length);
  return allSelections.some(
    ({ start_index: selStart, article_fragment: selLength }) => {
      selStart = Number(selStart);
      const selEnd = selStart + selLength.length;
      return startIndex < selEnd && endIndex > Number(selStart);
    }
  );
};

export async function reqtsApiForm(
  urlApi,
  withToken = false,
  method,
  params,
  mSuccess,
  mError,
  multipart = false
) {
  // let formBody = multipart ? new FormData() : {};
  let headers = {};
  const token = withToken ? '' : '';

  // if (withToken) {
  //   let response = getVarSsn();
  //   token = response?.access;
  // }

  // if (multipart) {
  //   for (const name in params) {
  //     formBody.append(name, params[name]);
  //   }
  // } else {
  //   formBody = params;
  // }

  if (token !== '') {
    headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': multipart ? 'multipart/form-data' : 'application/json',
    };
  } else {
    headers = {
      'Content-Type': 'application/json',
    };
  }

  try {
    const response = await axios({
      method: method,
      url: `${import.meta.env.VITE_API_URL}/${urlApi}/`,
      headers: headers,
      timeout: 30000,
      data: params,
    });
    return mSuccess(response.data);
  } catch (error) {
    console.error(error);
    throw mError(error);
  }
}

export async function GeneralRequest(route, type = 'GET', params = {}) {
  const resp = await reqtsApiForm(
    route,
    true,
    type,
    params,
    (data) => data,
    (error) => {
      throw error;
    }
  );
  return resp;
}

export function getLocalToken() {
  return JSON.parse(localStorage.getItem('token'));
}
