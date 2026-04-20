import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '../types';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('WORKER');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // MOCK LOGIN - Replace with actual API call to FastAPI
    login({ id: '1', name: 'User', role, token: 'mock-jwt-token' });
    
    if (role === 'WORKER') navigate('/worker');
    else if (role === 'CLIENT') navigate('/client');
    else navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-black text-blue-600 mb-6 text-center">SafeStay</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">I am a:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="WORKER">Caregiver (Worker)</option>
            <option value="CLIENT">Family (Client)</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>

        <input 
          type="email" placeholder="Email" required
          className="w-full p-3 mb-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition">
          Sign In
        </button>
      </form>
    </div>
  );
};