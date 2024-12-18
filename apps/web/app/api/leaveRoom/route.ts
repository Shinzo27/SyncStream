import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'

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

    if (!userDetails) {
        return NextResponse.json({ message: 'User not found', status: 404 })
    }

    await prisma.roomParticipant.update({
        where: {
            id: room.id,
            roomName: name,
            userId: userDetails?.id || '',
        },
        data: {
            isActive: false,
        }
    })

  return NextResponse.json({ message: 'Room left', status: 200 })
}