import React, { ChangeEvent, createRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { gql } from '@apollo/client';
import cn from 'classnames';
import { Sub, useMeQuery, useAddSubImageMutation } from '../generated/graphql';
import { createImageUrl } from '../utils/createImageUrl';

interface SubImageHeaderProps {
  sub: Sub;
}

const SubImageHeader: React.FC<SubImageHeaderProps> = ({ sub }) => {
  const { data: meData, loading: fetchingUser } = useMeQuery();
  const [ownSub, setOwnSub] = useState(false);
  const fileInputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (!meData || !meData.me) return;
    if (meData.me.username === sub.username) {
      setOwnSub(true);
    }
  }, [meData]);

  const openFileInput = (type: 'image' | 'banner') => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };
  const [addSubImage] = useAddSubImageMutation();

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!ownSub) return;
    const file = e.target.files[0];
    try {
      const res = await addSubImage({
        variables: { file, subName: sub.name, type: e.target.name },
        update: (cache, { data }) => {
          if (data) {
            const { Urn, type } = data.addSubImage;
            cache.writeFragment<{ bannerUrl: string; imageUrl: string }>({
              id: 'Sub:' + sub.id,
              fragment: gql`
                fragment __Sub on Sub {
                  bannerUrl
                  imageUrl
                }
              `,
              data: {
                bannerUrl: type === 'banner' ? createImageUrl(Urn) : bannerUrl,
                imageUrl: type === 'image' ? createImageUrl(Urn) : imageUrl,
              },
            });
          }
        },
      });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };
  const { bannerUrl, imageUrl } = sub;

  return (
    <>
      <input
        type='file'
        accept='image/*'
        ref={fileInputRef}
        hidden
        onChange={uploadFile}
      />
      <div
        className={cn('h-32 bg-blue-500 relative w-screen', {
          'cursor-pointer': ownSub,
        })}
        onClick={() => openFileInput('banner')}
      >
        {bannerUrl && (
          <Image
            src={bannerUrl}
            alt='Banner'
            className='w-full h-auto'
            layout='fill'
            objectFit='cover'
          />
        )}
      </div>
      <div className='bg-white'>
        <div className='container relative flex'>
          <div
            onClick={() => openFileInput('image')}
            className={cn('absolute -top-1/4', { 'cursor-pointer': ownSub })}
          >
            <div className='relative w-20 h-20 overflow-hidden rounded-full'>
              <Image
                className='rounded-full'
                src={imageUrl}
                alt='Image'
                layout='fill'
                objectPosition='center'
                objectFit='cover'
              />
            </div>
          </div>
          <div className='py-2 pl-24'>
            <h1 className='mb-1 text-3xl font-bold'>{sub.title}</h1>
            <p className='font-semibold text-gray-400'>r/{sub.name}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubImageHeader;
