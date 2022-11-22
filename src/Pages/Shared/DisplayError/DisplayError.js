import React, { useContext } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthProvider';

const DisplayError = () => {
    const { logOut } = useContext(AuthContext);

    const error = useRouteError();
    const navigate = useNavigate();

    const handelLogOut = () => {
        logOut()
            .then(() => {
                navigate('/login')
            })
            .catch(err => console.log(err))
    }

    return (
        <div>
            <h2 className='text-red-600'>Something was wrong !!</h2>
            <p className='text-red-400'>{error.statusText || error.message}</p>
            <h4 className='text-3xl'>Please <button onClick={handelLogOut}>Log Out</button> and Log back in</h4>
        </div>
    );
};

export default DisplayError;