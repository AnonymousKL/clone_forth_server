import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RequireAuth from 'components/RequireAuth';
import Error from 'pages/404';
import Login from 'pages/Login';
import Projects from 'pages/Projects';
import Create from 'pages/projects/Create';
import Dashboard from 'pages/Dashboard';
import ProjectDetail from 'pages/projects/Detail';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Error />} />

        {/* Private routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="projects/create" element={<Create />} />
          <Route path="users" element={<div>Users</div>} />
          <Route path="sales" element={<div>Sales</div>} />
          <Route path="contract" element={<div>Contract</div>} />
          <Route path="cashflow" element={<div>Cash Flow</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App;
