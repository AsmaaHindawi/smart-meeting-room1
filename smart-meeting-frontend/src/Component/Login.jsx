import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../App.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden Login"
      style={{ backgroundColor: '#1E293B' }}
    >
    
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-sm text-white font-medium hover:underline z-20"
      >
        ← Back to Home
      </button>

      <div className="flex items-center justify-center bg-[#ffffff] relative rounded-[25px] w-[900px] h-[600px]">
        <div
          className="absolute w-[400px] h-[400px] bg-500 opacity-50 rounded-full top-[270px] left-[-180px]"
          style={{ backgroundColor: '#1E293B' }}
        ></div>
        <div
          className="absolute w-[400px] h-[400px] bg-500 opacity-50 rounded-full top-[-140px] right-[-150px]"
          style={{ backgroundColor: '#1E293B' }}
        ></div>

        <div className="p-10 w-[400px] z-10">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-1">Sign In</h2>
          <p className="text-sm text-center text-gray-400 mb-6">Welcome !</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold hover:from-indigo-600 hover:to-indigo-700 transition"
            >
              Sign In
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;
