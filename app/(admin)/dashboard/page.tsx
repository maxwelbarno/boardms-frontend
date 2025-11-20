import React from 'react';

import type { Metadata } from 'next';
import UpcomingMeetings from '@/app/components/meetings/UpcomingMeetings';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'E-Cabinet System Dashboard for Government Workflow Management',
};

export default function Dashboard() {
  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      <div className='col-span-12 xl:col-span-12'>
        <UpcomingMeetings />
      </div>
    </div>
  );
}
