import Link from 'next/link';
import useRequest from '../hooks/useRequest';
import Router from 'next/router';

const Header = ({user}) => {
    const { doRequest, errors } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {
          
        },
        onSucces: (data) => {
            Router.push('/');
        }
    });

    const logOutHandler = async (e) => {
        e.preventDefault();
        await doRequest();
    }
    return !user 
    ? 
        <>
            <Link href="/">Home</Link>
            &nbsp;
            <Link href="/auth/signin">Sign in</Link> || <Link href="/auth/signup">Sign up</Link>
        </>
        
    :   <>
            <Link href="/">Home</Link>
            &nbsp;
            <Link href="/tickets/new">Sell tickets</Link>
            &nbsp;
            <Link href="/orders">My orders</Link>
            &nbsp;
            <Link href="#" onClick={logOutHandler}>Log out</Link>
        </>
}

export { Header };