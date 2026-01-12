import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';


import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DocumentPage from './pages/DocumentPage';

import DocumentLayout from './layouts/DocumentLayout';


import ProtectedRoute from './components/ProtectedRoute';


const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (user) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          {/* Document Routes */}
          <Route path="/document" element={
            <ProtectedRoute>
              <DocumentLayout />
            </ProtectedRoute>
          }>
            <Route path=":id" element={<DocumentPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
