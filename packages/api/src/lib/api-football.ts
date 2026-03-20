import { apiFootballConfig } from "./api-football-types";

export class ApiFootballError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public apiError?: { message: string; err: string },
    ) {
        super(message);
        this.name = "ApiFootballError";
    }
}

async function apiFootballFetch<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
): Promise<T> {
    const url = new URL(`${apiFootballConfig.baseUrl}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    console.log(url.toString());
    console.log(apiFootballConfig.headers);

    const response = await fetch(url.toString(), {
        headers: apiFootballConfig.headers,
    });

    if (!response.ok) {
        throw new ApiFootballError(
            `API request failed with status ${response.status}`,
            response.status,
        );
    }

    const json = (await response.json()) as {
        errors: Array<{ message: string; err: string }>;
        response: T;
    };

    if (json.errors?.[0]?.message) {
        throw new ApiFootballError(
            json.errors[0].message,
            response.status,
            json.errors[0],
        );
    }

    return json.response;
}

export const apiFootball = {
    fixtures: {
        byDate: (date: string) =>
            apiFootballFetch<unknown[]>("/fixtures", {
                date,
            }),

        byLeagueAndSeason: (league: number, season: number) =>
            apiFootballFetch<unknown[]>("/fixtures", {
                league,
                season,
            }),

        byId: (id: number) => apiFootballFetch<unknown[]>("/fixtures", { id }),

        byTeam: (team: number, last: number) =>
            apiFootballFetch<unknown[]>("/fixtures", {
                team,
                last,
            }),

        h2h: (home: number, away: number) =>
            apiFootballFetch<unknown[]>("/fixtures/headtohead", {
                h2h: `${home}-${away}`,
            }),

        live: () =>
            apiFootballFetch<unknown[]>("/fixtures", {
                live: "all",
            }),
    },

    leagues: {
        all: () => apiFootballFetch<unknown[]>("/leagues"),

        byId: (id: number) => apiFootballFetch<unknown[]>("/leagues", { id }),

        byCountry: (country: string) =>
            apiFootballFetch<unknown[]>("/leagues", { country }),

        byTeam: (team: number) =>
            apiFootballFetch<unknown[]>("/leagues", { team }),
    },

    standings: {
        byLeagueAndSeason: (league: number, season: number) =>
            apiFootballFetch<unknown[]>("/standings", {
                league,
                season,
            }),
    },

    teams: {
        byId: (id: number) => apiFootballFetch<unknown[]>("/teams", { id }),

        byLeague: (league: number, season: number) =>
            apiFootballFetch<unknown[]>("/teams", {
                league,
                season,
            }),

        search: (name: string) =>
            apiFootballFetch<unknown[]>("/teams", { search: name }),
    },

    players: {
        topScorers: (league: number, season: number) =>
            apiFootballFetch<unknown[]>("/players/topscorers", {
                league,
                season,
            }),

        topAssists: (league: number, season: number) =>
            apiFootballFetch<unknown[]>("/players/topassists", {
                league,
                season,
            }),

        squad: (team: number, season: number) =>
            apiFootballFetch<unknown[]>("/players/squads", {
                team,
                season,
            }),
    },

    statistics: {
        fixture: (fixture: number) =>
            apiFootballFetch<unknown[]>("/fixtures/statistics", { fixture }),

        team: (team: number, league: number, season: number) =>
            apiFootballFetch<unknown[]>("/teams/statistics", {
                team,
                league,
                season,
            }),
    },

    events: {
        fixture: (fixture: number) =>
            apiFootballFetch<unknown[]>("/fixtures/events", { fixture }),
    },

    lineups: {
        fixture: (fixture: number) =>
            apiFootballFetch<unknown[]>("/fixtures/lineups", { fixture }),
    },

    venues: {
        team: (team: number) =>
            apiFootballFetch<unknown[]>("/venues", { team }),
    },

    countries: {
        all: () => apiFootballFetch<unknown[]>("/countries"),
    },

    seasons: {
        all: () => apiFootballFetch<unknown[]>("/seasons"),
    },
};
