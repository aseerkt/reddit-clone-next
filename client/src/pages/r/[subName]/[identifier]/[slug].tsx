import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AddComment from '../../../../components/AddComment';
import Comments from '../../../../components/Comments';
import Sidebar from '../../../../components/Sidebar';
import VoteSection from '../../../../components/VoteSection';
import {
  Comment,
  Sub,
  useGetPostQuery,
  useGetSubQuery,
} from '../../../../generated/graphql';

dayjs.extend(relativeTime);

const PostPage = () => {
  const router = useRouter();
  const { subName, identifier, slug }: any = router.query;

  const { data: subData } = useGetSubQuery({
    variables: { subName },
    skip: typeof subName !== 'string',
  });

  const { data: postData, loading: fetchingPost } = useGetPostQuery({
    variables: { identifier, slug },
    skip: typeof identifier !== 'string' || typeof slug !== 'string',
  });

  let postBody = null;

  if (fetchingPost) {
    postBody = <p className='text-2xl font-bold text-center'>Loading...</p>;
  } else if (postData && postData.getPost) {
    const {
      id,
      username,
      userVote,
      voteScore,
      url,
      createdAt,
      title,
      body,
      commentCount,
      comments,
    } = postData.getPost;
    postBody = (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <div className='mb-4 overflow-hidden bg-white rounded'>
          {/* POST SECTION */}
          <div className='flex'>
            {/* Post vote section */}
            <div className='py-3 text-center w-14'>
              <VoteSection
                postId={id}
                userVote={userVote}
                voteScore={voteScore}
              />
            </div>
            <div className='w-full p-2 mb-6 border-b'>
              {/* Post Header */}
              <div className='flex items-center'>
                <Link href={`/r/${subName}`}>
                  <div className='relative w-6 h-6 mr-1 overflow-hidden rounded-full cursor-pointer'>
                    <Image
                      src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                      alt='Sub Gravatar'
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                </Link>
                <Link href={`/r/${subName}`}>
                  <a className='text-xs font-bold hover:underline'>
                    r/{subName}
                  </a>
                </Link>
                <p className='text-xs text-gray-500'>
                  <span className='mx-1'>•</span> Posted by{' '}
                  <Link href={`/u/${username}`}>
                    <a className='mx-1 hover:underline'>u/{username}</a>
                  </Link>
                  <Link href={url}>
                    <a className='mx-1 hover:underline'>
                      {dayjs(createdAt).fromNow()}
                    </a>
                  </Link>
                </p>
              </div>
              {/* Post Title */}
              <Link href={url}>
                <a className='my-1 text-lg font-medium'>{title}</a>
              </Link>
              {/* Post Body */}
              <p className='my-1 text-sm'>{body}</p>
              {/* Post Action Buttons */}
              <div className='flex'>
                <a className='p-2 mr-1 text-xs font-bold text-gray-400 rounded cursor-default'>
                  <i className='mr-1 fas fa-comment-alt'></i>
                  {commentCount} Comment
                  {commentCount === 1 ? '' : 's'}
                </a>

                <a className='p-2 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                  <i className='mr-1 fas fa-share'></i>
                  Share
                </a>
                <a className='p-2 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                  <i className='mr-1 far fa-bookmark'></i>
                  Save
                </a>
              </div>
              {/* Add Comment Section */}
              <AddComment postId={id} />
            </div>
          </div>
          {/* <hr /> */}
          {/* COMMENT SECTION */}

          <Comments comments={comments} />
        </div>
      </>
    );
  }

  return (
    <>
      <Link href={`/r/${subName}`}>
        <div className='w-full p-8 bg-blue-500 cursor-pointer'>
          <div className='container'>
            {subData && subData.getSub && (
              <div className='flex items-center'>
                <div className='relative w-20 h-20 overflow-hidden border-4 border-white rounded-full'>
                  <Image
                    src={subData.getSub.imageUrl}
                    layout='fill'
                    objectFit='cover'
                    objectPosition='center'
                  />
                </div>
                <h2 className='ml-3 text-3xl font-bold text-white'>
                  r/{subData.getSub.name}
                </h2>
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className='container flex pt-5'>
        <div className='w-160'>
          {postBody}
          {}
        </div>
        {subData && subData.getSub && <Sidebar sub={subData.getSub as Sub} />}
      </div>
    </>
  );
};

export default PostPage;
