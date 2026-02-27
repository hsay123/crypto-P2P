import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// This endpoint completes onboarding and updates all user fields
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received onboarding data:', data);

    const {
      clerkId,
      dateOfBirth,
      firstName,
      lastName,
      phone,
      email,
      bankName,
      accountNumber,
      ifsc,
      walletAddress,
      ...rest
    } = data;

    if (!clerkId) {
      return NextResponse.json({ error: 'Missing clerkId' }, { status: 400 });
    }
    if (!walletAddress) {
      return NextResponse.json({ error: 'Missing walletAddress' }, { status: 400 });
    }

    const formattedDateOfBirth = dateOfBirth
      ? new Date(`${dateOfBirth}T00:00:00Z`)
      : undefined;

    // Update user in DB
    let user;
    try {
      user = await prisma.user.update({
        where: { clerkId },
        data: {
          ...rest,
          firstName,
          lastName,
          phone,
          email,
          bankName,
          accountNumber,
          ifsc,
          walletAddress,
          dateOfBirth: formattedDateOfBirth,
          onboardingComplete: true,
        },
      });
    } catch (err) {
      console.log('User not found for clerkId:', clerkId);
      return NextResponse.json(
        { error: 'User not found for clerkId' },
        { status: 404 }
      );
    }

    // Store dummy Razorpay IDs in DB (real ones need Live mode)
    try {
      await prisma.razorpay.create({
        data: {
          contactId: 'test_contact_' + Date.now(),
          fundAccountId: 'test_fund_' + Date.now(),
          userId: user.id,
        },
      });
    } catch (err) {
      // Not a blocker — ignore if already exists
      console.log('Razorpay record skipped:', err);
    }

    console.log('Onboarding complete for user:', user.id);
    return NextResponse.json({ user });
  } catch (error: any) {
    console.log('Error in complete-onboarding:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}