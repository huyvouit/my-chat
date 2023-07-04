import withUnAuth from '../HOC/withUnAuth';
import Login from 'components/Login/Login';
import { NextPageContext } from 'next';

const LoginScreen: React.FC = () => {
  return <Login />;
}

export default withUnAuth(LoginScreen);

export async function getServerSideProps(context: NextPageContext) {
  {
    const { query } = context;
    return { props: { query } };
  }
}