import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <LogIn size={48} color="var(--primary)" />
        </div>
        <h2 className="auth-title text-gradient">Welcome Back</h2>
        {error && <div style={{ color: '#ef4444', marginBottom: 15, textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 10 }}>Sign In</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
