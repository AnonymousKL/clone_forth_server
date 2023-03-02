import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from 'components/RequireAuth';
import Error from 'pages/404';
// import Login from 'pages/Login';
import Projects from 'pages/Projects';
import Create from 'pages/projects/Create';
// import Dashboard from 'pages/Dashboard';
import Members from 'pages/Members';
import CreateMember from 'pages/members/Create';
import MemberDetail from 'pages/members/Detail';
import ProjectDetail from 'pages/projects/Detail';
import NoAuth from 'components/NoAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Private routes */}
        <Route element={<RequireAuth />}>
          <Route path="" element={<Navigate to="/projects" replace />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="projects/create" element={<Create />} />
          <Route path="members" element={<Members />} />
          <Route path="members/:id" element={<MemberDetail />} />
          <Route path="members/create" element={<CreateMember />} />
          <Route path="sales" element={<div>Sales</div>} />
          <Route path="contract" element={<div>Contract</div>} />
          <Route path="cashflow" element={<div>Cash Flow</div>} />
        </Route>

        {/* Public routes */}
        <Route path="login" element={<NoAuth />} />
        <Route path="*" element={<Error />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
