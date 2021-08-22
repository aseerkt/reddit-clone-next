import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React, { createRef, useState } from 'react';
import AddPost from '../../../components/AddPost';
import Sidebar from '../../../components/Sidebar';
import SubDropdown from '../../../components/SubDropdown';
import { GetSubDocument, GetSubQuery, Sub } from '../../../generated/graphql';
import { createApolloClient } from '../../../utils/createApolloClient';
import useIsAuth from '../../../utils/useIsAuth';
import useSearchSubs from '../../../utils/useSearchSubs';

const SubmitPostToSub: NextPage<{ sub: Sub }> = ({ sub }) => {
  const { loading } = useIsAuth();
  const { term, setTerm, subs, emptyResults } = useSearchSubs();
  const inputRef = createRef<HTMLInputElement>();
  const [showIcon, setShowIcon] = useState(true);

  if (loading) return null;

  return (
    <>
      <Head>
        <title>Submit to {sub.name}</title>
      </Head>
      <div className='container flex pt-4'>
        {/* Post Feed */}
        <div className='w-160'>
          <div className='w-full p-2 border-b border-white'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Create a Post
            </h2>
          </div>
          <div
            onBlur={emptyResults}
            className='relative inline-block p-2 mt-4 bg-white rounded '
          >
            <div className='flex items-center p-2 text-sm text-gray-700 border rounded outline-none hover:border-2 focus:border-2'>
              {showIcon ? (
                <div className='relative w-6 h-6 mr-2 overflow-hidden rounded-full'>
                  <Image src={sub.imageUrl} layout='fill' objectFit='cover' />
                </div>
              ) : (
                <i className='mr-2 fas fa-search'></i>
              )}
              <input
                ref={inputRef}
                onBlur={(e) => {
                  e.currentTarget.placeholder = sub.name;
                  setShowIcon(true);
                }}
                onClick={(e) => {
                  e.currentTarget.placeholder = 'Search communities';
                  setShowIcon(false);
                }}
                onFocus={(e) => {
                  setShowIcon(false);
                }}
                name='community'
                className='font-semibold text-gray-900 placeholder-gray-600 border-none outline-none'
                placeholder={sub.name}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
              <i
                onClick={() => inputRef.current.focus()}
                className='cursor-pointer fas fa-chevron-down'
              ></i>
            </div>
            <SubDropdown setTerm={setTerm} subs={subs} addPostOnClick />
          </div>
          <AddPost subName={sub.name} />
        </div>
        <div className='flex-1 ml-6'>{sub && <Sidebar sub={sub as Sub} />}</div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const res = await createApolloClient().query<GetSubQuery>({
    query: GetSubDocument,
    variables: { subName: query.subName },
  });

  const sub = res?.data?.getSub;
  if (!sub) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: { sub } };
};

export default SubmitPostToSub;
