import React, { useState } from 'react';
import { useAuth } from './Authcontext';

export const SignupForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { checkAuth } = useAuth(); 

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const response = await fetch('http://localhost:8000/_allauth/browser/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || '',
            },
            credentials: 'include',
            body: JSON.stringify({ 
                username: username, 
                password: password,
                password_confirm: confirmPassword 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            await checkAuth();
            window.location.href = '/'; 
        } else {
            setError(data.errors?.[0]?.message || "Signup failed");
        }
    };

    return (
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {error && <p className="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</p>}
            <input 
                type="text" 
                placeholder="Choose Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-500 outline-none"
                required 
            />
            <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-500 outline-none"
                required 
            />
            <input 
                type="password" 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-500 outline-none"
                required 
            />
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold p-2  cursor-pointer">
                Register Trainer
            </button>
        </form>
    );
};

function getCookie(name: string): string | null {
    let cookieValue: string | null = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}