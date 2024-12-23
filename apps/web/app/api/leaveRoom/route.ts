import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'

export async function POST (req: NextRequest) {
    const body = await req.json();
    const { name, user } = body;

    const room = await prisma.room.findUnique({
        where: {
            name: name
        }
    });
    console.log(room)

    if (!room) {
        return NextResponse.json({ message: 'Room not found', status: 404 })
    }

    const userDetails = await prisma.user.findUnique({
        where: {
            username: user 
        }
    });
    console.log(userDetails)

    if (!userDetails) {
        return NextResponse.json({ message: 'User not found', status: 404 })
    }

    await prisma.roomParticipant.update({
        where: {
            roomName_userId: {
                roomName: name,
                userId: userDetails.id
            }
        },
        data: {
            isActive: false
        }
    })
    console.log("Updated")
    return NextResponse.json({ message: 'Room left', status: 200 })
}