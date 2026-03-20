"use client";

import type {
    FixtureEvents,
    FixtureLineups,
} from "@scoreboard/api/lib/api-football-types";
import { Button } from "@scoreboard/ui/components/button";
import { cn } from "@scoreboard/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use, useState } from "react";
import { trpc } from "@/utils/trpc";

type TabType = "stats" | "lineups" | "commentary" | "h2h";

export default function MatchDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [activeTab, setActiveTab] = useState<TabType>("stats");

    const fixtureId = Number.parseInt(id, 10);

    const { data: fixture, isLoading: fixtureLoading } = useQuery(
        trpc.football.fixtureById.queryOptions({ id: fixtureId }),
    );

    const { data: events } = useQuery(
        trpc.football.fixtureEvents.queryOptions({ fixture: fixtureId }),
    );

    const { data: lineups } = useQuery(
        trpc.football.fixtureLineups.queryOptions({ fixture: fixtureId }),
    );

    const { data: statistics } = useQuery(
        trpc.football.fixtureStatistics.queryOptions({ fixture: fixtureId }),
    );

    const tabs: { id: TabType; label: string }[] = [
        { id: "stats", label: "Stats" },
        { id: "lineups", label: "Line-ups" },
        { id: "commentary", label: "Commentary" },
        { id: "h2h", label: "H2H" },
    ];

    if (fixtureLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-6xl text-primary">
                    progress_activity
                </span>
            </div>
        );
    }

    if (!fixture) {
        return (
            <div className="py-12 text-center">
                <h1 className="mb-4 font-bold font-headline text-2xl">
                    Match Not Found
                </h1>
                <Link href="/">
                    <Button>Back to Home</Button>
                </Link>
            </div>
        );
    }

    const statusShort = fixture?.status?.short;
    const isLive = statusShort === "LIVE";
    const matchProgress = fixture?.status?.elapsed
        ? (fixture.status.elapsed / 90) * 100
        : 0;

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-low p-8 md:p-12">
                <div className="absolute top-0 right-0 p-4">
                    <div
                        className={cn(
                            "flex items-center gap-2 rounded-full border px-3 py-1",
                            isLive
                                ? "border-error/20 bg-error-container/20 text-error"
                                : "border-outline-variant/20 bg-surface-container-high text-on-surface-variant",
                        )}
                    >
                        {isLive && (
                            <span className="h-2 w-2 animate-pulse rounded-full bg-error" />
                        )}
                        <span className="font-bold font-label text-xs uppercase tracking-wider">
                            {isLive
                                ? `Live • ${fixture?.status?.elapsed}'`
                                : (fixture?.status?.long ?? "")}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-center space-y-4 md:items-end">
                        <img
                            src={fixture.teams.home.logo}
                            alt={fixture.teams.home.name}
                            className="h-24 w-24 object-contain md:h-32 md:w-32"
                        />
                        <div className="text-center md:text-right">
                            <h2 className="font-bold font-headline text-2xl tracking-tight md:text-4xl">
                                {fixture.teams.home.name}
                            </h2>
                            <p className="font-label text-on-surface-variant text-sm uppercase">
                                Home
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="flex items-center gap-6 font-black font-headline text-6xl tracking-tighter md:text-8xl">
                            <span className="text-on-surface">
                                {fixture.goals.home ?? 0}
                            </span>
                            <span className="text-4xl text-outline-variant/30 md:text-6xl">
                                :
                            </span>
                            <span className={cn("text-on-surface")}>
                                {fixture.goals.away ?? 0}
                            </span>
                        </div>
                        <div className="rounded bg-surface-container-highest px-4 py-1 font-label text-on-surface-variant text-xs uppercase tracking-widest">
                            {fixture.league.name}
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-4 md:items-start">
                        <img
                            src={fixture.teams.away.logo}
                            alt={fixture.teams.away.name}
                            className="h-24 w-24 object-contain md:h-32 md:w-32"
                        />
                        <div className="text-center md:text-left">
                            <h2 className="font-bold font-headline text-2xl tracking-tight md:text-4xl">
                                {fixture.teams.away.name}
                            </h2>
                            <p className="font-label text-on-surface-variant text-sm uppercase">
                                Away
                            </p>
                        </div>
                    </div>
                </div>

                {isLive && (
                    <div className="relative mt-12 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                        <div
                            className="absolute inset-y-0 left-0 bg-primary-dim transition-all duration-1000"
                            style={{ width: `${matchProgress}%` }}
                        />
                    </div>
                )}
            </section>

            <nav className="no-scrollbar flex gap-2 overflow-x-auto rounded-xl border border-outline-variant/5 bg-surface-container-low p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "min-w-[120px] flex-1 rounded-lg px-6 py-3 font-bold font-label text-sm uppercase tracking-widest transition-all",
                            activeTab === tab.id
                                ? "bg-primary/10 text-primary"
                                : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface",
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {activeTab === "stats" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-xl border border-outline-variant/10 bg-surface-container p-6">
                                <h3 className="mb-6 font-bold font-headline text-on-surface-variant text-sm uppercase tracking-widest">
                                    Possession %
                                </h3>
                                <div className="flex h-32 items-end justify-between gap-4">
                                    <div className="group relative h-[52%] flex-1 rounded-t-lg bg-primary/20">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold font-headline text-lg opacity-0 transition-opacity group-hover:opacity-100">
                                            52%
                                        </div>
                                    </div>
                                    <div className="group relative h-[48%] flex-1 rounded-t-lg bg-on-surface-variant/20">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold font-headline text-lg opacity-0 transition-opacity group-hover:opacity-100">
                                            48%
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-between font-label font-medium text-xs uppercase">
                                    <span>{fixture.teams.home.name}</span>
                                    <span>{fixture.teams.away.name}</span>
                                </div>
                            </div>

                            <div className="rounded-xl border border-outline-variant/10 bg-surface-container p-6">
                                <h3 className="mb-6 font-bold font-headline text-on-surface-variant text-sm uppercase tracking-widest">
                                    Expected Goals (xG)
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between font-label text-xs">
                                            <span>
                                                {fixture.teams.home.name}
                                            </span>
                                            <span className="text-primary">
                                                2.14
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
                                            <div className="h-full w-[75%] rounded-full bg-primary" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between font-label text-xs">
                                            <span>
                                                {fixture.teams.away.name}
                                            </span>
                                            <span>1.42</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
                                            <div className="h-full w-[55%] rounded-full bg-on-surface-variant" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container">
                            <div className="flex items-center justify-between border-outline-variant/10 border-b p-6">
                                <h3 className="font-bold font-headline text-sm uppercase tracking-widest">
                                    Match performance data
                                </h3>
                                <span className="material-symbols-outlined text-on-surface-variant text-sm">
                                    terminal
                                </span>
                            </div>
                            <div className="divide-y divide-outline-variant/5">
                                <div className="grid grid-cols-3 items-center p-4 transition-colors hover:bg-surface-container-highest">
                                    <div className="text-center font-bold font-headline text-xl">
                                        14
                                    </div>
                                    <div className="text-center font-label text-[10px] text-on-surface-variant uppercase tracking-tighter">
                                        Total Shots
                                    </div>
                                    <div className="text-center font-bold font-headline text-on-surface-variant text-xl">
                                        9
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 items-center p-4 transition-colors hover:bg-surface-container-highest">
                                    <div className="text-center font-bold font-headline text-primary text-xl">
                                        6
                                    </div>
                                    <div className="text-center font-label text-[10px] text-on-surface-variant uppercase tracking-tighter">
                                        Shots on Target
                                    </div>
                                    <div className="text-center font-bold font-headline text-on-surface-variant text-xl">
                                        3
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 items-center p-4 transition-colors hover:bg-surface-container-highest">
                                    <div className="text-center font-bold font-headline text-xl">
                                        88%
                                    </div>
                                    <div className="text-center font-label text-[10px] text-on-surface-variant uppercase tracking-tighter">
                                        Pass Accuracy
                                    </div>
                                    <div className="text-center font-bold font-headline text-xl">
                                        84%
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 items-center p-4 transition-colors hover:bg-surface-container-highest">
                                    <div className="text-center font-bold font-headline text-xl">
                                        4
                                    </div>
                                    <div className="text-center font-label text-[10px] text-on-surface-variant uppercase tracking-tighter">
                                        Corners
                                    </div>
                                    <div className="text-center font-bold font-headline text-xl">
                                        7
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-4">
                        <div className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container p-6">
                            <h3 className="mb-4 font-bold font-headline text-sm uppercase tracking-widest">
                                Heatmap Cluster
                            </h3>
                            <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-outline-variant/10 bg-[#00440a]/40">
                                <div className="absolute inset-4 rounded-sm border border-on-surface/10" />
                                <div className="absolute inset-x-4 top-1/2 h-[1px] -translate-y-1/2 bg-on-surface/10" />
                                <div className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-on-surface/10" />
                                <div className="absolute top-1/4 left-1/3 h-20 w-20 rounded-full bg-primary/30 blur-2xl" />
                                <div className="absolute right-1/4 bottom-1/3 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                            </div>
                            <p className="mt-4 text-center font-label text-[10px] text-on-surface-variant uppercase">
                                Active: Player Focus
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container">
                            <div className="flex items-center justify-between bg-surface-container-highest p-4">
                                <span className="font-bold font-headline text-xs uppercase tracking-widest">
                                    Key Events
                                </span>
                                {isLive && (
                                    <span className="font-label text-[10px] text-primary">
                                        LIVE
                                    </span>
                                )}
                            </div>
                            <div className="space-y-4 p-4">
                                {events && events.length > 0 ? (
                                    (events as FixtureEvents[])
                                        .slice(0, 5)
                                        .map((event, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-4"
                                            >
                                                <span className="w-8 shrink-0 font-bold font-headline text-primary">
                                                    {event.time.elapsed}
                                                </span>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={cn(
                                                                "material-symbols-outlined text-sm",
                                                                event.detail.includes(
                                                                    "Goal",
                                                                )
                                                                    ? "text-primary"
                                                                    : "text-error",
                                                            )}
                                                        >
                                                            {event.detail.includes(
                                                                "Goal",
                                                            )
                                                                ? "sports_soccer"
                                                                : "rectangle"}
                                                        </span>
                                                        <p className="font-body font-bold text-sm">
                                                            {event.detail}
                                                        </p>
                                                    </div>
                                                    <p className="text-on-surface-variant text-xs">
                                                        {event.player.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-center text-on-surface-variant text-sm">
                                        No events yet
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "lineups" && (
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container p-6">
                    {lineups && lineups.length > 0 ? (
                        (lineups as FixtureLineups[]).map((teamLineup) => (
                            <div
                                key={teamLineup.team.id}
                                className="mb-8 last:mb-0"
                            >
                                <h3 className="mb-4 font-bold font-headline text-lg">
                                    {teamLineup.team.name} -{" "}
                                    {teamLineup.formation}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                    {teamLineup.startXI.map((player, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg bg-surface-container-high p-4 text-center"
                                        >
                                            <p className="font-body font-bold text-sm">
                                                {player.player.name}
                                            </p>
                                            <p className="font-label text-[10px] text-on-surface-variant uppercase">
                                                {player.player.position}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-on-surface-variant">
                            Lineups not available yet
                        </p>
                    )}
                </div>
            )}

            {activeTab === "commentary" && (
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container p-6">
                    {events && events.length > 0 ? (
                        <div className="space-y-4">
                            {(events as FixtureEvents[]).map((event, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 rounded-lg bg-surface-container-high p-4"
                                >
                                    <span className="w-8 shrink-0 font-bold font-headline text-primary">
                                        {event.time.elapsed}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">
                                                {event.detail.includes("Goal")
                                                    ? "sports_soccer"
                                                    : event.detail.includes(
                                                            "Card",
                                                        )
                                                      ? "rectangle"
                                                      : "sports_soccer"}
                                            </span>
                                            <p className="font-body font-bold">
                                                {event.detail}
                                            </p>
                                        </div>
                                        <p className="text-on-surface-variant text-sm">
                                            {event.player.name}
                                            {event.assist &&
                                                ` (Assist: ${event.assist.name})`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-on-surface-variant">
                            No commentary available
                        </p>
                    )}
                </div>
            )}

            {activeTab === "h2h" && (
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container p-6">
                    <p className="text-center text-on-surface-variant">
                        Head to head data coming soon
                    </p>
                </div>
            )}
        </div>
    );
}
