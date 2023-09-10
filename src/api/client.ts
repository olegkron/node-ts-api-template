import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import { config } from '../constants/config'

const instance: AxiosInstance = axios.create({
  baseURL: config.baseUrl,
})

export type ApiResponse<T> = {
  data: T
  error?: string
  status: number
  headers: any
  ok: boolean
}

async function get<T>(url: string, axiosConfig?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await instance.get(url, axiosConfig)
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
      ok: response.status >= 200 && response.status < 300,
    }
  } catch (error) {
    const { response } = error
    const ok = response?.status ? response.status >= 200 && response.status < 300 : false
    return {
      data: null,
      error: response?.data?.error || "Couldn't reach server",
      status: response?.status || 500,
      headers: response?.headers,
      ok,
    }
  }
}

async function post<T>(url: string, data?: any, axiosConfig?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await instance.post(url, data, axiosConfig)
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
      ok: response.status >= 200 && response.status < 300,
    }
  } catch (error) {
    const { response } = error
    const ok = response?.status ? response.status >= 200 && response.status < 300 : false
    return {
      data: null,
      error: response?.data?.error || "Couldn't reach server",
      status: response?.status || 500,
      headers: response?.headers,
      ok,
    }
  }
}

const apiClient = {
  get,
  post,
}

export default apiClient
