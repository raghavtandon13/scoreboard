"use client";

import { cn } from "@scoreboard/ui/lib/utils";

interface LeagueChipProps {
    name: string;
    logo?: string;
    isActive?: boolean;
    onClick?: () => void;
}

export default function LeagueChip({
    name,
    logo,
    isActive = false,
    onClick,
}: LeagueChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex-shrink-0 rounded-md border px-5 py-2 font-label text-xs uppercase tracking-tight transition-colors",
                isActive
                    ? "bg-primary font-bold text-on-primary"
                    : "border-outline-variant/10 bg-surface-container-high text-on-surface hover:bg-surface-variant",
            )}
        >
            {logo && (
                <img
                    src={logo}
                    alt={name}
                    className="mr-2 inline-block h-4 w-4 align-middle"
                />
            )}
            {name}
        </button>
    );
}
