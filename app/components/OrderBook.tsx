"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react";

interface RawOrder {
    id: string;
    price: string;
    available: string;
    limits: string;
    trader: { name: string; completion: string; orders: number; verified: boolean; rating: number };
}

interface OrderBookProps {
    cryptocurrency: string;
}

export default function OrderBook({ cryptocurrency }: OrderBookProps) {
    const [open, setOpen] = useState(false);
    const [buyOrders, setBuyOrders] = useState<RawOrder[]>([]);
    const [sellOrders, setSellOrders] = useState<RawOrder[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrderBook = async () => {
        if (!open) return;
        setLoading(true);
        try {
            const [buyRes, sellRes] = await Promise.all([
                fetch(`/api/p2p/orders?type=BUY&cryptocurrency=${cryptocurrency}`),
                fetch(`/api/p2p/orders?type=SELL&cryptocurrency=${cryptocurrency}`),
            ]);
            const [buyData, sellData] = await Promise.all([buyRes.json(), sellRes.json()]);
            if (buyData.success) setBuyOrders(buyData.orders.slice(0, 8));
            if (sellData.success) setSellOrders(sellData.orders.slice(0, 8));
        } catch (e) {
            console.error("OrderBook fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderBook();
    }, [open, cryptocurrency]);

    const parsePrice = (s: string) => parseFloat(s.replace(/[^\d.]/g, "")) || 0;
    const maxBuyPrice = buyOrders.length > 0 ? Math.max(...buyOrders.map(o => parsePrice(o.price))) : 0;
    const minSellPrice = sellOrders.length > 0 ? Math.min(...sellOrders.map(o => parsePrice(o.price))) : 0;
    const spread = minSellPrice && maxBuyPrice ? (minSellPrice - maxBuyPrice).toFixed(2) : null;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mt-6">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-800/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">Order Book</span>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                        {cryptocurrency}
                    </span>
                    {spread && (
                        <span className="text-xs text-zinc-400">
                            Spread: <span className="text-lime-400 font-mono">₹{spread}</span>
                        </span>
                    )}
                </div>
                {open ? (
                    <ChevronUp className="h-4 w-4 text-zinc-400" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                )}
            </button>

            {open && (
                <div className="border-t border-zinc-800">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 divide-x divide-zinc-800">
                            {/* BUY side */}
                            <div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border-b border-zinc-800">
                                    <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                                    <span className="text-xs font-semibold text-green-400 uppercase">Buy Orders</span>
                                </div>
                                <div className="text-xs grid grid-cols-3 gap-2 px-4 py-2 text-zinc-500 border-b border-zinc-800/50">
                                    <span>Price (INR)</span>
                                    <span>Amount</span>
                                    <span>Limits</span>
                                </div>
                                {buyOrders.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-zinc-600 text-sm">No buy orders</div>
                                ) : (
                                    buyOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="grid grid-cols-3 gap-2 px-4 py-2.5 border-b border-zinc-800/30 hover:bg-green-900/10 transition-colors relative"
                                        >
                                            {/* Depth bar */}
                                            <div
                                                className="absolute inset-y-0 left-0 bg-green-500/5"
                                                style={{ width: `${Math.min(100, (parsePrice(order.price) / maxBuyPrice) * 100)}%` }}
                                            />
                                            <span className="text-green-400 font-mono font-semibold relative z-10">
                                                {order.price}
                                            </span>
                                            <span className="text-white text-xs relative z-10">{order.available}</span>
                                            <span className="text-zinc-400 text-xs relative z-10">{order.limits}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* SELL side */}
                            <div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border-b border-zinc-800">
                                    <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                                    <span className="text-xs font-semibold text-red-400 uppercase">Sell Orders</span>
                                </div>
                                <div className="text-xs grid grid-cols-3 gap-2 px-4 py-2 text-zinc-500 border-b border-zinc-800/50">
                                    <span>Price (INR)</span>
                                    <span>Amount</span>
                                    <span>Limits</span>
                                </div>
                                {sellOrders.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-zinc-600 text-sm">No sell orders</div>
                                ) : (
                                    sellOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="grid grid-cols-3 gap-2 px-4 py-2.5 border-b border-zinc-800/30 hover:bg-red-900/10 transition-colors relative"
                                        >
                                            <div
                                                className="absolute inset-y-0 right-0 bg-red-500/5"
                                                style={{ width: `${Math.min(100, (minSellPrice / parsePrice(order.price)) * 100)}%` }}
                                            />
                                            <span className="text-red-400 font-mono font-semibold relative z-10">
                                                {order.price}
                                            </span>
                                            <span className="text-white text-xs relative z-10">{order.available}</span>
                                            <span className="text-zinc-400 text-xs relative z-10">{order.limits}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
