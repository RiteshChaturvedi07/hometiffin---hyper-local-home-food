
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import CustomerDashboard from './pages/Customer/Dashboard';
import KitchenDetails from './pages/Customer/KitchenDetails';
import CookDashboard from './pages/Cook/Dashboard';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/Admin/Dashboard';

const App: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Customer Routes */}
            <Route 
              path="/dashboard" 
              element={user?.role === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/kitchen/:id" 
              element={user?.role === 'customer' ? <KitchenDetails /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/checkout" 
              element={user?.role === 'customer' ? <Checkout /> : <Navigate to="/login" />} 
            />

            {/* Cook Routes */}
            <Route 
              path="/cook/dashboard" 
              element={user?.role === 'cook' ? <CookDashboard /> : <Navigate to="/login" />} 
            />

            {/* Super Admin Route */}
            <Route 
              path="/admin/dashboard" 
              element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-white border-t py-8 text-center text-gray-500 text-sm">
          <p>© 2024 HomeTiffin. Built with ❤️ for Students & Bachelors.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
