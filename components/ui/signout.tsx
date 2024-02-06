'use client'
import { signOut } from "next-auth/react"
const SignOut = () =>{

    return <span onClick={()=> signOut({
        redirect: true,
        callbackUrl: `${window.location.origin}/signin`
    }) } className="cursor-pointer">Sign Out</span>

}


export default SignOut;