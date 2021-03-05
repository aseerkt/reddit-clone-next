import { useApolloClient } from '@apollo/client';
import Head from 'next/head';
import React, { createRef, useEffect, useState } from 'react';
import AddPost from '../components/AddPost';
import SubDropdown from '../components/SubDropdown';
import { SearchSubDocument, SearchSubQuery } from '../generated/graphql';

const SubmitPost = () => {
  const [term, setTerm] = useState('');
  const [subs, setSubs] = useState([]);
  const client = useApolloClient();
  const inputRef = createRef<HTMLInputElement>();

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
        <title>Submit to Lireadit</title>
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
              <i className='mr-2 fas fa-search'></i>

              <input
                ref={inputRef}
                onBlur={(e) => {
                  e.currentTarget.placeholder = 'Choose a community';
                }}
                onClick={(e) => {
                  e.currentTarget.placeholder = 'Search communities';
                }}
                name='community'
                placeholder='Choose a community'
                className='font-semibold text-gray-900 placeholder-gray-600 border-none outline-none'
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
          <AddPost subName='' />
        </div>
        <div className='flex-1 mt-6 ml-6'>
          <div className='p-4 bg-white rounded'>
            <h1 className='mb-3 font-medium'>Posting to Lireadit</h1>
            <ol className='flex flex-col m-0 ml-4 text-sm font-semibold list-decimal border-b'>
              <li className='py-2 border-t'>Remember the human</li>
              <li className='py-2 border-t'>
                Behave like you would in real life
              </li>
              <li className='py-2 border-t'>
                Look for the original source of content
              </li>
              <li className='py-2 border-t'>
                Search for duplicates before posting Read the community’s rules
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitPost;
