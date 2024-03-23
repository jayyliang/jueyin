import { BASE_URL, axios } from ".";

export const toggleLike = (params: any) => {
  return axios.post(`${BASE_URL}/likes/toggleLike`, params);
};

export const getLikes = (params: any) => {
  return axios.post(`${BASE_URL}/likes/getLikes`, params);
};
