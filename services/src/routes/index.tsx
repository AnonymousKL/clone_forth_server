import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './config';
import RequireAuth from 'components/RequireAuth';
import MainLayout from 'components/layout/MainLayout';

const router = (
  <BrowserRouter>
    <Routes>
      {publicRoutes.map((route, index) => {
        const Component = route.component
        return <Route key={index} path={route.path} element={<Component />} />
      })}
      <Route element={<RequireAuth />}>
        {privateRoutes.map((route, index) => {
          const Component = route.component
          const Layout = route.layout || MainLayout
          return <Route key={index} path={route.path} element={
            <Layout>
              <Component />
            </Layout>
          } />
        })}
      </Route>
    </Routes>
  </BrowserRouter>
)

export default router
