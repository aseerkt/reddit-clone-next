import { useRouter } from 'next/router';
import { useMeQuery } from '../generated/graphql';

const isServerSide = () => typeof window === 'undefined';

const useIsAuth = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery({
    skip: isServerSide(),
  });

  if (!loading && !data?.me && !isServerSide()) {
    router.replace(
      `/login?next=${!isServerSide() ? window.location.pathname : 'back'}`
    );
  }
  return { data, loading };
};

export default useIsAuth;
