"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Wallet,
    Copy,
    CheckCheck,
    RefreshCw,
    Loader2,
    ExternalLink,
    Plus,
    Coins,
} from "lucide-react";

interface Balances {
    USDC: { amount: string; network: string; contract: string };
    MON: { amount: string; network: string };
}

interface Transaction {
    id: string;
    type: string;
    cryptocurrency: string;
    amount: number;
    fiatAmount: number;
    txHash: string | null;
    status: string;
    createdAt: string;
}

export default function WalletPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [balances, setBalances] = useState<Balances | null>(null);
    const [recentTxs, setRecentTxs] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isLoaded && !user) router.push("/sign-in");
    }, [isLoaded, user, router]);

    useEffect(() => {
        if (isLoaded && user) fetchWalletData();
    }, [isLoaded, user]);

    const fetchWalletData = async () => {
        setLoading(true);
        try {
            // Fetch wallet address from user-status API
            const statusRes = await fetch(`/api/user-status?clerkId=${user?.id}`);
            const statusData = await statusRes.json();
            const addr = statusData?.walletAddress || null;
            setWalletAddress(addr);

            // Fetch recent transactions
            const txRes = await fetch("/api/portfolio");
            const txData = await txRes.json();
            if (txData.success) setRecentTxs(txData.transactions.slice(0, 5));

            // Fetch on-chain balances if address exists
            if (addr) await fetchBalances(addr);
        } catch (e) {
            console.error("Wallet page error:", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchBalances = async (address: string) => {
        setBalanceLoading(true);
        try {
            const res = await fetch(`/api/wallet/balance?address=${address}`);
            const data = await res.json();
            if (data.success) setBalances(data.balances);
        } catch (e) {
            console.error("Balance fetch error:", e);
        } finally {
            setBalanceLoading(false);
        }
    };

    const copyAddress = () => {
        if (walletAddress) {
            navigator.clipboard.writeText(walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const addToMetaMask = async () => {
        if (typeof window === "undefined" || !(window as any).ethereum) {
            alert("MetaMask not detected. Please install MetaMask.");
            return;
        }
        try {
            await (window as any).ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "0x13882", // 80002 hex
                        chainName: "Polygon Amoy Testnet",
                        nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
                        rpcUrls: ["https://rpc-amoy.polygon.technology"],
                        blockExplorerUrls: ["https://amoy.polygonscan.com"],
                    },
                ],
            });
        } catch (e: any) {
            console.error("MetaMask error:", e);
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-10 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Wallet</h1>
                        <p className="text-zinc-400 mt-1">Your on-chain balances</p>
                    </div>
                    <button
                        onClick={() => walletAddress && fetchBalances(walletAddress)}
                        disabled={!walletAddress || balanceLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${balanceLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>

                {/* Wallet Address Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Wallet className="h-5 w-5 text-lime-400" />
                        <span className="text-zinc-400 text-sm font-medium">Wallet Address</span>
                    </div>
                    {walletAddress ? (
                        <div className="flex items-center justify-between gap-3 bg-zinc-800 rounded-lg p-3">
                            <span className="font-mono text-white text-sm break-all">{walletAddress}</span>
                            <button
                                onClick={copyAddress}
                                className="shrink-0 p-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 transition-colors"
                                title="Copy address"
                            >
                                {copied ? (
                                    <CheckCheck className="h-4 w-4 text-lime-400" />
                                ) : (
                                    <Copy className="h-4 w-4 text-zinc-400" />
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-zinc-800 rounded-lg p-3 text-zinc-500 text-sm">
                            No wallet address linked. Complete onboarding to add one.
                        </div>
                    )}

                    <button
                        onClick={addToMetaMask}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 text-purple-400 rounded-lg text-sm transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Polygon Amoy to MetaMask
                    </button>
                </motion.div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* USDC Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-blue-400 font-bold text-xs">USDC</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">USD Coin</div>
                                    <div className="text-xs text-zinc-500">Polygon Amoy</div>
                                </div>
                            </div>
                            <ExternalLink
                                className="h-4 w-4 text-zinc-600 cursor-pointer hover:text-lime-400"
                                onClick={() => window.open(`https://amoy.polygonscan.com/address/${walletAddress}`, "_blank")}
                            />
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {balanceLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                            ) : (
                                balances?.USDC.amount ?? "—"
                            )}
                        </div>
                        <div className="text-zinc-500 text-sm mt-1">USDC</div>
                    </motion.div>

                    {/* MON Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-purple-400 font-bold text-xs">MON</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Monad</div>
                                    <div className="text-xs text-zinc-500">Monad Testnet</div>
                                </div>
                            </div>
                            <Coins className="h-4 w-4 text-zinc-600" />
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {balanceLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                            ) : (
                                balances?.MON.amount ?? "—"
                            )}
                        </div>
                        <div className="text-zinc-500 text-sm mt-1">MON</div>
                    </motion.div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-800">
                        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                    </div>
                    {recentTxs.length === 0 ? (
                        <div className="py-12 text-center text-zinc-500">No transactions yet</div>
                    ) : (
                        <div className="divide-y divide-zinc-800">
                            {recentTxs.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${tx.type === "BUY"
                                                ? "bg-lime-400/10 text-lime-400"
                                                : "bg-red-400/10 text-red-400"
                                                }`}
                                        >
                                            {tx.type === "BUY" ? "↓" : "↑"}
                                        </div>
                                        <div>
                                            <div className="text-white text-sm font-medium">
                                                {tx.type} {tx.cryptocurrency}
                                            </div>
                                            <div className="text-zinc-500 text-xs">
                                                {new Date(tx.createdAt).toLocaleDateString("en-IN")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-mono text-sm">{tx.amount.toFixed(4)}</div>
                                        <div className="text-zinc-500 text-xs">
                                            ₹{tx.fiatAmount.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
