import Link from 'next/link';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Post } from '../generated/graphql';

dayjs.extend(relativeTime);

const PostCard: React.FC<{ post: Post }> = ({
  post: {
    title,
    body,
    id,
    url,
    subName,
    createdAt,
    username,
    commentCount,
    voteScore,
    userVote,
  },
}) => {
  return (
    <div className='flex mb-4 overflow-hidden bg-white rounded'>
      {/* Vote Section */}
      <div className='w-10 text-center bg-gray-200 '>{voteScore}</div>
      <div className='w-full p-2'>
        <div className='flex items-center'>
          <Link href={`/r/${subName}`}>
            <img
              src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
              className='w-6 h-6 mr-1 rounded-full cursor-pointer'
              alt='gravatar'
            />
          </Link>
          <Link href={`/r/${subName}`}>
            <a className='text-xs font-bold hover:underline'>r/{subName}</a>
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
        <Link href={url}>
          <a className='my-1 text-lg font-medium'>{title}</a>
        </Link>
        <p className='my-1 text-sm'>{body}</p>
        <div className='flex'>
          <Link href={url}>
            <a className='p-2 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
              <i className='mr-1 fas fa-comment-alt'></i>
              {commentCount} Comment{commentCount === 1 ? '' : 's'}
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
  );
};

export default PostCard;
