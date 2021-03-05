import { useRouter } from 'next/router';
import Head from 'next/head';
import PostCard from '../../components/PostCard';
import SubImageHeader from '../../components/SubImageHeader';
import { Post, Sub, useGetSubQuery, useMeQuery } from '../../generated/graphql';
import Sidebar from '../../components/Sidebar';
import { GetServerSideProps } from 'next';
import CreatePostButton from '../../components/CreatePostButton';

const SubPage = () => {
  const router = useRouter();
  const subName = router.query.subName as string;

  const { data, loading } = useGetSubQuery({
    variables: { subName },
    skip: typeof subName !== 'string',
    onCompleted: (data) => {
      if (!data || !data.getSub) {
        router.push('/');
      }
    },
  });

  let postsMarkup: JSX.Element | JSX.Element[];
  let sub: Sub | null = null;
  let posts: Post[] = [];

  if (loading) {
    postsMarkup = <p className='text-lg text-center'>Loading...</p>;
  } else if (data && data.getSub) {
    sub = data.getSub as Sub;
    posts = data.getSub.posts as Post[];
    postsMarkup =
      data.getSub.posts.length === 0 ? (
        <p className='mt-4 text-lg text-center'>No posts added yet.</p>
      ) : (
        data.getSub.posts.map((post) => (
          <PostCard key={post.id} post={post as Post} />
        ))
      );
  }

  return (
    <>
      <Head>
        <title>{sub && sub.title}</title>
      </Head>
      {sub && <SubImageHeader sub={sub} />}
      <div className='container flex pt-5'>
        {sub && (
          <>
            <div className='w-160'>
              <CreatePostButton subName={sub.name} />
              {postsMarkup}
            </div>
            <Sidebar sub={sub} />
          </>
        )}
      </div>
    </>
  );
};

export default SubPage;
