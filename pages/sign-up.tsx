import withUnAuth from '../HOC/withUnAuth';
import SignUp from 'components/SignUp/SignUp';
import { NextPageContext } from 'next';

function SignUpScreen() {
  return <SignUp />;
}

export default withUnAuth(SignUpScreen);

export async function getServerSideProps(context: NextPageContext) {
  {
    const { query } = context;
    return { props: { query } };
  }
}