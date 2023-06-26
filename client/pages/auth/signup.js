import { useState } from "react";
import Router from "next/router";
import useRequest from '../../hooks/useRequest';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email,
            password
        },
        onSucces: (data) => {
            setEmail('');
            setPassword('');
            Router.push('/');
        }
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    }
    return <form 
                onSubmit={onSubmit}
            >
        <h1>Sign Up</h1>
        <div className="form-group">
            <label>Email</label>
            <input 
                name="email" 
                className="form-control" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
            />
        </div>
        <div className="form-group">
            <label>Password</label>
            <input
                name="password"
                type="password"
                className="form-control"
                value={password} 
                onChange={e => setPassword(e.target.value)}
            />
        </div>

        { errors }

        <button className="btn btn-primary">Sign up</button>
    </form>
}

export default SignUp;