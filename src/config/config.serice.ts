import {Injectable} from "@nestjs/common";

@Injectable()
export class ConfigService {
    get apiBaseUrl(): string {
        return process.env.API_BASE_URL || 'http://localhost:5555';
    }
    get apiKey(): string {
        return process.env.FH_API_KEY || 'UNKNOWN_KEY';
    }
    get smaRange(): number {
        return Number.parseInt(process.env.SMA_RANGE) || 20;
    }
    get fetchInterval(): number {
        return Number.parseInt(process.env.FETCH_INTERVAL) || 120_000;
    }
}