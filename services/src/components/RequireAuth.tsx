import { Navigate, Outlet } from "react-router-dom"
import useAuth from "hooks/useAuth"
import MainLayout from "components/layout/MainLayout"

const RequireAuth = () => {
  const { isLoggedIn } = useAuth()
  console.log(isLoggedIn)

  if (!isLoggedIn) {
    return (
      <Navigate to="/login" replace />
    )
  }
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export default RequireAuth
