import withAuth from '../HOC/withAuth';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push({
      pathname: `/message`,
      query: { ...router.query }
    })
  }, []);

  return (
    <></>
  )
}

export default withAuth(Home);

export async function getServerSideProps(context: NextPageContext) {
  {
    const { query } = context;
    return { props: { query } };
  }
}