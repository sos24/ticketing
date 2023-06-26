import axios from 'axios';
import { useState } from 'react';

const useRequest = ({url, method, body, onSucces }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const resposne = await axios[method](url, {...body, ...props});
            if (onSucces) {
                onSucces(resposne.data);
            }
        } catch (e) {
            const respErrors = e.response?.data?.errors;
            if (respErrors) {
                setErrors(
                    <div className="alert alert-danger mt-5">
                        <ul className="my-0">
                            { respErrors.map(err => <li key={err.message}>{err.message}</li>) }
                        </ul>
                    </div>
                );
            } else {
                setErrors(
                    <div className="alert alert-danger mt-5">
                        <ul className="my-0">
                            <li>{e.message}</li>
                        </ul>
                    </div>
                );
            }
        }
    }

    return { doRequest, errors };
}

export default useRequest;