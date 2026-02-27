import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const USDC_CONTRACT_ADDRESS = '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582';
const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
];

const polygonProvider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology', {
    chainId: 80002,
    name: 'polygon-amoy',
});

const monadProvider = new ethers.JsonRpcProvider(
    process.env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz',
    {
        chainId: process.env.MONAD_CHAIN_ID ? Number(process.env.MONAD_CHAIN_ID) : 10143,
        name: 'monad-testnet',
    }
);

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const address = searchParams.get('address');
        if (!address || !ethers.isAddress(address)) {
            return NextResponse.json({ error: 'Invalid or missing address' }, { status: 400 });
        }

        // Fetch USDC balance on Polygon Amoy
        let usdcBalance = '0';
        let monBalance = '0';

        try {
            const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, ERC20_ABI, polygonProvider);
            const rawBalance = await usdcContract.balanceOf(address);
            usdcBalance = ethers.formatUnits(rawBalance, 6);
        } catch (e) {
            console.error('USDC balance fetch failed:', e);
        }

        // Fetch MON native balance on Monad Testnet
        try {
            const rawMon = await monadProvider.getBalance(address);
            monBalance = ethers.formatEther(rawMon);
        } catch (e) {
            console.error('MON balance fetch failed:', e);
        }

        return NextResponse.json({
            success: true,
            address,
            balances: {
                USDC: {
                    amount: parseFloat(usdcBalance).toFixed(4),
                    network: 'Polygon Amoy',
                    contract: USDC_CONTRACT_ADDRESS,
                },
                MON: {
                    amount: parseFloat(monBalance).toFixed(4),
                    network: 'Monad Testnet',
                },
            },
        });
    } catch (error: any) {
        console.error('Wallet balance error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
