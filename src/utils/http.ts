import axios from "axios";
import { getCookie } from "./cookie";

const http = axios.create({ baseURL: "http://localhost:8081" });
//요청값에 대해서 사전처리
http.interceptors.request.use((config) => {
  const token = getCookie("token");
  console.log("---token---");
  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//응답값에 대해서 사전처리
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;
    if (status === 401 || status === 403) {
      alert("인증이 필요하거나 토큰이 만료되었습니다.");
      //로그인 페이지로 이동
      window.location.href = "/login";
    }

    if (status === 404) {
      alert("데이터가 존재하지 않습니다.");
    }

    // return Promise.reject(error); <<화면에 error가 뜸.
    return; //이렇게 하면 오류를 캐치만 하고 끝냄.
  },
);

export default http;
