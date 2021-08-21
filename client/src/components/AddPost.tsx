import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useCreatePostMutation } from '../generated/graphql';
import Button from '../shared/Button';

const AddPost: React.FC<{ subName: string }> = ({ subName }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const router = useRouter();

  const [createPost, { loading }] = useCreatePostMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) return;
    try {
      console.log('onSUbmit clicked');
      const res = await createPost({
        variables: { subName, title, body },
        update: (cache, { data }) => {
          if (data.createPost.ok) {
            cache.evict({ fieldName: 'getPosts' });
            console.log('evicted cache');
            router.push(`/r/${subName}`);
          }
        },
      });
      console.log('createPost mutation,', res);
      const { errors } = res.data.createPost;
      console.log(errors);
      // console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='p-3 pt-6 mt-4 bg-white rounded oveflow-hidden'>
      <form onSubmit={onSubmit}>
        <div className='relative mb-2'>
          <input
            type='text'
            className='w-full p-2 pr-16 text-sm bg-gray-100 border rounded outline-none hover:bg-white focus:bg-white hover:border-gray-700 focus:border-gray-700 focus:shadow-inner'
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            max={200}
          />
          <span className='absolute text-xs font-semibold text-gray-500 transform -translate-y-1/2 right-4 top-1/2'>
            {title.trim().length}/200
          </span>
        </div>
        <textarea
          className='w-full p-2 pr-16 text-sm bg-gray-100 border rounded outline-none hover:bg-white focus:bg-white hover:border-gray-700 focus:border-gray-700 focus:shadow-inner'
          placeholder='Text (optional)'
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <div className='flex items-center justify-end'>
          <Button
            disabled={!title || !subName}
            isLoading={loading}
            className='w-24'
            type='submit'
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
