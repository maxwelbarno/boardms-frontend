import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const res = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  const data = await res.json();

  const response = NextResponse.json(data, { status: res.status });

  const backendCookie = res.headers.get('set-cookie');

  if (backendCookie) {
    response.headers.set('set-cookie', backendCookie);
  }

  return response;
};
