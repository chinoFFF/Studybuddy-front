import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import './styles/auth.css';
import './App.css';
import { StudentDashboard } from './pages/StudentDashboard';
import { Sidebar } from './components/sidebar';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <main className="flex-1 max-h-screen overflow-y-auto">
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Navigate to="/login" replace />} />
            

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<StudentDashboard />} />            
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;