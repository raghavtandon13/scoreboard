"use client";

import { cn } from "@scoreboard/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use } from "react";

import { trpc } from "@/utils/trpc";

export default function TeamPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const teamId = Number.parseInt(id, 10);
    const currentSeason = 2024;

    const { data: team, isLoading: teamLoading } = useQuery(
        trpc.football.teamById.queryOptions({ id: teamId }),
    );

    const { data: fixtures } = useQuery(
        trpc.football.fixturesByTeam.queryOptions({ team: teamId, last: 10 }),
    );

    const { data: squad } = useQuery(
        trpc.football.teamSquad.queryOptions({
            team: teamId,
            season: currentSeason,
        }),
    );

    const { data: topScorers } = useQuery(
        trpc.football.topScorers.queryOptions({
            league: 39,
            season: currentSeason,
        }),
    );

    if (teamLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-6xl text-primary">
                    progress_activity
                </span>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="py-12 text-center">
                <h1 className="mb-4 font-bold font-headline text-2xl">
                    Team Not Found
                </h1>
                <Link
                    href="/"
                    className="rounded-lg bg-primary px-4 py-2 font-label text-on-primary"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    const recentForm = ["W", "W", "D", "W", "L"];

    return (
        <div className="space-y-10">
            <section className="relative mt-6 flex h-[397px] flex-col justify-end overflow-hidden rounded-xl p-8 md:h-[486px] md:p-12">
                <div className="absolute inset-0 z-0">
                    <div className="h-full w-full bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>
                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-xl border border-outline-variant/20 bg-surface-container-low/80 p-2 backdrop-blur-md md:h-32 md:w-32">
                            <img
                                src={team.team.logo}
                                alt={team.team.name}
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="font-bold font-headline text-4xl leading-none tracking-tighter md:text-7xl">
                                {team.team.name}
                            </h1>
                            <p className="mt-2 flex items-center gap-2 font-label text-primary">
                                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
                                {team.leagues[0]?.league.name ?? "Football"}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="rounded-lg border border-outline-variant/20 bg-surface-container-high/60 px-4 py-2 backdrop-blur-sm">
                            <p className="font-label text-[10px] text-on-surface-variant uppercase">
                                Founded
                            </p>
                            <p className="font-bold font-headline text-lg">
                                {team.team.founded ?? "N/A"}
                            </p>
                        </div>
                        <div className="rounded-lg border border-outline-variant/20 bg-surface-container-high/60 px-4 py-2 backdrop-blur-sm">
                            <p className="font-label text-[10px] text-on-surface-variant uppercase">
                                Venue
                            </p>
                            <p className="font-bold font-headline text-lg">
                                {team.venue?.name ?? "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                    <div className="relative overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-low shadow-2xl">
                        <div className="bg-gradient-to-r from-primary/20 via-transparent to-transparent p-1" />
                        <div className="flex flex-col items-center justify-between gap-8 p-6 md:flex-row md:p-8">
                            <div className="flex flex-col items-center text-center md:items-start md:text-left">
                                <span className="mb-4 font-label text-[10px] text-primary uppercase tracking-[0.2em]">
                                    Recent Form
                                </span>
                                <div className="flex gap-4">
                                    {recentForm.map((result, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-lg font-bold font-headline text-sm",
                                                result === "W"
                                                    ? "bg-primary/20 text-primary"
                                                    : result === "D"
                                                      ? "bg-surface-variant text-on-surface-variant"
                                                      : "bg-error/20 text-error",
                                            )}
                                        >
                                            {result}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-px w-full bg-outline-variant/20 md:h-20 md:w-px" />
                            <div className="flex flex-col items-center">
                                <span className="mb-2 font-label text-[10px] text-on-surface-variant uppercase">
                                    Last Result
                                </span>
                                <p className="font-bold font-headline text-2xl">
                                    {fixtures?.[0]?.teams.home.name ===
                                    team.team.name
                                        ? `${fixtures[0].goals.home} - ${fixtures[0].goals.away}`
                                        : `${fixtures?.[0]?.goals.away ?? 0} - ${fixtures?.[0]?.goals.home ?? 0}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-6">
                        <h3 className="mb-6 flex items-center gap-2 font-bold font-headline text-on-surface-variant text-xs uppercase tracking-widest">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Squad Inventory_
                        </h3>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                            {squad?.players?.slice(0, 6).map((player) => (
                                <div
                                    key={player.id}
                                    className="group rounded-lg bg-surface-container-high p-4 transition-colors hover:bg-surface-bright"
                                >
                                    <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded bg-surface-container-highest">
                                        <img
                                            src={player.photo}
                                            alt={player.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-2 left-2 bg-primary px-2 py-1 font-black font-headline text-on-primary text-xs">
                                            {player.number ?? "-"}
                                        </div>
                                    </div>
                                    <h4 className="font-bold font-headline text-sm uppercase">
                                        {player.name.split(" ").pop()}
                                    </h4>
                                    <div className="mt-1 flex justify-between">
                                        <span className="font-label text-[10px] text-on-surface-variant uppercase">
                                            {player.position}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6 lg:col-span-4">
                    <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-6">
                        <h3 className="mb-6 flex items-center gap-2 font-bold font-headline text-on-surface-variant text-xs uppercase tracking-widest">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Competition Stats_
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-outline-variant/10 bg-surface-container-highest p-4">
                                <span className="font-label text-[9px] text-on-surface-variant uppercase">
                                    League Pos.
                                </span>
                                <div className="mt-1 font-bold font-headline text-4xl text-primary">
                                    --
                                </div>
                            </div>
                            <div className="rounded-xl border border-outline-variant/10 bg-surface-container-highest p-4">
                                <span className="font-label text-[9px] text-on-surface-variant uppercase">
                                    Win Rate
                                </span>
                                <div className="mt-1 font-bold font-headline text-4xl text-on-surface">
                                    --
                                </div>
                            </div>
                            <div className="rounded-xl border border-outline-variant/10 bg-surface-container-highest p-4">
                                <span className="font-label text-[9px] text-on-surface-variant uppercase">
                                    Clean Sheets
                                </span>
                                <div className="mt-1 font-bold font-headline text-4xl text-on-surface">
                                    --
                                </div>
                            </div>
                            <div className="rounded-xl border border-outline-variant/10 bg-surface-container-highest p-4">
                                <span className="font-label text-[9px] text-on-surface-variant uppercase">
                                    Top Scorer
                                </span>
                                <div className="mt-1 font-bold font-headline text-on-surface text-xl uppercase">
                                    --
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-6">
                        <h3 className="mb-6 flex items-center gap-2 font-bold font-headline text-on-surface-variant text-xs uppercase tracking-widest">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Recent Matches_
                        </h3>
                        <div className="space-y-3">
                            {fixtures?.slice(0, 5).map((fixture) => (
                                <Link
                                    key={fixture.id}
                                    href={`/match/${fixture.id}`}
                                    className="flex items-center justify-between rounded-lg bg-surface-container-high p-3 transition-colors hover:bg-surface-bright"
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={
                                                fixture.teams.home.id === teamId
                                                    ? fixture.teams.away.logo
                                                    : fixture.teams.home.logo
                                            }
                                            alt=""
                                            className="h-6 w-6"
                                        />
                                        <span className="font-body text-sm">
                                            {fixture.teams.home.id === teamId
                                                ? fixture.teams.away.name
                                                : fixture.teams.home.name}
                                        </span>
                                    </div>
                                    <span className="font-bold font-headline text-sm">
                                        {fixture.teams.home.id === teamId
                                            ? `${fixture.goals.home} - ${fixture.goals.away}`
                                            : `${fixture.goals.away} - ${fixture.goals.home}`}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
