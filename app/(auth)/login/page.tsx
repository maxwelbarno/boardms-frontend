import LoginForm from '@/app/components/forms/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'This is the login page for BoardMS application.',
};

export default function Login() {
  return <LoginForm />;
}
