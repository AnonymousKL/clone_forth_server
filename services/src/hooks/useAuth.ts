import useUserStore from "store/useUserStore"

const useAuth = () => {
  let token: string | null
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn)
  token = localStorage.getItem('token')
  if (!isLoggedIn) {
    token ? setIsLoggedIn(true) : setIsLoggedIn(false)
  }
  return { isLoggedIn: Boolean(token) }
}

export default useAuth
