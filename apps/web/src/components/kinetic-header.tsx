"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
    showNav?: boolean;
}

export default function Header({ showNav = true }: HeaderProps) {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Scores", active: pathname === "/" },
        { href: "/leagues", label: "Leagues", active: pathname === "/leagues" },
        { href: "/news", label: "News", active: pathname === "/news" },
        { href: "/teams", label: "Teams", active: pathname === "/teams" },
    ];

    return (
        <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-surface-bright/60 px-6 py-4 shadow-[0_0_32px_rgba(246,246,247,0.06)] backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                    terminal
                </span>
                <h1 className="font-black font-bold font-headline text-primary text-xl uppercase tracking-tighter tracking-widest">
                    SCOREBOARD
                </h1>
            </Link>

            {showNav && (
                <nav className="mr-6 hidden gap-6 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`rounded px-3 py-1 font-label text-sm uppercase tracking-wider transition-colors duration-200 ${
                                item.active
                                    ? "text-primary hover:bg-primary/10"
                                    : "text-foreground hover:bg-primary/10"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            )}

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="material-symbols-outlined text-foreground transition-colors hover:text-primary"
                >
                    search
                </button>
                <div className="h-8 w-8 overflow-hidden rounded-full border border-outline-variant/20 bg-surface-container-highest">
                    <div className="flex h-full w-full items-center justify-center bg-surface">
                        <span className="material-symbols-outlined text-on-surface-variant text-sm">
                            person
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
