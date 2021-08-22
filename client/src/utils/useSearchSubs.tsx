import { InMemoryCache } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Sub, useSearchSubLazyQuery } from '../generated/graphql';
import { cache } from './createApolloClient';

const TIMEOUT_DELAY = 500;

function useSearchSubs() {
  const [term, setTerm] = useState('');
  const [searchForSubs, { called, data, loading }] = useSearchSubLazyQuery({
    variables: { term },
  });

  useEffect(() => {
    let searchTimeout: NodeJS.Timeout;
    if (!term) clearTimeout(searchTimeout);
    else
      searchTimeout = setTimeout(() => {
        searchForSubs();
      }, TIMEOUT_DELAY);

    return () => {
      clearTimeout(searchTimeout);
    };
  }, [term]);

  const emptyResults = () =>
    setTimeout(() => {
      cache.evict({
        id: 'ROOT_QUERY',
        fieldName: 'searchSub',
        broadcast: false,
      });
      cache.gc();
      console.log(data);
    }, TIMEOUT_DELAY);

  return {
    term,
    setTerm,
    subs: (data?.searchSub || []) as Sub[],
    emptyResults,
    searching: loading && called,
  };
}

export default useSearchSubs;
