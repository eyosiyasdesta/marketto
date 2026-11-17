import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, authMode, setAuthMode, closeAuth, login, register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter all required fields.');
      return;
    }

    setLoading(true);
    if (authMode === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid email or password.');
      }
    } else {
      if (!fullName) {
        setErrorMsg('Please enter your full name.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      const res = await register(fullName, email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Registration failed. Email may already be in use.');
      } else {
        setFullName('');
        setPassword('');
      }
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={closeAuth}>
      <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeAuth} aria-label="Close">
          ✕
        </button>

        <h2>{authMode === 'login' ? 'Sign In' : 'Create Account'}</h2>
        <p className="subtitle">
          {authMode === 'login'
            ? 'Access your orders, wishlist & recommendations'
            : 'Join Marketto and start shopping'}
        </p>

        {errorMsg && (
          <div
            className="form-error"
            style={{
              padding: '8px 12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '6px',
              marginBottom: '12px',
              fontSize: '13px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="i.e. Eyosiyas Desta"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder={authMode === 'login' ? '••••••••' : 'At least 6 characters'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn-primary full-width"
            style={{ marginTop: '16px' }}
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : authMode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        <p className="switch-auth" style={{ marginTop: '16px', textAlign: 'center' }}>
          {authMode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setErrorMsg('');
                  setAuthMode('register');
                }}
                style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setErrorMsg('');
                  setAuthMode('login');
                }}
                style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
