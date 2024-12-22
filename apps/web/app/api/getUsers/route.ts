import { prisma } from "@/lib/prisma";
import { stat } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { roomId } = body;

    const users = await prisma.roomParticipant.findMany({
        where: {
            roomName: roomId,
            isActive: true,
        },
        include: {
            user: true,
        },
    });

    return NextResponse.json({ users: users, status: 200 });
}