import { useState } from 'react';
import Image from 'next/image';

export function Photo({ user }: { user: User }) {
  const [imageError, setImageError] = useState(false);

  if (!user.picture.data || imageError) {
    return (
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10'>
        <span className='text-sm font-medium text-brand-500'>
          {`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}
        </span>
      </div>
    );
  }

  return (
    <div className='h-10 w-10 overflow-hidden rounded-full'>
      <Image
        width={40}
        height={40}
        src={user.picture.data}
        alt={`${user.firstName}`}
        className='h-full w-full object-cover'
        onError={() => setImageError(true)}
      />
    </div>
  );
}
