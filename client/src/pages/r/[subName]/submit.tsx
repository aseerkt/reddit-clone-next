import { useApolloClient } from '@apollo/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { createRef, useEffect, useState } from 'react';
import AddPost from '../../../components/AddPost';
import Button from '../../../components/Button';
import Sidebar from '../../../components/Sidebar';
import SubDropdown from '../../../components/SubDropdown';
import {
  GetSubDocument,
  GetSubQuery,
  MeDocument,
  MeQuery,
  SearchSubDocument,
  SearchSubQuery,
  Sub,
  useCreatePostMutation,
  useGetSubQuery,
} from '../../../generated/graphql';
import { createApolloClient } from '../../../utils/createApolloClient';

const SubmitPostToSub: NextPage<{ sub: Sub }> = ({ sub }) => {
  // useIsAuth(true);
  const client = useApolloClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [term, setTerm] = useState('');
  const [subs, setSubs] = useState([]);
  // const router = useRouter();
  // const { subName }: any = router.query;
  const inputRef = createRef<HTMLInputElement>();
  const [showIcon, setShowIcon] = useState(true);

  // const { data } = useGetSubQuery({
  //   variables: { subName },
  //   skip: typeof subName !== 'string',
  //   ssr: true,
  // });

  useEffect(() => {
    if (term.length === 0) {
      setSubs([]);
    }
    searchSubs();
  }, [term]);

  const searchSubs = async () => {
    if (term.length === 0) return;
    try {
      const res = await client.query<SearchSubQuery>({
        query: SearchSubDocument,
        variables: { term },
      });
      const subsData = res.data.searchSub;
      if (subsData) {
        setSubs(subsData);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
            onBlur={() => {
              setTimeout(() => {
                setSubs([]);
              }, 500);
              // setTerm('');
            }}
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

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  query,
}) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error('Missing auth token cookie');
    const res1 = await createApolloClient().query<MeQuery>({
      query: MeDocument,
      context: {
        headers: {
          cookie,
        },
      },
    });
    const user = res1.data.me;
    if (!user) throw new Error('User not logged in');

    const res2 = await createApolloClient().query<GetSubQuery>({
      query: GetSubDocument,
      variables: { subName: query.subName },
    });
    const sub = res2.data.getSub;
    if (!sub) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return { props: { sub } };
  } catch (err) {
    console.log('server side error', err);
    res.writeHead(307, { Location: `/login` }).end();
    return { props: {} };
  }
};

export default SubmitPostToSub;
