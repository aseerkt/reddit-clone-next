import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Comment } from '../generated/graphql';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import VoteSection from './VoteSection';

dayjs.extend(relativeTime);

const Comments: React.FC<{ comments: Comment[] }> = ({ comments }) => {
  return (
    <>
      {comments.map(
        ({ username, id, text, createdAt, voteScore, userVote }) => (
          <div key={id} className='flex mb-4'>
            <div className='flex justify-center py-3 w-14'>
              <div className='relative w-8 h-8 overflow-hidden rounded-full'>
                <Image
                  src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                  alt='gravatar'
                  layout='fill'
                  objectFit='cover'
                />
              </div>
            </div>
            <div className='w-full p-2'>
              <div className='flex items-center'>
                <Link href={`/u/${username}`}>
                  <a className='text-xs font-bold hover:underline'>
                    u/{username}
                  </a>
                </Link>
                <a className='mx-1 text-xs text-gray-800'>
                  {dayjs(createdAt).fromNow()}
                </a>
              </div>

              <p className='my-1 text-sm'>{text}</p>
              <div className='flex text-xs'>
                <div className='flex items-center justify-between w-20 text-base'>
                  <VoteSection
                    commentId={id}
                    voteScore={voteScore}
                    userVote={userVote}
                  />
                </div>
                <a className='p-2 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                  <i className='mr-1 fas fa-comment-alt'></i>
                  Reply
                </a>
                <a className='p-2 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
                  <i className='mr-1 fas fa-flag'></i>
                  Report
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
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Comments;
