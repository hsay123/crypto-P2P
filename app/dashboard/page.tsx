"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    ExternalLink,
    RefreshCw,
    Loader2,
    BarChart3,
} from "lucide-react";

interface Transaction {
    id: string;
    type: string;
    cryptocurrency: string;
    amount: number;
    fiatAmount: number;
    txHash: string | null;
    razorpayId: string | null;
    status: string;
    createdAt: string;
}

interface PortfolioData {
    transactions: Transaction[];
    holdings: Record<string, number>;
    totalINRSpent: number;
}

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [data, setData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoaded && !user) {
            router.push("/sign-in");
        }
    }, [isLoaded, user, router]);

    const fetchPortfolio = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/portfolio");
            const json = await res.json();
            if (json.success) {
                setData(json);
            } else {
                setError(json.error || "Failed to load portfolio");
            }
        } catch {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user) fetchPortfolio();
    }, [isLoaded, user]);

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={fetchPortfolio}
                        className="px-4 py-2 bg-lime-400 text-black rounded-lg font-semibold hover:bg-lime-300"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const holdings = data?.holdings || {};
    const transactions = data?.transactions || [];
    const totalINRSpent = data?.totalINRSpent || 0;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-10 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Portfolio</h1>
                        <p className="text-zinc-400 mt-1">
                            Welcome back, {user?.firstName || "Trader"} 👋
                        </p>
                    </div>
                    <button
                        onClick={fetchPortfolio}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-lime-400/10 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-lime-400" />
                            </div>
                            <span className="text-zinc-400 text-sm">Total INR Spent</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            ₹{totalINRSpent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-400/10 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-blue-400" />
                            </div>
                            <span className="text-zinc-400 text-sm">Total Trades</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{transactions.length}</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-400/10 rounded-lg">
                                <Wallet className="h-5 w-5 text-purple-400" />
                            </div>
                            <span className="text-zinc-400 text-sm">Assets Held</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {Object.keys(holdings).length} coins
                        </div>
                    </motion.div>
                </div>

                {/* Holdings per Coin */}
                {Object.keys(holdings).length > 0 && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
                        <h2 className="text-lg font-semibold text-white mb-4">Holdings</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(holdings).map(([coin, amount]) => (
                                <div
                                    key={coin}
                                    className="bg-zinc-800 rounded-xl p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <div className="text-white font-bold text-lg">{amount.toFixed(4)}</div>
                                        <div className="text-zinc-400 text-sm">{coin}</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-lime-400/10 border border-lime-400/20 flex items-center justify-center">
                                        <span className="text-lime-400 font-bold text-xs">{coin.slice(0, 2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transaction History */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-800">
                        <h2 className="text-lg font-semibold text-white">Transaction History</h2>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                <BarChart3 className="h-8 w-8 text-zinc-600" />
                            </div>
                            <p className="text-zinc-400 font-medium">No transactions yet</p>
                            <p className="text-zinc-600 text-sm mt-1">
                                Your trade history will appear here
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-800 bg-zinc-800/40">
                                        <th className="text-left px-6 py-3 text-zinc-400 font-medium">Type</th>
                                        <th className="text-left px-6 py-3 text-zinc-400 font-medium">Crypto</th>
                                        <th className="text-right px-6 py-3 text-zinc-400 font-medium">Amount</th>
                                        <th className="text-right px-6 py-3 text-zinc-400 font-medium">INR</th>
                                        <th className="text-right px-6 py-3 text-zinc-400 font-medium">Status</th>
                                        <th className="text-right px-6 py-3 text-zinc-400 font-medium">Tx Hash</th>
                                        <th className="text-right px-6 py-3 text-zinc-400 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {transactions.map((tx, i) => (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="hover:bg-zinc-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`flex items-center gap-1.5 font-medium ${tx.type === "BUY" ? "text-lime-400" : "text-red-400"
                                                        }`}
                                                >
                                                    {tx.type === "BUY" ? (
                                                        <ArrowDownRight className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    )}
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-white font-medium">{tx.cryptocurrency}</td>
                                            <td className="px-6 py-4 text-right text-white font-mono">
                                                {tx.amount.toFixed(4)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-white font-mono">
                                                ₹{tx.fiatAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${tx.status === "SUCCESS"
                                                        ? "bg-lime-400/10 text-lime-400"
                                                        : "bg-red-400/10 text-red-400"
                                                        }`}
                                                >
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {tx.txHash ? (
                                                    <a
                                                        href={`https://amoy.polygonscan.com/tx/${tx.txHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-end gap-1 text-lime-400 hover:text-lime-300 font-mono text-xs"
                                                    >
                                                        {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-4)}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-zinc-600 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-zinc-400 text-xs">
                                                {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
