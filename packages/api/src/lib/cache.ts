import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CACHE_DIR = join(process.cwd(), ".cache");

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

function ensureCacheDir(): void {
    if (!existsSync(CACHE_DIR)) {
        mkdirSync(CACHE_DIR, { recursive: true });
    }
}

function hashKey(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
): string {
    const paramStr = params
        ? Object.entries(params)
              .filter(([, v]) => v !== undefined)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([k, v]) => `${k}=${v}`)
              .join("&")
        : "";
    return createHash("sha256")
        .update(`${endpoint}?${paramStr}`)
        .digest("hex")
        .slice(0, 32);
}

export function getCachedData<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
): T | null {
    const key = hashKey(endpoint, params);
    const cachePath = join(CACHE_DIR, `${key}.json`);

    if (!existsSync(cachePath)) {
        return null;
    }

    try {
        const content = readFileSync(cachePath, "utf-8");
        const entry: CacheEntry<T> = JSON.parse(content);
        return entry.data;
    } catch {
        return null;
    }
}

export function setCachedData<T>(
    endpoint: string,
    params: Record<string, string | number | undefined> | undefined,
    data: T,
): void {
    ensureCacheDir();
    const key = hashKey(endpoint, params);
    const cachePath = join(CACHE_DIR, `${key}.json`);

    const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
    };

    try {
        writeFileSync(cachePath, JSON.stringify(entry), "utf-8");
    } catch (error) {
        console.error(`Cache write failed for ${key}:`, error);
    }
}

export function isCacheValid(
    endpoint: string,
    params: Record<string, string | number | undefined> | undefined,
    ttlSeconds: number,
): boolean {
    const key = hashKey(endpoint, params);
    const cachePath = join(CACHE_DIR, `${key}.json`);

    if (!existsSync(cachePath)) {
        return false;
    }

    try {
        const content = readFileSync(cachePath, "utf-8");
        const entry: CacheEntry<unknown> = JSON.parse(content);
        const ageSeconds = (Date.now() - entry.timestamp) / 1000;
        return ageSeconds < ttlSeconds;
    } catch {
        return false;
    }
}

export function getCacheAge(
    endpoint: string,
    params: Record<string, string | number | undefined> | undefined,
): number | null {
    const key = hashKey(endpoint, params);
    const cachePath = join(CACHE_DIR, `${key}.json`);

    if (!existsSync(cachePath)) {
        return null;
    }

    try {
        const content = readFileSync(cachePath, "utf-8");
        const entry: CacheEntry<unknown> = JSON.parse(content);
        return Date.now() - entry.timestamp;
    } catch {
        return null;
    }
}

export function invalidateCache(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
): void {
    const key = hashKey(endpoint, params);
    const cachePath = join(CACHE_DIR, `${key}.json`);

    if (existsSync(cachePath)) {
        try {
            const { unlinkSync } = require("node:fs");
            unlinkSync(cachePath);
        } catch {
            // Ignore errors
        }
    }
}

export const CACHE_TTL = {
    standings: 3600,
    fixtures: 60,
    live: 15,
    teams: 86400,
    leagues: 86400,
    players: 21600,
    events: 60,
    lineups: 300,
    statistics: 300,
    countries: 86400,
    seasons: 86400,
} as const;
