import api from './api'
import type { Currency, ApiResponse } from '@/types/company'

export interface CurrencyService {
  getCurrencies(): Promise<ApiResponse<Currency[]>>
  getCurrency(uuid: string): Promise<ApiResponse<Currency>>
  getExchangeRates(): Promise<ApiResponse<any>>
}

class CurrencyServiceImpl implements CurrencyService {
  async getCurrencies(): Promise<ApiResponse<Currency[]>> {
    const response = await api.get('/currencies')
    return response.data
  }

  async getCurrency(uuid: string): Promise<ApiResponse<Currency>> {
    const response = await api.get(`/currencies/${uuid}`)
    return response.data
  }

  async getExchangeRates(): Promise<ApiResponse<any>> {
    const response = await api.get('/currencies/exchange-rates')
    return response.data
  }
}

export default new CurrencyServiceImpl()