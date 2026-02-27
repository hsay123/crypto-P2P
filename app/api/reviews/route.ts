import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const revieweeId = searchParams.get('userId');
        if (!revieweeId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const reviews = await prisma.review.findMany({
            where: { revieweeId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        return NextResponse.json({ success: true, reviews, avgRating: avgRating.toFixed(2) });
    } catch (error) {
        console.error('Reviews GET error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId: reviewerId } = await auth();
        if (!reviewerId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { revieweeId, rating, comment } = await req.json();

        if (!revieweeId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Invalid review data' }, { status: 400 });
        }

        if (reviewerId === revieweeId) {
            return NextResponse.json({ error: 'Cannot review yourself' }, { status: 400 });
        }

        const review = await prisma.review.create({
            data: { reviewerId, revieweeId, rating: Math.floor(rating), comment: comment || null },
        });

        return NextResponse.json({ success: true, review });
    } catch (error) {
        console.error('Reviews POST error:', error);
        return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
    }
}
