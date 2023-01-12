import useUserStore from "store/useUserStore"

const useAuth = () => {
  let token: string | null
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn)

  if (!isLoggedIn) {
    token = localStorage.getItem('token')
    token ? setIsLoggedIn(true) : setIsLoggedIn(false)
  }

  return { isLoggedIn }
}

export default useAuth
