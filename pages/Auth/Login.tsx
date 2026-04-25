
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/authSlice';
import { Role } from '../../types';

const Login: React.FC = () => {
  const [role, setRole] = useState<Role>('customer');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMockLogin = (type: 'google' | 'phone') => {
    // Simulated mock login logic
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === 'customer' ? 'Rahul Kumar' : role === 'admin' ? 'Super Admin' : 'Mrs. Sharma',
      email: role === 'customer' ? 'rahul@example.com' : role === 'admin' ? 'admin@hometiffin.com' : 'sharma.kitchen@example.com',
      phone: '9876543210',
      role: role,
      walletBalance: role === 'customer' ? 500 : 0,
      dietaryPreferences: [],
      savedAddresses: []
    };

    dispatch(setUser(mockUser));
    
    if (role === 'customer') {
      navigate('/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/cook/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 font-brand">Welcome Back!</h2>
          <p className="text-gray-500 mt-2">Choose how you want to use HomeTiffin</p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl mb-8 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setRole('customer')}
            className={`flex-1 py-2 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition whitespace-nowrap ${role === 'customer' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
          >
            Customer
          </button>
          <button 
            onClick={() => setRole('cook')}
            className={`flex-1 py-2 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition whitespace-nowrap ${role === 'cook' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
          >
            Cook
          </button>
          <button 
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition whitespace-nowrap ${role === 'admin' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
          >
            Admin
          </button>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => handleMockLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 p-4 rounded-2xl font-bold hover:bg-gray-50 transition transform active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="google" />
            Continue with Google
          </button>
          
          <button 
            onClick={() => handleMockLogin('phone')}
            className="w-full flex items-center justify-center gap-3 bg-orange-600 text-white p-4 rounded-2xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-100 transform active:scale-95"
          >
            Continue with Phone Number
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-400 uppercase font-black tracking-widest mt-10">
          Trusted by 10,000+ Indian Homes
        </p>
      </div>
    </div>
  );
};

export default Login;
