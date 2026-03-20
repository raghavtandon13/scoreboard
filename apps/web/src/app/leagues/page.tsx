"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LeagueChip from "@/components/league-chip";
import StandingRow from "@/components/standing-row";
import { trpc } from "@/utils/trpc";

export default function LeaguesPage() {
    const [selectedLeague, setSelectedLeague] = useState(39);
    const currentSeason = 2024;

    const { data: standings, isLoading } = useQuery(
        trpc.football.standings.queryOptions({
            league: selectedLeague,
            season: currentSeason,
        }),
    );

    const { data: topScorers } = useQuery(
        trpc.football.topScorers.queryOptions({
            league: selectedLeague,
            season: currentSeason,
        }),
    );

    const { data: popularLeagues } = useQuery(
        trpc.football.popularLeagues.queryOptions(),
    );

    const leagues = [
        { id: 39, name: "Premier League" },
        { id: 140, name: "La Liga" },
        { id: 78, name: "Bundesliga" },
        { id: 135, name: "Serie A" },
        { id: 61, name: "Ligue 1" },
        { id: 2, name: "Champions League" },
    ];

    return (
        <div className="space-y-8">
            <section className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-bold font-headline text-2xl tracking-tight">
                        Leagues
                    </h2>
                    <button
                        type="button"
                        className="flex items-center gap-1 font-label text-primary text-xs uppercase tracking-widest"
                    >
                        Season {currentSeason}/{currentSeason + 1}
                        <span className="material-symbols-outlined text-sm">
                            expand_more
                        </span>
                    </button>
                </div>
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
                    {leagues.map((league) => (
                        <LeagueChip
                            key={league.id}
                            name={league.name}
                            isActive={selectedLeague === league.id}
                            onClick={() => setSelectedLeague(league.id)}
                        />
                    ))}
                </div>
            </section>

            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="relative max-w-md flex-1">
                    <span className="material-symbols-outlined absolute top-1/2 left-4 -translate-y-1/2 text-lg text-on-surface-variant">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Filter teams..."
                        className="w-full rounded-xl border-none bg-surface-container-low py-3 pr-4 pl-12 font-body text-sm placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary/40"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-xl bg-surface-container-highest p-3 font-label text-on-surface-variant text-sm hover:text-on-surface"
                    >
                        <span className="material-symbols-outlined text-lg">
                            filter_list
                        </span>
                        Advanced
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-xl bg-surface-container-highest p-3 font-label text-on-surface-variant text-sm hover:text-on-surface"
                    >
                        <span className="material-symbols-outlined text-lg">
                            download
                        </span>
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-surface-container-low shadow-2xl">
                <div className="grid grid-cols-[3rem_1fr_repeat(5,3rem)_7rem] items-center border-outline-variant/10 border-b bg-surface-container-high p-4 md:grid-cols-[4rem_1fr_repeat(6,4rem)_10rem]">
                    <div className="font-bold font-label text-[10px] text-on-surface-variant uppercase">
                        Pos
                    </div>
                    <div className="font-bold font-label text-[10px] text-on-surface-variant uppercase">
                        Club
                    </div>
                    <div className="text-center font-bold font-label text-[10px] text-on-surface-variant uppercase">
                        P
                    </div>
                    <div className="text-center font-bold font-label text-[10px] text-on-surface-variant uppercase">
                        W
                    </div>
                    <div className="text-center font-bold font-label text-[10px] text-on-surface-variant uppercase">
                        D
                    </div>
                    <div className="text-center font-bold font-label text-[10px] text-on-surface-variant uppercase">
                        L
                    </div>
                    <div className="hidden text-center font-bold font-label text-[10px] text-on-surface-variant uppercase md:block">
                        GD
                    </div>
                    <div className="text-center font-bold font-label text-[10px] text-on-surface-variant uppercase">
                        Pts
                    </div>
                    <div className="pr-2 text-right font-bold font-label text-[10px] text-on-surface-variant uppercase">
                        Form
                    </div>
                </div>

                <div className="divide-y divide-outline-variant/5">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary">
                                progress_activity
                            </span>
                        </div>
                    ) : standings && standings.length > 0 ? (
                        standings.map((standing) => (
                            <StandingRow
                                key={standing.team.id}
                                standing={standing}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <p className="font-label text-on-surface-variant text-sm uppercase tracking-widest">
                                No standings available
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-4 border-outline-variant/10 border-t bg-surface-container p-4">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-primary/40" />
                        <span className="font-label text-[10px] text-on-surface-variant uppercase">
                            Champions League
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-secondary-container" />
                        <span className="font-label text-[10px] text-on-surface-variant uppercase">
                            Europa League
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-error-container/40" />
                        <span className="font-label text-[10px] text-on-surface-variant uppercase">
                            Relegation
                        </span>
                    </div>
                </div>
            </div>

            <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="group relative overflow-hidden rounded-2xl bg-surface-container-high p-6 md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transition-opacity group-hover:opacity-20">
                        <span className="material-symbols-outlined text-9xl">
                            insights
                        </span>
                    </div>
                    <h3 className="mb-4 font-bold font-headline text-xl">
                        Stat Leaders
                    </h3>
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                        <div>
                            <p className="mb-1 font-label text-[10px] text-on-surface-variant uppercase">
                                Top Scorer
                            </p>
                            {topScorers?.[0] ? (
                                <>
                                    <p className="font-body font-bold">
                                        {topScorers[0].player.name}
                                    </p>
                                    <p className="font-black font-headline text-2xl text-primary">
                                        {topScorers[0].statistics[0]?.goals
                                            .total ?? 0}
                                        <span className="font-medium text-on-surface-variant text-xs">
                                            Goals
                                        </span>
                                    </p>
                                </>
                            ) : (
                                <p className="font-body text-on-surface-variant">
                                    Loading...
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="mb-1 font-label text-[10px] text-on-surface-variant uppercase">
                                Most Assists
                            </p>
                            <p className="font-body font-bold text-on-surface-variant">
                                Loading...
                            </p>
                            <p className="font-black font-headline text-2xl text-primary">
                                --
                                <span className="font-medium text-on-surface-variant text-xs">
                                    Ast
                                </span>
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <p className="mb-1 font-label text-[10px] text-on-surface-variant uppercase">
                                Clean Sheets
                            </p>
                            <p className="font-body font-bold text-on-surface-variant">
                                Loading...
                            </p>
                            <p className="font-black font-headline text-2xl text-primary">
                                --
                                <span className="font-medium text-on-surface-variant text-xs">
                                    CS
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between rounded-2xl border border-primary/10 bg-primary/5 p-6">
                    <div>
                        <h3 className="mb-2 font-bold font-headline text-xl">
                            Next Matchday
                        </h3>
                        <p className="mb-4 text-on-surface-variant text-sm">
                            Matchday {currentSeason} is underway.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold font-label text-on-primary text-xs uppercase tracking-widest transition-opacity hover:opacity-90"
                    >
                        View Schedule
                        <span className="material-symbols-outlined text-sm">
                            arrow_forward
                        </span>
                    </button>
                </div>
            </section>
        </div>
    );
}
