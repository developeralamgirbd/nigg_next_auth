'use client'
import { useSession, signIn } from 'next-auth/react';
import {useEffect, useState} from 'react';
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
import {useRouter} from "next/navigation";
import Link from 'next/link';
import { useToast } from "@/components/ui/use-toast"


const SignIn = () => {
    const router = useRouter();
    const { toast } = useToast()

    const { data: session, status } = useSession();


   useEffect(() => {
        if (session && status === 'authenticated') {
            router.replace('/');
        }
    }, [session, router]);




    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

       const response = await signIn('credentials', {
            email: formData?.email,
            password: formData?.password,
            redirect: false
            })
            
            if(response?.ok){
               
                router.refresh();
                router.push('/');
               
            }else{
                // console.log('error', error);
            
                toast({
                    title: "Error",
                    description: "Ops, something went wrong!",
                    variant: "destructive"
                  })
        
            }
            
        
       
    };
    if (status === 'loading') {
        return <p>Loading...</p>;
      }
  


    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input onChange={handleChange} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input onChange={handleChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300"></label>
                                    </div>
                                </div>
                                {/* <Link href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</Link> */}
                            </div>
                            <button type="submit" className={`w-full text-white 
                            ${
                                formData?.email?.length == 0 
                                || formData?.password?.length === 0
                                ? "bg-green-200" : "bg-green-400 " 
                            } hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}>Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don't have an account yet? <Link href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignIn;
