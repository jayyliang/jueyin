import { BASE_URL, axios } from ".";
export function getUserInfo() {
  return axios.get(`${BASE_URL}/users/getUserInfo`);
}

export const getVerifyCode = (email: string,code:string) => {
  return axios.get(`${BASE_URL}/users/getVerifyCode?email=${email}&code=${code}`);
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

export const upload = (params: any) => {
  return axios.post(`${BASE_URL}/common/upload`, params);
};

export const updateUserInfo = (params: {
  username: string;
  info: string;
  avatar: string;
}) => {
  return axios.post(`${BASE_URL}/users/updateUserInfo`, params);
};

export const getUserInfoById = (id: number) => {
  return axios.get(`${BASE_URL}/users/getUserInfoById/${id}`);
};
