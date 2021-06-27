import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Sub, useMeQuery } from '../generated/graphql';
import Button from '../shared/Button';

const Sidebar: React.FC<{ sub: Sub }> = ({ sub }) => {
  const router = useRouter();

  const { data: meData } = useMeQuery();

  return (
    <div className='flex-1 hidden mb-5 ml-6 md:block'>
      <div className='bg-white rounded'>
        <div className='p-3 bg-blue-500 rounded-t'>
          <p className='font-semibold text-white'>About Community</p>
        </div>
        <div className='p-3'>
          <div className='flex items-center py-3'>
            <Link href={`/r/${sub.name}`}>
              <div className='relative w-16 h-16 overflow-hidden rounded-full cursor-pointer'>
                <Image
                  src={sub.imageUrl}
                  alt='Sub'
                  layout='fill'
                  objectFit='cover'
                />
              </div>
            </Link>
            <Link href={`/r/${sub.name}`}>
              <a>
                <h2 className='ml-2 text-lg font-semibold'>r/{sub.name}</h2>
              </a>
            </Link>
          </div>
          <p className='mb-3 text-sm'>{sub.description}</p>
          <div className='flex py-3'>
            <div className='w-1/2'>
              <h2 className='text-base font-bold'>552k</h2>
              <p className='text-xs font-bold'>Members</p>
            </div>
            <div className='w-1/2'>
              <h2 className='text-base font-bold'>1.2k</h2>
              <p className='text-xs font-bold'>Online</p>
            </div>
          </div>
          <div className='flex items-center py-2 text-sm borde-t'>
            <i className='mr-2 fas fa-birthday-cake'></i>
            <p>Created {dayjs(sub.createdAt).format('D MMM YYYY')}</p>
          </div>
          {meData && meData.me && (
            <Button
              onClick={() => {
                router.push(`/r/${sub.name}/submit`);
              }}
              className='my-0 text-sm'
              fullWidth
            >
              Create Post
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
