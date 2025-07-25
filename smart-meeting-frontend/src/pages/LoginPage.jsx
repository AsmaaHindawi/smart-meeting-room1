// src/pages/LoginPage.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginPage() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await signIn({ email, password });
      // react-router will redirect via PrivateRoute
    } catch {
      setErr('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      {err && <div className="text-red-600">{err}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="block w-full mb-2 p-2 border"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="block w-full mb-4 p-2 border"
      />
      <button type="submit" className="w-full p-2 bg-aqua rounded">
        Login
      </button>
    </form>
  );
}
