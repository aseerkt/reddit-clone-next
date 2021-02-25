import Head from 'next/head';
import React from 'react';
import Link from 'next/link';

function Register() {
  return (
    <div className='flex'>
      <Head>
        <title>Register</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div
        className='w-40 h-screen'
        style={{
          backgroundImage: "url('/images/pexels-fiona-art.jpg')",
          backgroundSize: 'cover',
        }}
      ></div>
      <div className='flex flex-col justify-center pl-6'>
        <div className='w-72'>
          <h1 className='mb-2 text-lg'>Sign Up</h1>
          <p className='mb-10 text-xs'>
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          <form action=''>
            <div className='mb-2'>
              <input
                type='email'
                className='w-full px-3 py-2 bg-gray-100 border border-gray-300'
                placeholder='Email'
              />
            </div>
            <div className='mb-2'>
              <input
                type='text'
                className='w-full px-3 py-2 bg-gray-100 border border-gray-300'
                placeholder='Username'
              />
            </div>
            <div className='mb-2'>
              <input
                type='password'
                className='w-full px-3 py-2 bg-gray-100 border border-gray-300'
                placeholder='Password'
              />
            </div>
            <button
              type='submit'
              className='w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded'
            >
              sign Up
            </button>
          </form>
          <small>
            Already a redditor?{' '}
            <Link href='/login'>
              <a className='ml-1 text-blue-500 uppercase'>Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Register;
