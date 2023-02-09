import { Navigate, Outlet } from "react-router-dom"
import useAuth from "hooks/useAuth"

const NoAuth = () => {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn) {
    return (
      <Navigate to="/" replace />
    )
  }
  return (
    <Outlet />
  )
}

export default NoAuth
