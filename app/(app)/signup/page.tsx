'use client'
import { useSession, signIn } from 'next-auth/react';

import {useEffect, useState} from 'react';
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
import {useRouter} from "next/navigation";
import Link from 'next/link';

const SignUp = () => {
    // const { data: session } = useSession();
    const router = useRouter();

/*    useEffect(() => {
        if (session) {
            router.replace('/');
        }
    }, [session, router]);*/




    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });


    // @ts-ignore
    const handleChange = (e) => {
        const { name, value, type, checked, file } = e.target;

        /*setFormErrors((prevFormErrors) => ({
            ...prevFormErrors,
            [name]: '',
        }));*/

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // @ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(formData)
        });

        console.log('response', response);
        



        // await signIn('credentials', formData).then(res => {
        //     console.log(res)
        //      // @ts-ignore
        // }).catch((error) => {
        //     console.log(error)
        // });
    };

    console.log('formData', formData);
    



    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create and account
                        </h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input onChange={handleChange} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required={true} />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input onChange={handleChange} type="password" name="password" id="password" placeholder="••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <input onChange={handleChange} type="password" name="confirmPassword" id="confirm-password" placeholder="••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                            </div>
                    
                            <button type="submit" className={`w-full text-white ${  
                                formData?.email?.length == 0 
                                || formData?.email?.length === 0
                                || formData?.confirmPassword?.length === 0
                                || formData?.password !== formData?.confirmPassword
                                ? "bg-green-200" : "bg-green-400 " } hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}>Create An Account</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <Link href="/signin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                            </p>
                        </form>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
