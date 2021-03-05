import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useMeQuery } from '../generated/graphql';

const CreatePostButton: React.FC<{ subName?: string }> = ({ subName }) => {
  const { data: meData } = useMeQuery({
    fetchPolicy: 'cache-only',
  });
  return (
    <>
      {meData && meData.me && (
        <div className='flex items-center p-2 mb-2 overflow-hidden bg-white rounded'>
          <Link href={`/u/${meData.me.username}`}>
            <div className='relative w-10 h-10 overflow-hidden rounded-full cursor-pointer'>
              <Image
                src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                alt='TopSub'
                layout='fill'
                objectFit='cover'
              />
            </div>
          </Link>
          <Link href={subName ? `/r/${subName}/submit` : '/submit'}>
            <div className='w-full p-2 ml-2 bg-gray-100 border rounded cursor-text div hover:bg-white hover:border-gray-700'>
              <h2 className='text-gray-700'>Create Post</h2>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default CreatePostButton;
