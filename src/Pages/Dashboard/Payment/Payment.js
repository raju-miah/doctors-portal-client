import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { useLoaderData, useNavigation } from 'react-router-dom';
import Loading from '../../Shared/Loading/Loading';
import CheckoutForm from './CheckoutForm';


// stripe

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);




const Payment = () => {

    const booking = useLoaderData();
    // console.log(booking)
    const navigation = useNavigation();

    const { patient, treatment, price, appointmentDate, slot } = booking;

    if (navigation.state === "loading") {
        return <Loading></Loading>
    }


    return (
        <div>
            <h1 className='text-4xl'>Hey {patient}</h1>
            <h2 className='text-3xl'>Payment for {treatment}</h2>
            <p className='text-xl'>Please pay <strong>${price}</strong> for your appointment on {appointmentDate} at {slot}</p>

            <div className='w-96 my-12'>
                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        booking={booking}
                    />
                </Elements>
            </div>
        </div>
    );
};

export default Payment;