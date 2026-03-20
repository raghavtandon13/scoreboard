"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { trpc } from "@/utils/trpc";

const _popularTeams = [
    { id: 33, name: "Manchester United" },
    { id: 34, name: "Newcastle United" },
    { id: 39, name: "Wolves" },
    { id: 40, name: "West Ham United" },
    { id: 41, name: "Tottenham Hotspur" },
    { id: 42, name: "Arsenal" },
    { id: 44, name: "Burnley" },
    { id: 45, name: "Manchester City" },
    { id: 47, name: "Tottenham" },
    { id: 48, name: "Brighton" },
];

export default function TeamsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: teams, isLoading } = useQuery(
        trpc.football.teamsByLeague.queryOptions({ league: 39 }),
    );

    const filteredTeams = teams?.filter((team: { name: string }) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-8">
            <section className="mb-8">
                <h2 className="mb-6 font-bold font-headline text-2xl tracking-tight">
                    Teams
                </h2>
                <div className="relative mb-6 max-w-md">
                    <span className="material-symbols-outlined absolute top-1/2 left-4 -translate-y-1/2 text-lg text-on-surface-variant">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search teams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border-none bg-surface-container-low py-3 pr-4 pl-12 font-body text-sm placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary/40"
                    />
                </div>
            </section>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-[140px] animate-pulse rounded-xl bg-surface-container-high p-6"
                        />
                    ))
                ) : filteredTeams && filteredTeams.length > 0 ? (
                    filteredTeams.map(
                        (team: { id: number; name: string; logo: string }) => (
                            <Link
                                key={team.id}
                                href={`/team/${team.id}`}
                                className="group rounded-xl bg-surface-container-high p-6 transition-colors hover:bg-surface-container-highest"
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-surface-container-low p-2">
                                        <img
                                            src={team.logo}
                                            alt={team.name}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <span className="text-center font-body font-medium text-sm transition-colors group-hover:text-primary">
                                        {team.name}
                                    </span>
                                </div>
                            </Link>
                        ),
                    )
                ) : (
                    <div className="col-span-full py-12 text-center">
                        <p className="font-label text-on-surface-variant text-sm uppercase tracking-widest">
                            No teams found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
