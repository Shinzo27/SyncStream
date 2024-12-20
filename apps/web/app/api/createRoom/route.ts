import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST (req: NextRequest) {
    const body = await req.json();
    const { name, user, password } = body;

    const room = await prisma.room.findFirst({
        where: {
            name: name
        }
    });

    if (room) {
        return NextResponse.json({ message: 'Room already exists' });
    }

    const userDetails = await prisma.user.findFirst({
        where: {
            username: user 
        }
    });

    await prisma.room.create({
        data: {
            name: name,
            hostId: userDetails?.id || '',
            participants: {
                create: {
                    userId: userDetails?.id || '',
                    isHost: true
                }
            },
            password: password
        }
    })
    
    return NextResponse.json({ message: 'Room created successfully', roomId: name, status: 200 })
}