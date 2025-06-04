import { AxiosRequestConfig } from 'axios';
import { TagResponse } from '../context/TagContext';
import { categorizationPlusRequest } from './axiosRequest';

let config: AxiosRequestConfig = {};

export async function getTags() {
  config = {
    method: 'GET',
    url: 'tags/',
  };
  return await categorizationPlusRequest<TagResponse[]>(config);
}

export async function createTag(newTag: TagResponse) {
  config = {
    method: 'POST',
    url: 'tags/',
    data: newTag,
  };
  return await categorizationPlusRequest<TagResponse>(config);
}

export async function updateTag(tag: TagResponse) {
  config = {
    method: 'PATCH',
    url: `tags/${tag.id}/`,
    data: tag,
  };
  return await categorizationPlusRequest<TagResponse>(config);
}

export async function deleteATag(tagid: TagResponse['id']) {
  config = {
    method: 'PATCH',
    url: `tags/${tagid}/`,
  };
  return await categorizationPlusRequest<TagResponse>(config);
}
