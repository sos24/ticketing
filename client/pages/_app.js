import 'bootstrap/dist/css/bootstrap.css';
import { buildClient } from "../api/build-client";
import { Header } from '../components/header';

const App = ({ Component, pageProps, user }) => {
    return <div>
        <Header user={user}/>
        <div className='container'>
            <Component {...pageProps} user={user}/>
        </div>
    </div>
}

App.getInitialProps = async (context) => {
    let data = {};
    let pageProps = {};
    try {
        const client = buildClient(context.ctx);
        const response = await client.get('/api/users/currentuser');
        data = {
            ...response.data
        }
        if (context.Component.getInitialProps) {
            pageProps = await context.Component.getInitialProps(context, client, data);
        }
    } catch(e) {
        console.log(e)
    }
    return {
        pageProps,
        ...data
    }
}

export default App;