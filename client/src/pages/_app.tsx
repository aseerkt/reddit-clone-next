import '../styles/globals.css';
import '../styles/icons.css';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';

import Navbar from '../components/Navbar';
import { useRouter } from 'next/dist/client/router';
import { createApolloClient } from '../utils/createApolloClient';

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const isInAuthRoute = authRoutes.includes(pathname);

  return (
    <ApolloProvider client={createApolloClient()}>
      {!isInAuthRoute && <Navbar />}
      <div className={isInAuthRoute ? '' : 'pt-12'}>
        <Component {...pageProps} />
      </div>
    </ApolloProvider>
  );
}

export default MyApp;
