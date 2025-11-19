'use client';

import React from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { Sidebar } from 'lucide-react';
import Backdrop from '../components/sidebar/Backdrop';
import Header from '../components/header/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
      ? 'lg:ml-[290px]'
      : 'lg:ml-[90px]';

  return (
    <div className='min-h-screen xl:flex bg-gray-50 dark:bg-gray-900'>
      <Sidebar />
      <Backdrop />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <Header />
        <div className='p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6'>{children}</div>
      </div>
    </div>
  );
}
