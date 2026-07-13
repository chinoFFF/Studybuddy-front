import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AcceptInvitation } from './pages/AcceptInvitation';
import './styles/auth.css';
import './App.css';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { StudentDashboard } from './pages/StudentDashboard';
import { Sidebar } from './components/sidebar';
import { PublicRoute } from './layouts/PublicRoute';
import { CatchAllRoute } from './layouts/CatchAllRoute';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { Examenes } from './pages/Examenes';
import { AllRooms } from './pages/AllRooms';
import { AIChatRoom } from './pages/AIChatRoom';

function App() {
  return (
    <div className="h-screen overflow-hidden bg-gray-50 font-sans antialiased">
      <main className="flex-1 max-h-screen overflow-y-auto">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Ruta independiente: AcceptInvitation maneja internamente
                si el usuario ya tiene sesión o no. */}
            <Route path="/invitations/accept" element={<AcceptInvitation />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/sidebar" element={<Sidebar />} />
              <Route
                path="/dashboard"
                element={
                  <div className="flex min-h-screen w-full">
                    <Sidebar />
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <StudentDashboard />
                    </div>
                  </div>
                }
              />
              <Route
                path="/mis-salas"
                element={
                  <div className="flex min-h-screen w-full">
                    <Sidebar />
                    <div className="flex-1 min-w-0">
                      <AllRooms />
                    </div>
                  </div>
                }
              />
              <Route
                path="/flashcards"
                element={
                  <div className="flex min-h-screen w-full">
                    <Sidebar />
                    <div className="flex-1 min-w-0">
                      <FlashcardsPage />
                    </div>
                  </div>
                }
              />
              <Route
                path="/examenes"
                element={
                  <div className="flex min-h-screen w-full">
                    <Sidebar />
                    <div className="flex-1 min-w-0">
                      <Examenes />
                    </div>
                  </div>
                }
              />
              {/* :roomId es obligatorio ahora — AIChatRoom lo necesita para
                  crear la sesión de chat (room_id) y subir documentos. */}
              <Route
                path="/AIChatRoom/:roomId"
                element={
                  <div className="flex min-h-screen w-full">
                    <Sidebar />
                    <div className="flex-1 min-w-0">
                      <AIChatRoom />
                    </div>
                  </div>
                }
              />
            </Route>

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