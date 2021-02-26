import Link from 'next/link';
import React from 'react';
import Button from './Button';

const Navbar = () => {
  return (
    <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white'>
      {/* Logo and title */}
      <Link href='/'>
        <a className='flex items-center'>
          <img src='/reddit.svg' className='w-8 h-8 mr-2' alt='' />
          <span className='text-2xl font-semibold'>reddit</span>
        </a>
      </Link>
      {/* Search Input */}
      <div className='flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white'>
        <i className='pl-4 pr-3 text-gray-500 fas fa-search'></i>
        <input
          type='text'
          placeholder='Search'
          className='px-3 py-1 bg-transparent rounded outline-none w-160 '
        />
      </div>
      {/* Auth Buttons */}
      <div className='flex items-center'>
        <Link href='/login'>
          <Button className='w-32 py-1' variant='outlined'>
            Log In
          </Button>
        </Link>
        <Link href='/register'>
          <Button className='w-32 py-1 ml-2'>Sign Up</Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
