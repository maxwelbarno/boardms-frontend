'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { accessToken, logout } = useAuth();
  const [name, setName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken, router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/v1/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },

          credentials: 'include',
        });

        const data = await res.json();

        console.log(data);

        // setName(res.user.name);
      } catch {
        setName('');
      }
    };

    if (accessToken) fetchUser();
  }, [accessToken]);

  if (!accessToken) return null;

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full bg-white p-6 rounded shadow-md'>
        <h1 className='text-2xl font-semibold mb-4'>Dashboard</h1>
        <h2 className='text-xl mb-4'>Welcome, {name}!</h2>
        <div className='mb-6 space-y-2'>
          <p>You’re logged in 🎉</p>
          <button
            onClick={() => router.push('/settings')}
            className='w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition'
          >
            Go to Settings
          </button>
        </div>
        <button
          onClick={() => logout()}
          className='w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition'
        >
          Logout
        </button>
      </div>
    </div>
  );
}
