import { Navigate } from "react-router-dom"
import useAuth from "hooks/useAuth"
import Login from "pages/Login"

const NoAuth = () => {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn) {
    return (
      <Navigate to="/" replace />
    )
  }
  return (
    <Login />
  )
}

export default NoAuth
