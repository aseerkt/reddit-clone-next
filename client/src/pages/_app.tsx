import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import Navbar from '../components/Navbar';
import { useRouter } from 'next/dist/client/router';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
});

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const isInAuthRoute = authRoutes.includes(pathname);

  return (
    <ApolloProvider client={apolloClient}>
      {!isInAuthRoute && <Navbar />}
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
