
import { Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Topbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();


    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });


    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-5 sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-4">
                <h1
                    onClick={() => navigate('/')}
                    className="text-xl font-bold text-primary cursor-pointer"
                >
                    CoWrite
                </h1>
                <span className="text-sm text-muted-foreground pl-4 border-l border-border hidden sm:block">
                    Documents
                </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* User info */}z
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-muted">
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{user?.name || 'User'}</span>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

export default Topbar;
