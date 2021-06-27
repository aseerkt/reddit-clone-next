import { gql } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useCommentPostMutation, useMeQuery } from '../generated/graphql';
import Button from '../shared/Button';

const AddComment: React.FC<{ postId: string }> = ({ postId }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { data, loading: fetchingUser } = useMeQuery();
  const router = useRouter();

  const [createComment] = useCommentPostMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (!text) {
      setLoading(false);
      return;
    }
    try {
      await createComment({
        variables: { postId, text },
        update: (cache, { data }) => {
          if (data.commentPost) {
            const newComment = data.commentPost;
            console.log(newComment);
            console.log('before modify');
            cache.modify({
              id: 'Post:' + postId,
              broadcast: false,
              fields: {
                comments(existingCommentRefs = [], { readField }) {
                  const newCommentRef = cache.writeFragment({
                    fragment: gql`
                      fragment NewComment on Comment {
                        id
                        text
                        username
                        postId
                        createdAt
                        updatedAt
                        userVote
                        voteScore
                      }
                    `,
                    data: newComment,
                  });

                  // Quick safety check - if the new comment is already
                  // present in the cache, we don't need to add it again.
                  if (
                    existingCommentRefs.some(
                      (ref) => readField('id', ref) === newComment.id
                    )
                  ) {
                    return existingCommentRefs;
                  }

                  return [newCommentRef, ...existingCommentRefs];
                },
              },
            });
            setText('');
          }
        },
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  return (
    <div className='mt-4'>
      {!fetchingUser && data && data.me ? (
        <form className='block pr-3' onSubmit={onSubmit}>
          <p className='flex py-1 text-sm'>
            Comment as
            <Link href={`/u/${data.me.username}`}>
              <a className='mx-1 text-blue-600 hover:underline'>
                {data.me.username}
              </a>
            </Link>
          </p>
          <textarea
            className='w-full p-2 text-sm border-2 rounded outline-none focus:border-blue-500'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='What are your thoughts?'
            rows={5}
          ></textarea>
          <div className='flex justify-end'>
            <Button
              disabled={!text}
              isLoading={loading}
              className='px-4 ml-auto'
              uppercase={false}
              type='submit'
            >
              Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className='flex items-center justify-between px-2 py-4 border border-blue-500 rounded'>
          <h2 className='font-semibold text-gray-700'>
            Log in or sign up to leave a comment
          </h2>
          <div>
            <Button
              onClick={() => {
                router.push(`/login?next=${window.location.pathname}`);
              }}
              className='w-24 mr-3'
              variant='outlined'
            >
              Login
            </Button>
            <Button
              onClick={() => {
                router.push('/register');
              }}
              className='w-24'
            >
              sign up
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddComment;
