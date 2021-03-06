import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGetTopSubQuery, useMeQuery } from '../generated/graphql';
import Button from './Button';

const TopSubSidebar = () => {
  const { data } = useGetTopSubQuery();
  const router = useRouter();
  const { data: meData } = useMeQuery();

  return (
    <div className='flex-1 hidden ml-6 md:block'>
      <div className='bg-white rounded'>
        <div className='p-4 bg-blue-400 border-b-2 shadow-inner'>
          <p className='text-lg font-semibold text-center text-white'>
            Top Communities
          </p>
        </div>
        <div>
          {data &&
            data.getTopSubs.map((sub, index) => (
              <div
                key={sub.name}
                className='flex items-center px-4 py-2 text-sm'
              >
                <p className='mr-3 font-bold'>{index + 1}</p>
                <Link href={`/r/${sub.name}`}>
                  <div className='relative w-10 h-10 mr-2 overflow-hidden rounded-full cursor-pointer'>
                    <Image
                      src={sub.imageUrl}
                      alt='TopSub'
                      layout='fill'
                      objectFit='cover'
                      objectPosition='center'
                    />
                  </div>
                </Link>
                <Link href={`/r/${sub.name}`}>
                  <a className='font-semibold'>r/{sub.name}</a>
                </Link>
                <p className='ml-auto font-medium'>{sub.postCount}</p>
              </div>
            ))}
        </div>
        <div className='px-4 py-2'>
          {meData && meData.me && (
            <Button onClick={() => router.push('/create-sub')} fullWidth>
              Create Community
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopSubSidebar;
