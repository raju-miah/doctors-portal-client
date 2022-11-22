import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Shared/Loading/Loading';

const AddDoctor = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();

    const imgHostKey = process.env.REACT_APP_imgbb_key;
    // console.log(imgHostKey);

    const navigate = useNavigate();

    const { data: specialties, isLoading } = useQuery({
        queryKey: ['specialty'],
        queryFn: async () => {
            const res = await fetch('https://doctors-portal-server-hazel.vercel.app/appointmentSpecialty');
            const data = await res.json();
            return data;
        }
    })


    const handelAddDoctor = (data) => {
        // console.log(data.image[0])

        const image = data.image[0];
        const formData = new FormData();
        formData.append('image', image)

        const url = `https://api.imgbb.com/1/upload?key=${imgHostKey}`

        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(imgData => {
                // console.log(imgData)

                if (imgData.success) {
                    console.log(imgData.data.url)

                    const doctor = {
                        name: data.name,
                        email: data.email,
                        specialty: data.specialty,
                        image: imgData.data.url
                    }

                    // set all doctor to database

                    fetch('https://doctors-portal-server-hazel.vercel.app/doctors', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            authorization: `bearer ${localStorage.getItem("accessToken")}`
                        },
                        body: JSON.stringify(doctor)
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data)
                            toast.success(`Doctor is added successfully`);
                            navigate('/dashboard/managedoctors');
                        })
                }
            })



    }

    if (isLoading) {
        return <Loading></Loading>
    }


    return (
        <div className='w-96 p-7 border mt-7 mx-auto'>
            <h2 className='text-4xl'>Add A New Doctor</h2>


            <form onSubmit={handleSubmit(handelAddDoctor)}>

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
                        <span className="label-text">Specialty</span>
                    </label>

                    <select
                        {...register("specialty")}
                        className="select select-bordered w-full max-w-xs">

                        {
                            specialties.map(specialty => <option
                                key={specialty._id}
                                value={specialty.name}
                            >{specialty.name}</option>)
                        }

                    </select>

                </div>
                <div>
                    {/* {signUpError && <p className='text-red-600'>{signUpError}</p>} */}
                </div>

                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Photo</span>
                    </label>
                    <input type="file"
                        {...register("image", {
                            required: "Photo is required"
                        })}
                        className="input input-bordered w-full max-w-xs" />
                    {errors.image && <p className='text-red-600'>{errors.image?.message}</p>}
                </div>


                <input className='btn btn-accent mt-7 w-full' value="Add Doctor" type="submit" />
            </form>
        </div>
    );
};

export default AddDoctor;