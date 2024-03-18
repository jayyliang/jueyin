import { BASE_URL, axios } from ".";

export const getMyArticle = () => {
  return axios.get(`${BASE_URL}/articles/getMyArticle`);
};

export const deleteArticle = (params: { id: number }) => {
  return axios.post(`${BASE_URL}/articles/deleteArticle`, params);
};

export const createOrUpdateArticle = (params: {
  id?: number;
  title?: string;
  content?: string;
}) => {
  return axios.post(`${BASE_URL}/articles/createOrUpdate`, params);
};

export const publishArticle = (params: {
  id: number;
  categoryId: number;
  introduction: string;
}) => {
  return axios.post(`${BASE_URL}/articles/publish`, params);
};

export const getCategoryList = () => {
  return axios.get(`${BASE_URL}/articles/getCategoryList`);
};

export const getArticleInfo = (id: number) => {
  return axios.get(`${BASE_URL}/articles/getArticleInfo?id=${id}`);
};
