import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from "pages/App";
import Login from "pages/Login";
import RequireAuth from 'components/RequireAuth';

const router = (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={(<Login />)} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={(<App />)} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default router
