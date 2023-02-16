import { AxiosRequestConfig } from "axios";
import axios from "__mocks";

interface FetchWrapProps {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  config?: AxiosRequestConfig;
}

// Rm later
export async function fetchData<Type> (url: string): Promise<{
  success: boolean,
  data?: Type,
  errorMessage?: string,
}> {
  try {
    const response = await axios.get<Type>(url)
    return {
      success: true,
      data: response.data || undefined,
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown Error !'
    }
  }
}

const fetchWrap = async ({ method, url, config }: FetchWrapProps) => {
  try {
    const { data } =
    (method === 'get' && await axios.get(url, config)) ||
    (method === 'post' && await axios.post(url, config)) ||
    (method === 'put' && await axios.put(url, config)) ||
    (method === 'delete' && await axios.delete(url, config)) ||
    {}
    return data
  } catch (e: any) {
    throw e
  }
}

export const GET = (url: string, config?: AxiosRequestConfig<any>) => fetchWrap({ method: 'get', url, config })
export const POST = (url: string, config?: AxiosRequestConfig<any>) => fetchWrap({ method: 'post', url, config })
export const PUT = (url: string, config?: AxiosRequestConfig<any>) => fetchWrap({ method: 'put', url, config })
export const DELETE = (url: string) => fetchWrap({ method: 'delete', url })
