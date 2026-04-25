
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { ShoppingBag, User, LogOut } from 'lucide-react';

// Using simple SVG icons since lucide-react might not be pre-installed in all environments
const BagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-600 font-brand">HomeTiffin</span>
            <span className="ml-1 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">BETA</span>
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <>
                    <Link to="/dashboard" className="text-gray-600 hover:text-orange-600 font-medium">Explore</Link>
                    <Link to="/checkout" className="relative group">
                      <BagIcon />
                      {cart.items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                          {cart.items.length}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                {user?.role === 'cook' && (
                  <Link to="/cook/dashboard" className="text-gray-600 hover:text-orange-600 font-medium">My Kitchen</Link>
                )}
                
                <div className="flex items-center space-x-2 border-l pl-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {user?.name[0]}
                  </div>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600">
                    <LogOutIcon />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="bg-orange-600 text-white px-5 py-2 rounded-full font-medium hover:bg-orange-700 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;

export default Navbar;
