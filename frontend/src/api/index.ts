let _BASE_URL = "/api";
if (import.meta.env.PROD) {
} else {
  _BASE_URL = "/api";
}
import { message } from "antd";
import _axios from "axios";

const axiosInstance = _axios.create({
  withCredentials: true, // 是否允许带cookie这些
});
axiosInstance.interceptors.request.use((request) => {
  return request;
});
axiosInstance.interceptors.response.use(
  (response: any) => {
    const data = response.data;
    if (data.status === 401 && location.href.includes("user")) {
      location.href = `${location.protocol}//${
        location.host
      }/#/login?redirect_url=${encodeURIComponent(location.href)}`;
    } else if (data.status !== 200) {
      message.error(data.message);
      return Promise.reject(data.message);
    }
    return response.data;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。对响应错误时调用。
    console.error("请求错误: ", error);
    return Promise.reject(error);
  }
);

export const BASE_URL = _BASE_URL;
export const axios = axiosInstance;
