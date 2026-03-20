"use client";

import Link from "next/link";

interface UpcomingMatchRowProps {
    fixture: {
        id: number;
        date: string;
        league: {
            name: string;
        };
        teams: {
            home: {
                name: string;
                logo: string;
            };
            away: {
                name: string;
                logo: string;
            };
        };
    };
    odds?: {
        home: number;
        draw: number;
        away: number;
    };
}

export default function UpcomingMatchRow({
    fixture,
    odds,
}: UpcomingMatchRowProps) {
    const matchDate = new Date(fixture.date);
    const isToday = matchDate.toDateString() === new Date().toDateString();
    const isTomorrow =
        matchDate.toDateString() ===
        new Date(Date.now() + 86400000).toDateString();

    const timeDisplay = isToday
        ? matchDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : isTomorrow
          ? "TOM"
          : matchDate.toLocaleDateString([], { weekday: "short" });

    return (
        <Link href={`/match/${fixture.id}`}>
            <div className="grid cursor-pointer grid-cols-12 items-center gap-4 rounded-lg border border-outline-variant/5 bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high">
                <div className="col-span-2 md:col-span-1">
                    <span className="font-bold font-label text-primary text-xs">
                        {timeDisplay}
                    </span>
                </div>
                <div className="col-span-6 flex flex-col gap-1 md:col-span-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white/5">
                            <img
                                src={fixture.teams.home.logo}
                                alt={fixture.teams.home.name}
                                className="h-3 w-3 object-contain"
                            />
                        </div>
                        <span className="font-body font-medium text-sm">
                            {fixture.teams.home.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white/5">
                            <img
                                src={fixture.teams.away.logo}
                                alt={fixture.teams.away.name}
                                className="h-3 w-3 object-contain"
                            />
                        </div>
                        <span className="font-body font-medium text-sm">
                            {fixture.teams.away.name}
                        </span>
                    </div>
                </div>
                <div className="col-span-2 hidden items-center md:flex">
                    <span className="font-label text-[10px] text-on-surface-variant uppercase">
                        {fixture.league.name}
                    </span>
                </div>
                {odds && (
                    <div className="col-span-4 flex justify-end gap-2 md:col-span-5">
                        <div className="flex min-w-[50px] flex-col items-center justify-center rounded bg-surface-container-highest px-3 py-1.5">
                            <span className="mb-1 font-label text-[9px] text-on-surface-variant">
                                1
                            </span>
                            <span className="font-bold font-headline text-xs">
                                {odds.home.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex min-w-[50px] flex-col items-center justify-center rounded bg-surface-container-highest px-3 py-1.5">
                            <span className="mb-1 font-label text-[9px] text-on-surface-variant">
                                X
                            </span>
                            <span className="font-bold font-headline text-xs">
                                {odds.draw.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex min-w-[50px] flex-col items-center justify-center rounded bg-surface-container-highest px-3 py-1.5">
                            <span className="mb-1 font-label text-[9px] text-on-surface-variant">
                                2
                            </span>
                            <span className="font-bold font-headline text-xs">
                                {odds.away.toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
