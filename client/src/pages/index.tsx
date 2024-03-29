import Head from 'next/head';
import { Post, useGetPostsQuery } from '../generated/graphql';
import PostCard from '../components/PostCard';
import TopSubSidebar from '../components/TopSubSidebar';
import CreatePostButton from '../components/CreatePostButton';
import { Waypoint } from 'react-waypoint';
import SpinnerSvg from '../shared/SpinnerSvg';

const title = 'lireadit';
const description =
  "Reddit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!";

const HeadContents = () => (
  <Head>
    <title>lireadit: the fake page of the internet</title>
    <meta name='description' content={description} />
    <meta property='og:title' content={title} />
    <meta property='og:description' content={description} />
    <meta property='twitter:title' content={title} />
    <meta property='twitter:description' content={description} />
  </Head>
);

export default function Home() {
  const { data, loading, fetchMore, error, variables, networkStatus } =
    useGetPostsQuery({
      variables: { limit: 8, offset: 0 },
      notifyOnNetworkStatusChange: true,
    });

  if (loading) {
    <div className='container h-full pt-4 text-center'>
      <HeadContents />
      <div className='animate-spin'>
        <SpinnerSvg />
      </div>
    </div>;
  }

  if (!loading && !data) {
    return (
      <div className='container h-full pt-4 text-center'>
        <HeadContents />
        <h1 className='text-2xl font-bold text-red-800'>
          Oops, Something went wrong
        </h1>
        <p className='font-semibold text-red-600'>{error?.message}</p>
      </div>
    );
  }
  const posts = data?.getPosts.posts || [];

  return (
    <>
      <HeadContents />
      <div className='container flex pt-4'>
        {/* Post Feed */}
        <div className='w-160'>
          <CreatePostButton />
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post as Post} />
            ))}
            {networkStatus === 3 && (
              <div className='flex justify-center py-6 mb-10 rounded-sm'>
                <div className='mt-4 text-gray-500 animate-none'>
                  <SpinnerSvg />
                </div>
              </div>
            )}
            {data?.getPosts?.hasMore && (
              <Waypoint
                onEnter={() => {
                  fetchMore({
                    variables: {
                      limit: variables.limit,
                      offset: posts.length,
                    },
                  });
                }}
              />
            )}
          </>
        </div>
        {/* Sidebar */}
        <TopSubSidebar />
      </div>
    </>
  );
}
