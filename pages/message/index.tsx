import withAuth from 'HOC/withAuth';
import Message from 'components/Message/Message';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';

const MessageScreen = () => {
  const router = useRouter();

  const { roomId } = router.query;

  return (
    <Message roomId={roomId?.toString()} />
  )
}

export default withAuth(MessageScreen);

export async function getServerSideProps(context: NextPageContext) {
  {
    const { query } = context;
    return { props: { query } };
  }
}