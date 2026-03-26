import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Button } from './UI';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="border-b border-glassBorder bg-darkBg/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight flex items-center gap-2">
                            <span className="bg-blue-600 text-white p-1 rounded-lg">AX</span> AuditX
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 text-textSecondary font-medium">
                                    <User size={18} />
                                    <span>{user.name} ({user.role})</span>
                                </div>
                                <Button variant="secondary" onClick={handleLogout} className="flex items-center gap-2 !px-4 !py-1 text-sm">
                                    <LogOut size={16} /> Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login" className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors font-medium">Login</Link>
                                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors font-medium shadow-lg shadow-blue-500/30">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
