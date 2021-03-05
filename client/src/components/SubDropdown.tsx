import React from 'react';
import cn from 'classnames';
import { Sub } from '../generated/graphql';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SubDropDownProps {
  subs: Sub[];
  addPostOnClick?: boolean;
  setTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SubDropdown: React.FC<SubDropDownProps> = ({
  subs,
  addPostOnClick = false,
  setTerm,
}) => {
  const router = useRouter();
  return (
    <div
      className={cn(
        'z-20 shadow-md absolute left-0 right-0 bg-white top-full',
        {
          hidden: subs.length === 0,
        }
      )}
    >
      {subs.map((sub) => (
        <div
          onClick={() => {
            router.push(`/r/${sub.name}${addPostOnClick ? '/submit' : ''}`);
            setTerm('');
          }}
          className='flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200'
          key={sub.id}
        >
          <div className='relative w-8 h-8 overflow-hidden rounded-full'>
            <Image
              src={sub.imageUrl}
              layout='fill'
              objectFit='cover'
              objectPosition='center'
            />
          </div>
          <strong className='ml-2 text-sm font-semibold'>r/{sub.name}</strong>
        </div>
      ))}
    </div>
  );
};

export default SubDropdown;
