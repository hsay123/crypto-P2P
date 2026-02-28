"use client";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Bell, LayoutDashboard, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/app/hooks/useNotifications";

export default function Navbar() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close bell dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="h-10 w-10 rounded-full bg-lime-400 flex items-center justify-center"
          >
            <DollarSign className="h-6 w-6 text-black" />
          </motion.div>
          <Link href="/" className="font-bold text-xl text-lime-400 select-none">
            RupeeLink
          </Link>
        </div>

        <nav className="hidden md:flex gap-8">
          <a href="#features" className="text-sm font-medium transition-colors hover:text-lime-400">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium transition-colors hover:text-lime-400">
            How It Works
          </a>
          <Link href="/exchange" className="text-sm font-medium transition-colors hover:text-lime-400">
            P2P Trading
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-lime-400">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Portfolio
          </Link>
          <Link href="/wallet" className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-lime-400">
            <Wallet className="h-3.5 w-3.5" />
            Wallet
          </Link>
          <a href="#testimonials" className="text-sm font-medium transition-colors hover:text-lime-400">
            Reviews
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <SignedIn>
            <div ref={bellRef} className="relative">
              <button
                onClick={() => {
                  setBellOpen((prev) => !prev);
                  if (!bellOpen) markAllRead();
                }}
                className="relative p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {bellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                      <span className="font-semibold text-white text-sm">Notifications</span>
                      <button
                        onClick={markAllRead}
                        className="text-xs text-lime-400 hover:text-lime-300"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`px-4 py-3 hover:bg-zinc-800 transition-colors ${!n.read ? "border-l-2 border-lime-400" : ""
                              }`}
                          >
                            <div className="font-medium text-white text-sm">{n.title}</div>
                            <div className="text-zinc-400 text-xs mt-0.5">{n.message}</div>
                            <div className="text-zinc-600 text-xs mt-1">
                              {n.timestamp.toLocaleTimeString()}
                            </div>
                            {n.link && (
                              <Link
                                href={n.link}
                                className="text-lime-400 hover:text-lime-300 text-xs mt-1 inline-block"
                                onClick={() => setBellOpen(false)}
                              >
                                Trade now →
                              </Link>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-5 py-2 rounded-xl bg-lime-400 text-black font-semibold shadow hover:bg-lime-300 transition-colors border border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/40">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="px-4 py-2 rounded-lg text-lime-400 hover:bg-lime-400/10 transition-colors font-medium"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="px-4 py-2 rounded-lg text-lime-400 hover:bg-lime-400/10 transition-colors font-medium"
              >
                Settings
              </Link>
              <div className="ml-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </motion.header>
  );
}
