import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  useMeQuery,
  useLogoutMutation,
  SearchSubDocument,
  SearchSubQuery,
} from '../generated/graphql';
import Button from '../shared/Button';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import SubDropdown from './SubDropdown';
import Image from 'next/image';
import useSearchSubs from '../utils/useSearchSubs';

const Navbar = () => {
  const { data, loading } = useMeQuery();
  const client = useApolloClient();
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const { term, setTerm, subs, emptyResults } = useSearchSubs();

  let body = null;

  if (loading) {
  } else if (data && !data.me) {
    body = (
      <>
        <Button
          onClick={() => {
            router.push(`/login?next=${window.location.pathname}`);
          }}
          className='w-20 py-1 md:w-32'
          variant='outlined'
        >
          Log In
        </Button>

        <Button
          onClick={() => {
            router.push('/register');
          }}
          className='w-20 py-1 ml-2 md:w-32'
        >
          Sign Up
        </Button>
      </>
    );
  } else {
    body = (
      <Button
        variant='outlined'
        className='w-20 py-1 md:w-32'
        onClick={async () => {
          await logout();
          await client.resetStore();
        }}
      >
        logout
      </Button>
    );
  }

  return (
    <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white shadow'>
      {/* Logo and title */}
      <Link href='/'>
        <a className='flex items-center'>
          <div className='relative w-8 h-8 mr-2 overflow-hidden rounded-full'>
            <Image
              src='/reddit.svg'
              layout='fill'
              objectPosition='center'
              objectFit='cover'
            />
          </div>
          <span className='hidden text-2xl font-semibold md:block'>
            lireadit
          </span>
        </a>
      </Link>
      {/* Search Input */}
      <div className='max-w-full px-4 w-160'>
        <div
          onBlur={emptyResults}
          className='relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white'
        >
          <i className='pl-4 pr-3 text-gray-500 fas fa-search'></i>
          <input
            type='search'
            placeholder='Search'
            className='w-full px-3 py-1 bg-transparent rounded outline-none'
            value={term}
            onChange={async (e) => setTerm(e.target.value)}
          />
          <SubDropdown subs={subs} setTerm={setTerm} />
        </div>
      </div>
      {/* Auth Buttons */}
      <div className='flex items-center'>{body}</div>
    </div>
  );
};

export default Navbar;
