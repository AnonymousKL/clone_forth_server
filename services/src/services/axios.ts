import axios from "__mocks";

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
