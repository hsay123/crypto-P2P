"use client";
import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface PriceData {
    USDC: { inr: number; usd: number; change24h: number; lastUpdated: number } | null;
    USDT: { inr: number; usd: number; change24h: number; lastUpdated: number } | null;
}

interface ChartPoint {
    time: string;
    price: number;
}

// Generate mock sparkline data for visual effect
function generateSparkline(basePrice: number, points = 20): ChartPoint[] {
    const data: ChartPoint[] = [];
    let price = basePrice * 0.98;
    for (let i = 0; i < points; i++) {
        price = price + (Math.random() - 0.49) * (basePrice * 0.003);
        data.push({
            time: `${i}`,
            price: parseFloat(price.toFixed(2)),
        });
    }
    // Last point is the current price
    data[data.length - 1].price = basePrice;
    return data;
}

export default function PriceChart() {
    const [prices, setPrices] = useState<PriceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const fetchPrices = async () => {
        try {
            const res = await fetch("/api/prices");
            const data = await res.json();
            if (data.success) {
                setPrices(data.prices);
                setLastRefresh(new Date());
            }
        } catch (e) {
            console.error("Price fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 animate-pulse">
                <div className="h-16 bg-zinc-800 rounded-lg" />
            </div>
        );
    }

    const coins = [
        { symbol: "USDC", data: prices?.USDC, color: "#a3e635" },
        { symbol: "USDT", data: prices?.USDT, color: "#34d399" },
    ];

    return (
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                    Live Prices
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>Updated: {lastRefresh.toLocaleTimeString()}</span>
                    <button
                        onClick={fetchPrices}
                        className="hover:text-lime-400 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="h-3 w-3" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coins.map(({ symbol, data, color }) => {
                    if (!data) return null;
                    const sparkData = generateSparkline(data.inr);
                    const isPositive = (data.change24h ?? 0) >= 0;

                    return (
                        <div
                            key={symbol}
                            className="bg-zinc-800 rounded-xl p-4 flex items-center gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-white text-sm">{symbol}/INR</span>
                                    <span
                                        className={`flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${isPositive
                                                ? "bg-lime-400/10 text-lime-400"
                                                : "bg-red-400/10 text-red-400"
                                            }`}
                                    >
                                        {isPositive ? (
                                            <TrendingUp className="h-3 w-3" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3" />
                                        )}
                                        {isPositive ? "+" : ""}
                                        {data.change24h?.toFixed(2) ?? "0.00"}%
                                    </span>
                                </div>
                                <div className="text-xl font-bold text-lime-400">
                                    ₹{data.inr?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-xs text-zinc-500">
                                    ${data.usd?.toFixed(4)} USD
                                </div>
                            </div>

                            <div className="w-32 h-14">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                                        <defs>
                                            <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke={color}
                                            strokeWidth={1.5}
                                            fill={`url(#gradient-${symbol})`}
                                            dot={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
