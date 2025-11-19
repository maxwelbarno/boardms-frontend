'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Checkbox from '../ui/input/Checbox';
import Label from '../ui/input/Label';
import Input from '../ui/input/Input';
import Button from '../ui/input/Button';
import { useAuth } from '@/context/AuthContext';
import { EyeCloseIcon, EyeIcon } from '@/assets/icons';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const { setAccessToken } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setShowErrorModal(false);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();
      setAccessToken(result.accessToken);

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setError(errorMessage);
      setErrorDetails({
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError('');
    setErrorDetails(null);
  };

  return (
    <>
      <div className='flex flex-col flex-1 lg:w-1/2 w-full'>
        <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
          <div>
            <div className='mb-5 sm:mb-8 text-center'>
              <h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
                BoardMS System
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Government Meeting Management Platform
              </p>
            </div>

            <div className='mb-5 sm:mb-8'>
              <h2 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90'>
                Sign In
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Enter your credentials to access the system
              </p>
            </div>

            {/* Inline error message (small) */}
            {error && !showErrorModal && (
              <div className='p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'>
                <strong>Error:</strong> {error.split('\n')[0]}
                <button onClick={() => setShowErrorModal(true)} className='ml-2 text-xs underline'>
                  View details
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='space-y-6'>
                <div>
                  <Label>
                    Username <span className='text-error-500'>*</span>{' '}
                  </Label>
                  <Input
                    placeholder='your.email@gov.go.ke'
                    type='email'
                    name='email'
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className='text-error-500'>*</span>{' '}
                  </Label>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      name='password'
                      disabled={isLoading}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2'
                    >
                      {showPassword ? (
                        <EyeIcon className='fill-gray-500 dark:fill-gray-400' />
                      ) : (
                        <EyeCloseIcon className='fill-gray-500 dark:fill-gray-400' />
                      )}
                    </span>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Checkbox checked={isChecked} onChange={setIsChecked} disabled={isLoading} />
                    <span className='block font-normal text-gray-700 text-theme-sm dark:text-gray-400'>
                      Remember me
                    </span>
                  </div>
                  <Link
                    href='/reset-password'
                    className='text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400'
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className='w-full' size='sm' type='submit'>
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
