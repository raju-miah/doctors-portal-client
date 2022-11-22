import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';
import useToken from '../../hooks/useToken';

const Login = () => {

    const { register, formState: { errors }, handleSubmit } = useForm();

    const { loginUser } = useContext(AuthContext);

    const [loginError, setLoginError] = useState('');

    const [loginUserEmail, setLoginUserEmail] = useState('');

    const [token] = useToken(loginUserEmail);

    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || '/';

    if (token) {
        navigate(from, { replace: true });
    }

    const handelLogin = data => {
        console.log(data);

        // error jodi age thake tahole reset er jonno
        setLoginError('');

        loginUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user)
                setLoginUserEmail(data.email);
                // navigate(from, { replace: true });
            })
            .catch(error => {
                console.log(error.message)
                setLoginError(error.message);
            })
    }


    return (
        <div className='h-[600px] flex justify-center items-center'>
            <div className='w-96 p-7 border'>
                <h2 className='text-xl text-center'>Login</h2>
                <form onSubmit={handleSubmit(handelLogin)}>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email"
                            {...register("email", {
                                required: "Email Address is required"
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.email && <p className='text-red-600'>{errors.email?.message}</p>}
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be 6 characters or longer" }
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.password && <p className='text-red-600'>{errors.password?.message}</p>}
                        <label className="label">
                            <span className="label-text">Forget Password?</span>
                        </label>
                    </div>
                    <div>
                        {loginError && <p className='text-red-600'>{loginError}</p>}
                    </div>
                    <input className='btn btn-accent w-full' value="Login" type="submit" />
                </form>
                <p>New to Doctors Portal <Link to="/signup" className='text-secondary'>Create a new account?</Link></p>
                <div className="divider">OR</div>
                <button className='btn btn-outline w-full'>CONTINUE WITH GOOGLE</button>
            </div>
        </div>
    );
};

export default Login;