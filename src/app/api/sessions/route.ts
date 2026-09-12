import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamAName, teamBName, teamAScore, teamBScore, winner } = body;

    const session = await prisma.gameSession.create({
      data: {
        teamAName: teamAName || 'The Explorers',
        teamBName: teamBName || 'The Guardians',
        teamAScore: Number(teamAScore) || 0,
        teamBScore: Number(teamBScore) || 0,
        winner: winner || null,
      },
    });

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Error saving game session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record game session' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sessions = await prisma.gameSession.findMany({
      orderBy: { completedAt: 'desc' },
      take: 15,
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error('Error retrieving game sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load game sessions' },
      { status: 500 }
    );
  }
}
