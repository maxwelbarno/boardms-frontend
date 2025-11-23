'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Photo } from './Photo';

type Role = 'superadmin' | 'admin' | 'user';
type Status = 'active' | 'inactive' | 'pending' | 'suspended';

const roleColors: Record<Role | 'superadmin', string> = {
  superadmin: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  user: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

const statusColors: Record<Status, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function Users() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'GET',
        credentials: 'include',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { users } = await response.json();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleColor = (role: string): string => {
    return roleColors[role as Role] || roleColors.admin;
  };
  const getStatusColor = (status: string): string => {
    return statusColors[status as Status] || statusColors.inactive;
  };

  if (loading) {
    return (
      <div className='rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 p-6'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4'></div>
          <div className='space-y-3'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='h-16 bg-gray-200 dark:bg-gray-700 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3'>
      {/* Users Table */}
      <div className='overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-700'>
                <th className='px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300'>
                  User
                </th>
                <th className='px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300'>
                  Role
                </th>
                <th className='px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300'>
                  Status
                </th>
                <th className='px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300'>
                  Last Login
                </th>
                <th className='px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-300'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
              {users?.map((user) => (
                <tr key={user.id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='shrink-0'>
                        <Photo user={user} />
                      </div>
                      <div>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                          {user.firstName}
                        </div>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                          {user.lastName}
                        </div>
                        <div className='text-sm text-gray-500 dark:text-gray-400'>
                          {user.username}
                        </div>
                        {user.phone && (
                          <div className='text-xs text-gray-400 dark:text-gray-500'>
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleColor(user.role.name)}`}
                    >
                      {user.role.name}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(user.status)}`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                    {user.lastLogin
                      ? `${new Date(user.lastLogin).toLocaleDateString()} at ${new Date(user.lastLogin).toLocaleTimeString()}`
                      : 'Never'}
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <button
                        onClick={() => {}}
                        className='rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {}}
                        className='rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition-colors duration-200'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
