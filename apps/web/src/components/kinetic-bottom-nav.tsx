"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/", icon: "home_max", label: "Home" },
    { href: "/leagues", icon: "leaderboard", label: "Leagues" },
    { href: "/news", icon: "rss_feed", label: "News" },
    { href: "/teams", icon: "groups", label: "Teams" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around bg-surface-bright/60 px-4 pt-3 pb-6 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl md:hidden">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center justify-center rounded-xl px-4 py-1 transition-all duration-300 ${
                            isActive
                                ? "bg-primary/10 text-primary"
                                : "text-on-surface-variant hover:text-primary"
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {item.icon}
                        </span>
                        <span className="font-label font-medium text-[10px] uppercase tracking-tight">
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
