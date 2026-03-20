"use client";

import { cn } from "@scoreboard/ui/lib/utils";
import Link from "next/link";

interface Team {
    id: number;
    name: string;
    logo: string;
}

interface MatchCardProps {
    fixture: {
        id: number;
        date?: string;
        league: {
            name: string;
            logo: string;
        };
        teams: {
            home: Team;
            away: Team;
        };
        goals: {
            home: number | null;
            away: number | null;
        };
        status: {
            short: string;
            elapsed: number | null;
        };
    };
    showStats?: boolean;
    stats?: {
        xg?: { home: number; away: number };
        possession?: { home: number; away: number };
    };
}

export default function MatchCard({
    fixture,
    showStats = false,
    stats,
}: MatchCardProps) {
    const statusShort = fixture.status?.short;
    const isLive = statusShort === "LIVE";
    const isFinished = statusShort === "FT";

    return (
        <Link href={`/match/${fixture.id}`}>
            <div
                className={cn(
                    "group cursor-pointer rounded-xl border-l-4 bg-surface-container-highest p-5 shadow-xl transition-colors hover:bg-surface-bright",
                    isLive ? "border-primary" : "border-outline-variant/10",
                )}
            >
                <div className="mb-6 flex items-start justify-between">
                    <span className="font-bold font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                        {fixture.league.name}
                    </span>
                    {isLive && (
                        <div className="flex items-center gap-2 rounded bg-error-container/20 px-2 py-0.5">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-error" />
                            <span className="font-bold font-label text-[10px] text-error">
                                {fixture.status?.elapsed ?? ""}
                            </span>
                        </div>
                    )}
                    {isFinished && (
                        <span className="font-bold font-label text-[10px] text-on-surface-variant">
                            FT
                        </span>
                    )}
                    {!isLive && !isFinished && (
                        <span className="font-bold font-label text-[10px] text-on-surface-variant">
                            {fixture.date
                                ? new Date(fixture.date).toLocaleTimeString(
                                      [],
                                      {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      },
                                  )
                                : ""}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full border border-outline-variant/20 bg-surface-container-low p-1.5">
                                <img
                                    src={fixture.teams.home.logo}
                                    alt={fixture.teams.home.name}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <span className="font-body font-semibold text-lg">
                                {fixture.teams.home.name}
                            </span>
                        </div>
                        <span
                            className={cn(
                                "font-black font-headline text-3xl",
                                isLive
                                    ? "text-primary"
                                    : "text-on-surface-variant",
                            )}
                        >
                            {fixture.goals.home ?? "-"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full border border-outline-variant/20 bg-surface-container-low p-1.5">
                                <img
                                    src={fixture.teams.away.logo}
                                    alt={fixture.teams.away.name}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <span className="font-body font-semibold text-lg">
                                {fixture.teams.away.name}
                            </span>
                        </div>
                        <span className="font-black font-headline text-3xl text-on-surface-variant">
                            {fixture.goals.away ?? "-"}
                        </span>
                    </div>
                </div>

                {showStats && stats && (
                    <div className="mt-6 flex items-center justify-between border-outline-variant/10 border-t pt-4">
                        <div className="flex gap-2">
                            {stats.xg && (
                                <span className="rounded bg-surface-variant px-2 py-1 font-label text-[9px] text-on-surface-variant uppercase">
                                    xG {stats.xg.home}
                                </span>
                            )}
                            {stats.possession && (
                                <span className="rounded bg-surface-variant px-2 py-1 font-label text-[9px] text-on-surface-variant uppercase">
                                    Poss. {stats.possession.home}%
                                </span>
                            )}
                        </div>
                        <span className="material-symbols-outlined text-lg text-primary-dim">
                            query_stats
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}
