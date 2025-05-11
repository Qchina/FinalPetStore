import axios from 'axios';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '', // API的base_url
  timeout: 15000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，例如添加token
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response;
  },
  error => {
    // 对响应错误做点什么
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

export default service;