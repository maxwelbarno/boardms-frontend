// app/(admin)/dashboard/page.tsx
import React from 'react';

import type { Metadata } from 'next';
// import RecentMemos from '@/components/dashboard/RecentMemos';
// import UpcomingMeetings from '@/components/meetings/UpcomingMeetings';
// import ActionItems from '@/components/dashboard/ActionItems';
// import WorkflowChart from '@/components/dashboard/WorkflowChart';

export const metadata: Metadata = {
  title: 'E-Cabinet Dashboard | Government Decision Management System',
  description: 'E-Cabinet System Dashboard for Government Workflow Management',
};

export default function Dashboard() {
  //   return (
  //     <div className='grid grid-cols-12 gap-4 md:gap-6'>
  //       {/* Upcoming Meetings */}
  //       {/* <div className='col-span-12 xl:col-span-12'>
  //         <UpcomingMeetings />
  //       </div> */}
  //       <h1>Dashboard</h1>
  //     </div>
  //   );

  return <h1>Hello World</h1>;
}
