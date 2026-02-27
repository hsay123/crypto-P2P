import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const transactions = await prisma.transaction.findMany({
            where: { userId: clerkId },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });

        // Compute holdings per coin
        const holdings: Record<string, number> = {};
        let totalINRSpent = 0;

        for (const tx of transactions) {
            if (tx.type === 'BUY' && tx.status === 'SUCCESS') {
                holdings[tx.cryptocurrency] = (holdings[tx.cryptocurrency] || 0) + tx.amount;
                totalINRSpent += tx.fiatAmount;
            }
        }

        return NextResponse.json({
            success: true,
            transactions,
            holdings,
            totalINRSpent,
        });
    } catch (error) {
        console.error('Portfolio API error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch portfolio' }, { status: 500 });
    }
}
