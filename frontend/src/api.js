import axios from 'axios';
let tokenGetter=()=>null;
export const setTokenGetter=getter=>{tokenGetter=getter;};
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:4000/api',timeout:20000});
api.interceptors.request.use(config=>{const base=new URL(api.defaults.baseURL,window.location.origin);const target=new URL(config.url||'',config.baseURL||base);if(target.origin===base.origin){const token=tokenGetter();if(token)config.headers.Authorization=`Bearer ${token}`;}return config;});
export const authApi={login:data=>api.post('/auth/login',data),register:data=>api.post('/auth/register',data),me:()=>api.get('/auth/me'),logout:()=>api.post('/auth/logout')};
export const docsApi={list:params=>api.get('/documents',{params}),upload:(form,onUploadProgress)=>api.post('/documents/upload',form,{onUploadProgress}),remove:id=>api.delete(`/documents/${id}`),download:id=>api.get(`/documents/${id}/download`,{responseType:'blob'}),preview:id=>api.get(`/documents/${id}/preview`,{responseType:'blob'})};
export const notificationApi={list:()=>api.get('/notifications'),read:id=>api.patch(`/notifications/${id}/read`),readAll:()=>api.patch('/notifications/read-all')};
