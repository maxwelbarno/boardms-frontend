import React from 'react';
import Image from 'next/image';

export default function Grid() {
  return (
    <>
      <div className='absolute right-0 top-0 -z-1 max-w-[250px] xl:max-w-[450px]'>
        <Image
          priority
          width={0}
          height={0}
          src='./images/shape/grid-01.svg'
          alt='grid'
          className='w-full h-auto'
        />
      </div>
      <div className='absolute bottom-0 left-0 -z-1 max-w-[250px] rotate-180 xl:max-w-[450px]'>
        <Image
          priority
          width={0}
          height={0}
          src='./images/shape/grid-01.svg'
          alt='grid'
          className='w-full h-auto'
        />
      </div>
    </>
  );
}
