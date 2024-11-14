import { userSchema } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function POST(req: NextRequest) {
    if(req.method !== "POST") {
        return  NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
    const body = await req.json();

    const parsedPayload = userSchema.safeParse(body);
    if(!parsedPayload.success) {
        return NextResponse.json({ message: "Enter a valid details" }, { status: 400 });
    }

    const { username, email, password } = parsedPayload.data;

    const existingUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    });
    if(existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const existingUsername = await prisma.user.findFirst({
        where: {
            username: username
        }
    });
    if(existingUsername) {
        return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword
        }
    });

    if(newUser) {
        return NextResponse.json({ message: "User created successfully" }, { status: 200 });
    } else {
        return NextResponse.json({ message: "Error creating user" }, { status: 500 });
    }
}