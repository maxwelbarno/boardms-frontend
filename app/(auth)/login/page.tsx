import LoginForm from '@/app/components/forms/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BoardMS - Sign In',
  description: 'This is the Sign In page for the BoardMS application.',
};

export default function Login() {
  return <LoginForm />;
}
