import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const res = await fetch('http://localhost:3000/api/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: req.headers.get('cookie') || '' },
    credentials: 'include',
  });

  const data = await res.json();

  const response = NextResponse.json(data, { status: res.status });

  const setCookie = res.headers.get('set-cookie');

  if (setCookie) {
    response.headers.set('set-cookie', setCookie);
  }

  return response;
};
