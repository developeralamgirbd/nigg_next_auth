import prisma from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";


export async function POST(req: Request) {

    try{

        const body = await req.json();

        const {email, password} = body;

        const hashPassword = await hash(password, 10)

        const exitingUserByEmail = await prisma.user.findUnique({
            where: {email}
        })

        if(exitingUserByEmail){
            return NextResponse.json({user: null, message: 'User already exits'}, {status: 409})
        }

        console.log('body', body);
        
        const createUser = await prisma.user.create({
            data: {
                email: email,
                password: hashPassword
            }
        })


        return NextResponse.json({user: createUser, message: 'registration successfully'})

    }catch(error){

    }
    
}