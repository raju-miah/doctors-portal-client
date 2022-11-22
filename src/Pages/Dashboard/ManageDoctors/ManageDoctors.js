import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../Shared/ConfirmationModal/ConfirmationModal';
import Loading from '../../Shared/Loading/Loading';

const ManageDoctors = () => {

    const [deletingDoctor, setDeletingDoctor] = useState(null);

    const closeModal = () => {
        setDeletingDoctor(null);
    }

    const { data: doctors, isLoading, refetch } = useQuery({
        queryKey: ['doctors'],
        queryFn: async () => {
            try {
                const res = await fetch('https://doctors-portal-server-hazel.vercel.app/doctors', {
                    headers: {
                        authorization: `bearer ${localStorage.getItem("accessToken")}`
                    }
                });
                const data = await res.json();
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    })


    const handelDeleteDoctor = doctor => {
        // console.log(doctor);
        fetch(`https://doctors-portal-server-hazel.vercel.app/doctors/${doctor._id}`, {
            method: 'DELETE',
            headers: {
                authorization: `bearer ${localStorage.getItem("accessToken")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data.deletedCount > 0) {
                    refetch();
                    toast.success(`Doctor ${doctor.name} deleted successfully`)
                }
            })
    }

    if (isLoading) {
        return <Loading></Loading>
    }


    return (
        <div>
            <h2 className='text-4xl'>Manage doctor {doctors.length}</h2>


            <div className="overflow-x-auto">
                <table className="table w-full">

                    <thead>
                        <tr>
                            <th></th>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Specialty</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            doctors.map((doctor, i) => <tr
                                key={doctor._id}
                            >
                                <th>{i + 1}</th>
                                <td><div className="avatar">
                                    <div className="w-24 rounded-full">
                                        <img src={doctor.image} alt="" />
                                    </div>
                                </div></td>
                                <td>{doctor.name}</td>
                                <td>{doctor.specialty}</td>
                                <td>{doctor.email}</td>
                                <td>
                                    <label
                                        onClick={() => setDeletingDoctor(doctor)}
                                        htmlFor="confirmation-modal" className="btn btn-sm btn-error">Delete</label>
                                </td>

                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
            {
                deletingDoctor &&
                <ConfirmationModal
                    title={`Are you sure you want to delete?`}
                    message={`If you delete ${deletingDoctor.name}. You can not be undo`}
                    modalData={deletingDoctor}
                    successAction={handelDeleteDoctor}
                    closeModal={closeModal}
                    successBtnName="Delete"
                ></ConfirmationModal>
            }
        </div>
    );
};

export default ManageDoctors;