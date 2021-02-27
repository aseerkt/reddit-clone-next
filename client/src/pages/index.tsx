import Head from 'next/head';
import { Post, useGetPostsQuery } from '../generated/graphql';

import PostCard from '../components/PostCard';

export default function Home() {
  const { data, loading } = useGetPostsQuery();

  return (
    <>
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
              <PostCard key={post.id} post={post as Post} />
            ))}
        </div>
        {/* Sidebar */}
        {/* <div className='w-full'>
          <p>a</p>
        </div> */}
      </div>
    </>
  );
}
