import Head from 'next/head';
import React from 'react';

const FormWrapper: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className='flex'>
      <Head>
        <title>{title}</title>
      </Head>

      <div
        className='h-screen w-36'
        style={{
          backgroundImage: "url('/images/pexels-fiona-art.jpg')",
          backgroundSize: 'cover',
        }}
      ></div>
      <div className='flex flex-col justify-center pl-6'>
        <div className='w-72'>
          <h1 className='mb-2 text-lg'>{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormWrapper;
