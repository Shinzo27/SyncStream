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

    if (!room) {
        return NextResponse.json({ message: 'Room not found', status: 404 })
    }

    const userDetails = await prisma.user.findUnique({
        where: {
            username: user 
        }
    });

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

    const roomUsers = await prisma.roomParticipant.findMany({
        where: {
            roomName: name,
            isActive: true
        },
        include: {
            user: true
        }
    })

    return NextResponse.json({ message: 'Room left', status: 200, roomUsers: roomUsers })
}