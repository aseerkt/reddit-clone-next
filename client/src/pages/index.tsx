import Head from 'next/head';
import Link from 'next/link';
import { useGetPostsQuery } from '../generated/graphql';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function Home() {
  const { data, loading } = useGetPostsQuery();

  return (
    <div className='pt-12'>
      <Head>
        <title>reddit: the fake page of the internet</title>
      </Head>
      <div className='container flex pt-4'>
        {/* Post Feed */}
        <div className='w-160'>
          {/* Vote Section */}
          {!loading &&
            data &&
            data.getPosts &&
            data.getPosts.map((post) => (
              <div
                key={post.identifier}
                className='flex mb-4 overflow-hidden bg-white rounded'
              >
                <div className='w-10 text-center bg-gray-200 '>V</div>
                <div className='w-full p-2'>
                  <div className='flex items-center'>
                    <Link href={`/r/${post.subName}`}>
                      <img
                        src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                        className='w-6 h-6 mr-1 rounded-full cursor-pointer'
                        alt='gravatar'
                      />
                    </Link>
                    <Link href={`/r/${post.subName}`}>
                      <a className='text-xs font-bold hover:underline'>
                        r/{post.subName}
                      </a>
                    </Link>
                    <p className='text-xs text-gray-500'>
                      <span className='mx-1'>•</span> Posted by{' '}
                      <Link href={`/u/${post.username}`}>
                        <a className='mx-1 hover:underline'>
                          u/{post.username}
                        </a>
                      </Link>
                      <Link href={post.url}>
                        <a className='mx-1 hover:underline'>
                          {dayjs(post.createdAt).fromNow()}
                        </a>
                      </Link>
                    </p>
                  </div>
                  <Link href={post.url}>
                    <a className='my-1 text-lg font-medium'>{post.title}</a>
                  </Link>
                  <p className='my-1 text-sm'>{post.body}</p>
                  <div className='flex'>
                    <Link href={post.url}>
                      <a className='p-2 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                        <i className='mr-1 fas fa-comment-alt'></i>
                        20 Comments
                      </a>
                    </Link>
                    <a className='p-2 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                      <i className='mr-1 fas fa-share'></i>
                      Share
                    </a>
                    <a className='p-2 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                      <i className='mr-1 fas fa-bookmark'></i>
                      Save
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {/* Sidebar */}
        {/* <div className='w-full'>
          <p>a</p>
        </div> */}
      </div>
    </div>
  );
}
