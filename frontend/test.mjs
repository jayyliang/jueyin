import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    Cookie:
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImVtYWlsIjoiMjQ0MzM3NDYyQHFxLmNvbSIsImlhdCI6MTcxMTk4MDY0OCwiZXhwIjoxNzEyNTg1NDQ4fQ.oi7eE_W4-hJ9MPs3i4UdA2Zh3yIYmiUSoTJd-Trq2vI; Path=/; HttpOnly",
  },
});

for (let i = 0; i < 10; i++) {
  axiosInstance.get("http://localhost:3000/api/articles/getArticleInfo?id=1");
}
