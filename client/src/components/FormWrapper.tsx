import Head from 'next/head';
import Image from 'next/image';
import React from 'react';

const FormWrapper: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className='flex bg-white'>
      <Head>
        <title>{title}</title>
      </Head>

      <div className='relative h-screen w-36'>
        <Image
          src='/images/pexels-fiona-art.jpg'
          layout='fill'
          objectFit='cover'
        />
      </div>
      <div className='flex flex-col justify-center pl-6'>
        <div className='w-72'>
          <h1 className='mb-2 text-lg font-semibold'>{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormWrapper;