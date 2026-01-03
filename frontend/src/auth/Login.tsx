import React, { useState } from 'react';

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

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  const response = await fetch('http://localhost:8000/_allauth/browser/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') || '',
    },
    credentials: 'include',
    body: JSON.stringify({ 
      username: email, // Django wants 'username' as the key
      password: password 
    }),
  });

  const data = await response.json();

  if (response.ok) {
    window.location.href = '/'; 
  } else {
    console.error("Login Errors:", data.errors);
  }
};

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="border p-2"
        placeholder="Email" 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="border p-2"
        placeholder="Password" 
      />
      <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
    </form>
  );
};