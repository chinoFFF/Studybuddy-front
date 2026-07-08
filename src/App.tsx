import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import './styles/auth.css';
import './App.css';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { StudentDashboard } from './pages/StudentDashboard';
import { Sidebar } from './components/sidebar';
import { PublicRoute } from './layouts/PublicRoute';
import { CatchAllRoute } from './layouts/CatchAllRoute';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <main className="flex-1 max-h-screen overflow-y-auto">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/*RUTAS PRIVADAS*/}
            <Route element={<ProtectedRoute />}>
              <Route path="/sidebar" element={<Sidebar />} />
              <Route
                path="/dashboard"
                element={
                  <div className="flex min-h-screen w-full">
                    <Sidebar />
                    <div className="flex-1 min-w-0">
                      <StudentDashboard />
                    </div>
                  </div>
                }
              />
            </Route>

            {/*RUTAS PÚBLICAS*/}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route path="*" element={<CatchAllRoute />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;