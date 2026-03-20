import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../index";
import { ApiFootballError, apiFootball } from "../lib/api-football";
import type {
    FixtureWithTeams,
    LeagueStanding,
    TopScorer,
} from "../lib/api-football-types";
import { LEAGUE_IDS } from "../lib/api-football-types";
import { CACHE_TTL, getCachedData, setCachedData } from "../lib/cache";

const currentSeason = 2024;

function handleApiError(error: unknown): never {
    if (error instanceof ApiFootballError) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
            cause: error.apiError,
        });
    }
    throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
        cause: error,
    });
}

async function cachedFetch<T>(
    endpoint: string,
    params: Record<string, string | number | undefined> | undefined,
    _ttlSeconds: number,
    fetchFn: () => Promise<T>,
): Promise<T> {
    const cached = getCachedData<T>(endpoint, params);
    if (cached !== null) {
        return cached;
    }

    const data = await fetchFn();
    setCachedData(endpoint, params, data);
    return data;
}

export const footballRouter = router({
    leagues: publicProcedure.query(async () => {
        try {
            return await cachedFetch(
                "/leagues",
                undefined,
                CACHE_TTL.leagues,
                () => apiFootball.leagues.all(),
            );
        } catch (error) {
            handleApiError(error);
        }
    }),

    leaguesByCountry: publicProcedure
        .input(z.object({ country: z.string() }))
        .query(async ({ input }) => {
            try {
                return await cachedFetch(
                    "/leagues",
                    { country: input.country },
                    CACHE_TTL.leagues,
                    () => apiFootball.leagues.byCountry(input.country),
                );
            } catch (error) {
                handleApiError(error);
            }
        }),

    liveFixtures: publicProcedure.query(async () => {
        try {
            return (await cachedFetch(
                "/fixtures",
                { live: "all" },
                CACHE_TTL.live,
                () => apiFootball.fixtures.live(),
            )) as FixtureWithTeams[];
        } catch (error) {
            handleApiError(error);
        }
    }),

    fixturesByDate: publicProcedure
        .input(z.object({ date: z.string() }))
        .query(async ({ input }) => {
            try {
                return (await cachedFetch(
                    "/fixtures",
                    { date: input.date },
                    CACHE_TTL.fixtures,
                    () => apiFootball.fixtures.byDate(input.date),
                )) as FixtureWithTeams[];
            } catch (error) {
                handleApiError(error);
            }
        }),

    fixturesByLeague: publicProcedure
        .input(
            z.object({
                league: z.number(),
                season: z.number().optional().default(currentSeason),
            }),
        )
        .query(async ({ input }) => {
            try {
                const season = input.season ?? currentSeason;
                return (await cachedFetch(
                    "/fixtures",
                    { league: input.league, season },
                    CACHE_TTL.fixtures,
                    () =>
                        apiFootball.fixtures.byLeagueAndSeason(
                            input.league,
                            season,
                        ),
                )) as FixtureWithTeams[];
            } catch (error) {
                handleApiError(error);
            }
        }),

    fixtureById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            try {
                const response = await cachedFetch(
                    "/fixtures",
                    { id: input.id },
                    CACHE_TTL.fixtures,
                    () => apiFootball.fixtures.byId(input.id),
                );
                return (response as FixtureWithTeams[])[0];
            } catch (error) {
                handleApiError(error);
            }
        }),

    fixturesByTeam: publicProcedure
        .input(
            z.object({
                team: z.number(),
                last: z.number().default(10),
            }),
        )
        .query(async ({ input }) => {
            try {
                return (await cachedFetch(
                    "/fixtures",
                    { team: input.team, last: input.last },
                    CACHE_TTL.fixtures,
                    () => apiFootball.fixtures.byTeam(input.team, input.last),
                )) as FixtureWithTeams[];
            } catch (error) {
                handleApiError(error);
            }
        }),

    h2h: publicProcedure
        .input(
            z.object({
                home: z.number(),
                away: z.number(),
            }),
        )
        .query(async ({ input }) => {
            try {
                return (await cachedFetch(
                    "/fixtures/headtohead",
                    { h2h: `${input.home}-${input.away}` },
                    CACHE_TTL.fixtures,
                    () => apiFootball.fixtures.h2h(input.home, input.away),
                )) as FixtureWithTeams[];
            } catch (error) {
                handleApiError(error);
            }
        }),

    standings: publicProcedure
        .input(
            z.object({
                league: z.number(),
                season: z.number().optional().default(currentSeason),
            }),
        )
        .query(async ({ input }) => {
            try {
                let season = input.season ?? currentSeason;
                console.log(season);
                season = 2024;
                const response = await cachedFetch(
                    "/standings",
                    { league: input.league, season },
                    CACHE_TTL.standings,
                    () =>
                        apiFootball.standings.byLeagueAndSeason(
                            input.league,
                            season,
                        ),
                );
                const apiResponse = (response as unknown[])[0] as {
                    league: {
                        id: number;
                        standings: LeagueStanding[][];
                    };
                };
                console.log(JSON.stringify(apiResponse));
                return apiResponse?.league?.standings?.[0] ?? [];
            } catch (error) {
                handleApiError(error);
            }
        }),

    topScorers: publicProcedure
        .input(
            z.object({
                league: z.number(),
                season: z.number().optional().default(currentSeason),
            }),
        )
        .query(async ({ input }) => {
            try {
                const season = input.season ?? currentSeason;
                return (await cachedFetch(
                    "/players/topscorers",
                    { league: input.league, season },
                    CACHE_TTL.players,
                    () => apiFootball.players.topScorers(input.league, season),
                )) as TopScorer[];
            } catch (error) {
                handleApiError(error);
            }
        }),

    topAssists: publicProcedure
        .input(
            z.object({
                league: z.number(),
                season: z.number().optional().default(currentSeason),
            }),
        )
        .query(async ({ input }) => {
            try {
                const season = input.season ?? currentSeason;
                return await cachedFetch(
                    "/players/topassists",
                    { league: input.league, season },
                    CACHE_TTL.players,
                    () => apiFootball.players.topAssists(input.league, season),
                );
            } catch (error) {
                handleApiError(error);
            }
        }),

    teamById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            try {
                const response = await cachedFetch(
                    "/teams",
                    { id: input.id },
                    CACHE_TTL.teams,
                    () => apiFootball.teams.byId(input.id),
                );
                return (response as unknown[])[0];
            } catch (error) {
                handleApiError(error);
            }
        }),

    teamsByLeague: publicProcedure
        .input(
            z.object({
                league: z.number(),
                season: z.number().optional().default(currentSeason),
            }),
        )
        .query(async ({ input }) => {
            try {
                const season = input.season ?? currentSeason;
                return await cachedFetch(
                    "/teams",
                    { league: input.league, season },
                    CACHE_TTL.teams,
                    () => apiFootball.teams.byLeague(input.league, season),
                );
            } catch (error) {
                handleApiError(error);
            }
        }),

    teamSquad: publicProcedure
        .input(
            z.object({
                team: z.number(),
                season: z.number().optional().default(currentSeason),
            }),
        )
        .query(async ({ input }) => {
            try {
                const season = input.season ?? currentSeason;
                const response = await cachedFetch(
                    "/players/squads",
                    { team: input.team, season },
                    CACHE_TTL.players,
                    () => apiFootball.players.squad(input.team, season),
                );
                return (response as unknown[])[0];
            } catch (error) {
                handleApiError(error);
            }
        }),

    teamStatistics: publicProcedure
        .input(
            z.object({
                team: z.number(),
                league: z.number(),
                season: z.number().optional().default(currentSeason),
            }),
        )
        .query(async ({ input }) => {
            try {
                const season = input.season ?? currentSeason;
                return await cachedFetch(
                    "/teams/statistics",
                    { team: input.team, league: input.league, season },
                    CACHE_TTL.statistics,
                    () =>
                        apiFootball.statistics.team(
                            input.team,
                            input.league,
                            season,
                        ),
                );
            } catch (error) {
                handleApiError(error);
            }
        }),

    fixtureStatistics: publicProcedure
        .input(z.object({ fixture: z.number() }))
        .query(async ({ input }) => {
            try {
                return await cachedFetch(
                    "/fixtures/statistics",
                    { fixture: input.fixture },
                    CACHE_TTL.statistics,
                    () => apiFootball.statistics.fixture(input.fixture),
                );
            } catch (error) {
                handleApiError(error);
            }
        }),

    fixtureEvents: publicProcedure
        .input(z.object({ fixture: z.number() }))
        .query(async ({ input }) => {
            try {
                return await cachedFetch(
                    "/fixtures/events",
                    { fixture: input.fixture },
                    CACHE_TTL.events,
                    () => apiFootball.events.fixture(input.fixture),
                );
            } catch (error) {
                handleApiError(error);
            }
        }),

    fixtureLineups: publicProcedure
        .input(z.object({ fixture: z.number() }))
        .query(async ({ input }) => {
            try {
                return await cachedFetch(
                    "/fixtures/lineups",
                    { fixture: input.fixture },
                    CACHE_TTL.lineups,
                    () => apiFootball.lineups.fixture(input.fixture),
                );
            } catch (error) {
                handleApiError(error);
            }
        }),

    popularLeagues: publicProcedure.query(() => {
        return [
            { id: LEAGUE_IDS.premierLeague, name: "Premier League" },
            { id: LEAGUE_IDS.laLiga, name: "La Liga" },
            { id: LEAGUE_IDS.bundesliga, name: "Bundesliga" },
            { id: LEAGUE_IDS.serieA, name: "Serie A" },
            { id: LEAGUE_IDS.ligue1, name: "Ligue 1" },
            { id: LEAGUE_IDS.championsLeague, name: "Champions League" },
        ];
    }),
});
