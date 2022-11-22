import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';
import useToken from '../../hooks/useToken';

const SignUp = () => {

    const { register, formState: { errors }, handleSubmit } = useForm();

    const { signUpUser, updateUser } = useContext(AuthContext);

    const [signUpError, setSignUpError] = useState('');

    const navigate = useNavigate();

    const [createdUserEmail, setCreatedUserEmail] = useState('');

    const [token] = useToken(createdUserEmail);

    if (token) {
        navigate('/');
    }


    const handelSignUp = data => {
        console.log(data);
        setSignUpError('');

        signUpUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user)
                toast.success('User Created Successfully');
                const userInfo = {
                    displayName: data.name
                }
                updateUser(userInfo)
                    .then(() => {
                        // navigate('/');
                        saveUser(data.name, data.email);
                    })
                    .catch(err => console.log(err))
            })
            .catch(error => {
                console.log(error)
                setSignUpError(error.message);
            })
    }


    const saveUser = (name, email) => {
        const user = { name, email };
        fetch('https://doctors-portal-server-hazel.vercel.app/users', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                console.log("saved user", data)
                // navigate('/');
                // getUserToken(email);
                setCreatedUserEmail(email);
            })
    }


    // const getUserToken = email => {
    //     fetch(`https://doctors-portal-server-hazel.vercel.app/jwt?email=${email}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.accessToken) {
    //                 localStorage.setItem("accessToken", data.accessToken);
    //                 navigate('/');
    //             }
    //         })
    // }



    return (
        <div className='h-[600px] flex justify-center items-center'>
            <div className='w-96 p-7 border'>
                <h2 className='text-xl text-center'>Sign Up</h2>
                <form onSubmit={handleSubmit(handelSignUp)}>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input type="text"
                            {...register("name", {
                                required: "Name is required"
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.name && <p className='text-red-600'>{errors.name?.message}</p>}
                    </div>

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
                                minLength: { value: 6, message: "Password must be 6 characters or longer" },
                                pattern: { value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/, message: "Password must be strong" }
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.password && <p className='text-red-600'>{errors.password?.message}</p>}

                    </div>
                    <div>
                        {signUpError && <p className='text-red-600'>{signUpError}</p>}
                    </div>
                    <input className='btn btn-accent mt-7 w-full' value="Sign Up" type="submit" />
                </form>
                <p>Already have an account? <Link to="/login" className='text-secondary'>Please login</Link></p>
                <div className="divider">OR</div>
                <button className='btn btn-outline w-full'>CONTINUE WITH GOOGLE</button>
            </div>
        </div>
    );
};

export default SignUp;