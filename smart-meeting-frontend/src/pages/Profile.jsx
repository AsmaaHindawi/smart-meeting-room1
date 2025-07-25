// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { fetchCurrentUser, updateProfile } from '../services/userService';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchCurrentUser().then(res => {
      setUser(res.data);
      setEmail(res.data.email);
    });
  }, []);

  const save = () =>
    updateProfile({ email }).then(() => setMsg('Saved!'));

  if (!user) return <div>Loading…</div>;
  return (
    <div className="p-4 space-y-2">
      <h2>Profile</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2"
      />
      <button onClick={save} className="p-2 bg-aqua rounded">
        Update
      </button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
