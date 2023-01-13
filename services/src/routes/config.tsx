import App from "pages/App"
import Login from "pages/Login"
import MainLayout from "components/layout/MainLayout"

type RouteConfig = {
  path: string,
  component: any,
  layout?: any,
}

export const publicRoutes: RouteConfig[] = [
  { path: '/login', component: Login }
]

export const privateRoutes: RouteConfig[] = [
  { path: '/', component: App, layout: MainLayout }
]
