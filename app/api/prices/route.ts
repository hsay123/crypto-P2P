import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 30; // ISR cache for 30 seconds

export async function GET(req: NextRequest) {
    try {
        const ids = 'usd-coin,tether,monad';
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr,usd&include_24hr_change=true&include_last_updated_at=true`;

        const res = await fetch(url, {
            headers: {
                Accept: 'application/json',
                'x-cg-demo-api-key': process.env.COINGECKO_API_KEY || '',
            },
            next: { revalidate: 30 },
        });

        if (!res.ok) {
            throw new Error(`CoinGecko responded with ${res.status}`);
        }

        const data = await res.json();

        return NextResponse.json({
            success: true,
            prices: {
                USDC: {
                    inr: data?.['usd-coin']?.inr ?? null,
                    usd: data?.['usd-coin']?.usd ?? null,
                    change24h: data?.['usd-coin']?.inr_24h_change ?? null,
                    lastUpdated: data?.['usd-coin']?.last_updated_at ?? null,
                },
                USDT: {
                    inr: data?.tether?.inr ?? null,
                    usd: data?.tether?.usd ?? null,
                    change24h: data?.tether?.inr_24h_change ?? null,
                    lastUpdated: data?.tether?.last_updated_at ?? null,
                },
            },
            fetchedAt: Date.now(),
        });
    } catch (error: any) {
        console.error('Prices API error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch prices' },
            { status: 500 }
        );
    }
}
