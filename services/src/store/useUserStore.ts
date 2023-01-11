import create from "zustand";
import { fetchData } from "services/axios";
import { apiEndpoint } from "services/api";

interface User {
  id: number,
  name: string,
  role: string,
}

interface UserState {
  user: User,
  fetching: boolean,
  errorMessage: string,
  fetch: () => void,
}

const useUserStore = create<UserState>()((set) => ({
  user: {
    id: 0,
    name: '',
    role: '',
  },
  fetching: false,
  errorMessage: '',
  fetch: async () => {
    set({ fetching: true })

    const { success, data, errorMessage } = await fetchData<User>(apiEndpoint.GET_USER)
    if (success) {
      set({ user: data })
    } else {
      set({ errorMessage })
    }

    set({ fetching: false })
  },
}))

export default useUserStore
