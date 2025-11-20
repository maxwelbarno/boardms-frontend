'use client';
import React, { useEffect } from 'react';

import UpcomingMeetings from '@/app/components/meetings/UpcomingMeetings';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !accessToken) {
      router.push('/login');
    }
  });

  if (loading || !accessToken) return null;

  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      <div className='col-span-12 xl:col-span-12'>
        <UpcomingMeetings />
      </div>
    </div>
  );
}
