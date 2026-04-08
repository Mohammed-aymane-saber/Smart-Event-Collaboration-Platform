import { Link, useNavigate } from 'react-router-dom';
import { Calendar, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand text-gradient" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Calendar size={28} color="var(--primary)" />
        SmartEvents
      </Link>
      <div className="nav-links">
        {token ? (
          <>
            <span style={{ color: 'var(--text-muted)' }}>Hello, <strong style={{ color: 'var(--text-main)' }}>{user.username}</strong></span>
            <button onClick={handleLogout} className="btn-outline flex items-center" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary">Login</Link>
        )}
      </div>
    </nav>
  );
}
