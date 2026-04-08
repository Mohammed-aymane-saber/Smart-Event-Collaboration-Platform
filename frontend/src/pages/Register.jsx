import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', { username, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <UserPlus size={48} color="var(--primary)" />
        </div>
        <h2 className="auth-title text-gradient">Create Account</h2>
        {error && <div style={{ color: '#ef4444', marginBottom: 15, textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 10 }}>Sign Up</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </div>
      </div>
    </div>
  );
}
