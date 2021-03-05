import { useRouter } from 'next/router';
import { useMeQuery } from '../generated/graphql';

const useIsAuth = (goBack?: boolean) => {
  const router = useRouter();
  const { data, loading } = useMeQuery();

  if (loading) {
    return null;
  } else if (data) {
    if (!data.me) {
      goBack
        ? router.push('/login?next=back')
        : router.push(`/login?next=${window.location.pathname}`);
    }
  }
};

export default useIsAuth;
