import { BASE_URL, axios } from ".";
export function getUserInfo() {
  return axios.get(`${BASE_URL}/getUserInfo`);
}

export const getVerifyCode = (email: string) => {
  return axios.get(`${BASE_URL}/users/getVerifyCode?email=${email}`);
};

export const register = (params: {
  email: string;
  password: string;
  code: string;
}) => {
  return axios.post(`${BASE_URL}/users/register`, params);
};

export const login = (params: { email: string; password: string }) => {
  return axios.post(`${BASE_URL}/users/login`, params);
};
