import { env } from "@scoreboard/env/server";

export const apiFootballConfig = {
    baseUrl: "https://v3.football.api-sports.io",
    headers: {
        "x-apisports-key": env.API_FOOTBALL_KEY,
    },
};

export const LEAGUE_IDS = {
    premierLeague: 39,
    laLiga: 140,
    bundesliga: 78,
    serieA: 135,
    ligue1: 61,
    championsLeague: 2,
    europaLeague: 3,
} as const;

export type LeagueId = (typeof LEAGUE_IDS)[keyof typeof LEAGUE_IDS];

export interface ApiFootballResponse<T> {
    get: string;
    parameters: Record<string, string>;
    errors: Array<{ message: string; err: string }>;
    results: number;
    response: T;
}

export interface Team {
    id: number;
    name: string;
    code: string;
    country: string;
    founded: number;
    logo: string;
    national: boolean;
    venue: {
        id: number;
        name: string;
        address: string;
        city: string;
        capacity: number;
        surface: string;
        image: string;
    };
}

export interface League {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
}

export interface Goals {
    home: number | null;
    away: number | null;
}

export interface Fixture {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
        first: number | null;
        second: number | null;
    };
    venue: {
        id: number;
        name: string;
        city: string;
    };
    status: {
        long: string;
        short: string;
        elapsed: number | null;
    };
}

export interface TeamStats {
    id: number;
    name: string;
    logo: string;
}

export interface LeagueStanding {
    league: League;
    team: TeamStats;
    form: string;
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
        for: number;
        against: number;
    };
    points: number;
    rank: number;
}

export interface Player {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    nationality: string;
    height: string;
    weight: string;
    photo: string;
    number: number | null;
    position: string;
    injured: boolean;
}

export interface TopScorer {
    player: Player;
    statistics: Array<{
        team: TeamStats;
        league: League;
        games: {
            appearences: number;
            lineups: number;
            minutes: number;
        };
        goals: {
            total: number;
            conceded: number;
            assists: number;
        };
        shots: {
            total: number;
            on: number;
        };
        passes: {
            total: number;
            key: number;
            accuracy: number;
        };
        tackles: {
            total: number;
            blocks: number;
            interceptions: number;
        };
        duels: {
            total: number;
            won: number;
        };
        dribbles: {
            attempts: number;
            success: number;
        };
        fouls: {
            drawn: number;
            committed: number;
        };
        cards: {
            yellow: number;
            yellowred: number;
            red: number;
        };
        penalty: {
            won: number;
            commited: number;
            success: number;
            missed: number;
            saved: number;
        };
    }>;
}

export interface FixtureWithTeams extends Fixture {
    league: League;
    teams: {
        home: TeamStats;
        away: TeamStats;
    };
    goals: Goals;
    score: {
        halftime: Goals;
        fulltime: Goals;
        extratime: Goals;
        penalty: Goals;
    };
}

export interface FixtureEvents {
    time: {
        elapsed: number;
        extra: string | null;
    };
    team: TeamStats;
    player: {
        id: number;
        name: string;
    };
    assist: {
        id: number;
        name: string;
    } | null;
    type: string;
    detail: string;
    comments: string | null;
}

export interface FixtureStats {
    type: string;
    value: string | number;
}

export interface LineupPlayer {
    player: Player;
    grid: string | null;
}

export interface FixtureLineups {
    team: TeamStats;
    formation: string;
    startXI: LineupPlayer[];
    substitutes: LineupPlayer[];
}
