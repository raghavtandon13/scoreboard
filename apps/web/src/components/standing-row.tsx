"use client";

import { cn } from "@scoreboard/ui/lib/utils";
import Link from "next/link";

interface StandingRowProps {
    standing: {
        rank: number;
        team: {
            id: number;
            name: string;
            logo: string;
        };
        all: {
            played: number;
            win: number;
            draw: number;
            lose: number;
            goals: {
                for: number;
                against: number;
            };
        };
        points: number;
        goalsDiff: number;
        form: string;
    };
    showDetails?: boolean;
}

function FormIndicator({ form }: { form: string }) {
    return (
        <div className="flex justify-end gap-1.5 pr-2">
            {form.split("").map((result, index) => (
                <span
                    key={index}
                    className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        result === "W" && "bg-primary-dim",
                        result === "D" && "bg-outline",
                        result === "L" && "bg-error-dim",
                    )}
                />
            ))}
        </div>
    );
}

export default function StandingRow({
    standing,
    showDetails = true,
}: StandingRowProps) {
    const goalDifference = standing.goalsDiff;
    const isTopFour = standing.rank <= 4;
    const isRelegation = standing.rank >= 18;

    return (
        <Link href={`/team/${standing.team.id}`}>
            <div
                className={cn(
                    "grid grid-cols-[3rem_1fr_repeat(5,3rem)_7rem] items-center p-4 transition-colors hover:bg-surface-bright/20 md:grid-cols-[4rem_1fr_repeat(6,4rem)_10rem]",
                    isTopFour && "border-primary/20 border-b-2",
                )}
            >
                <div
                    className={cn(
                        "font-bold font-headline text-lg italic",
                        isRelegation ? "text-error" : "text-primary",
                    )}
                >
                    {String(standing.rank).padStart(2, "0")}
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest p-1">
                        <img
                            src={standing.team.logo}
                            alt={standing.team.name}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <span className="truncate font-body font-bold text-sm md:text-base">
                        {standing.team.name}
                    </span>
                </div>
                <div className="text-center font-label text-sm">
                    {standing.all?.played}
                </div>
                <div className="text-center font-label text-sm">
                    {standing.all?.win}
                </div>
                <div className="text-center font-label text-sm">
                    {standing.all?.draw}
                </div>
                <div className="text-center font-label text-sm">
                    {standing.all?.lose}
                </div>
                {showDetails && (
                    <div className="hidden text-center font-label text-sm md:block">
                        {goalDifference > 0 ? "+" : ""}
                        {goalDifference}
                    </div>
                )}
                <div className="text-center font-bold font-headline">
                    {standing.points}
                </div>
                {showDetails && <FormIndicator form={standing.form ?? ""} />}
            </div>
        </Link>
    );
}
