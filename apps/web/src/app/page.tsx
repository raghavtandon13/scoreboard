"use client";

import { useQuery } from "@tanstack/react-query";
import LeagueChip from "@/components/league-chip";
import MatchCard from "@/components/match-card";
import UpcomingMatchRow from "@/components/upcoming-match-row";
import { trpc } from "@/utils/trpc";

export default function HomePage() {
    const { data: liveFixtures, isLoading: liveLoading } = useQuery(
        trpc.football.liveFixtures.queryOptions(),
    );

    const { data: popularLeagues } = useQuery(
        trpc.football.popularLeagues.queryOptions(),
    );

    const today = new Date().toISOString().split("T")[0];
    const { data: todayFixtures } = useQuery(
        trpc.football.fixturesByDate.queryOptions({ date: today }),
    );

    const selectedLeague = popularLeagues?.[0]?.id;
    const { data: leagueFixtures } = useQuery(
        trpc.football.fixturesByLeague.queryOptions(
            { league: selectedLeague ?? 39 },
            { enabled: !!selectedLeague },
        ),
    );

    const liveMatches = (liveFixtures ?? []).filter(
        (f) =>
            f?.status?.short === "LIVE" ||
            f?.status?.short === "1H" ||
            f?.status?.short === "2H",
    );

    const upcomingMatches = (todayFixtures ?? []).filter(
        (f) => f?.status?.short === "NS" || f?.status?.short === "PST",
    );

    return (
        <div className="space-y-10">
            <section className="mb-10">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-bold font-headline text-on-surface-variant text-xs uppercase tracking-widest">
                        Active Circuits
                    </h2>
                    <button
                        type="button"
                        className="flex items-center gap-1 font-label text-primary text-xs uppercase"
                    >
                        Filter
                        <span className="material-symbols-outlined text-sm">
                            tune
                        </span>
                    </button>
                </div>
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
                    <LeagueChip name="All Events" isActive={!selectedLeague} />
                    {popularLeagues?.map((league) => (
                        <LeagueChip
                            key={league.id}
                            name={league.name}
                            isActive={selectedLeague === league.id}
                        />
                    ))}
                </div>
            </section>

            <section className="mb-12">
                <div className="mb-6 flex items-center gap-3">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-error" />
                    <h2 className="font-bold font-headline text-2xl tracking-tight">
                        LIVE TERMINAL
                    </h2>
                </div>
                {liveLoading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-[200px] animate-pulse rounded-xl border-primary border-l-4 bg-surface-container-highest p-5"
                            />
                        ))}
                    </div>
                ) : liveMatches.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {liveMatches.slice(0, 6).map((fixture) => (
                            <MatchCard
                                key={fixture.id}
                                fixture={fixture}
                                showStats
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl bg-surface-container-highest p-8 text-center">
                        <span className="material-symbols-outlined mb-2 text-4xl text-on-surface-variant">
                            sports_soccer
                        </span>
                        <p className="font-label text-on-surface-variant text-sm uppercase tracking-widest">
                            No Live Matches Currently
                        </p>
                        <p className="mt-2 text-on-surface-variant text-xs">
                            Check back later for live action
                        </p>
                    </div>
                )}
            </section>

            <section>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-bold font-headline text-2xl tracking-tight">
                        UPCOMING NODES
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="font-bold font-label text-[10px] text-on-surface-variant uppercase">
                            Timezone: UTC+0
                        </span>
                    </div>
                </div>
                {upcomingMatches.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingMatches.slice(0, 10).map((fixture) => (
                            <UpcomingMatchRow
                                key={fixture.id}
                                fixture={{
                                    id: fixture.id,
                                    date: fixture.date,
                                    league: { name: fixture.league.name },
                                    teams: fixture.teams,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg bg-surface-container-low p-6 text-center">
                        <p className="font-label text-on-surface-variant text-sm uppercase tracking-widest">
                            No Upcoming Matches Today
                        </p>
                    </div>
                )}
            </section>

            <button
                type="button"
                className="fixed right-6 bottom-24 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl transition-transform active:scale-90 md:bottom-10"
            >
                <span className="material-symbols-outlined">refresh</span>
            </button>
        </div>
    );
}
