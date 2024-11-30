import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST (req: NextRequest) {
    const body = await req.json();
    const { name, user } = body;

    const room = await prisma.room.findFirst({
        where: {
            name: name
        }
    });

    if (!room) {
        return NextResponse.json({ message: 'Room not found', status: 404 })
    }

    const userDetails = await prisma.user.findFirst({
        where: {
            username: user 
        }
    });

    console.log(userDetails)

    if (!userDetails) {
        return NextResponse.json({ message: 'User not found', status: 404 })
    }
    
    const roomParticipant = await prisma.roomParticipant.findFirst({
        where: {
            roomName: name,
            userId: userDetails.id
        }
    })

    if (roomParticipant) {
        return NextResponse.json({ message: 'User Joined Room', status: 200 })
    }

    await prisma.roomParticipant.create({
        data: {
            roomName: name,
            userId: userDetails.id,
            isHost: false,
            isActive: true,
        }
    })

    return NextResponse.json({ message: 'Room found! You are now a participant', roomId: name, status: 200 })
}