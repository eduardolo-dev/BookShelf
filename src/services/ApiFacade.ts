import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

class ApiFacade {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:3001', // Esto sería una variable de entorno
    })
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.client.get(url, config)
  }

  post(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.post(url, data, config)
  }

  put(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.put(url, data, config)
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.client.delete(url, config)
  }
}

export default new ApiFacade()
