import {HttpException, HttpStatus, Injectable, Logger, OnModuleDestroy} from '@nestjs/common';
import {SchedulerRegistry} from "@nestjs/schedule";
import {QuoteApi} from "./interfaces/quote.api.interface";
import {QuoteQueue} from "./models/quote-queue.model";
import {Quote} from "./interfaces/quote.interface";
import axios from "axios";
import {ConfigService} from "./config/config.serice";

@Injectable()
export class AppService implements OnModuleDestroy {
    private observedSymbols: Map<string, QuoteQueue> = new Map<string, QuoteQueue>();
    private readonly logger = new Logger(AppService.name);

    private readonly emptyQuote: QuoteApi = {
        c: 0,
        d: null,
        dp: null,
        h: 0,
        l: 0,
        o: 0,
        pc: 0,
        t: 0
    }

    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly configService: ConfigService
    ) {
    }

    async getQuote(symbol: string): Promise<Quote> {
        const data: QuoteApi = await this.get(`quote?symbol=${symbol}`);

        if (JSON.stringify(data) === JSON.stringify(this.emptyQuote)) {
            this.logger.error(`[${symbol}] failed to fetch quote: symbol not found`);
            throw new Error(`[${symbol}] symbol not found`);
        }

        if (!this.observedSymbols.has(symbol)) {
            this.observedSymbols.set(symbol, new QuoteQueue(this.configService.smaRange));
        }

        this.logger.log(`[${symbol}] fetched new quote`);
        return this.observedSymbols.get(symbol).updateQueue(data);
    }

    private async get(endpoint: string): Promise<any> {
        try {
            const url = `${this.configService.apiBaseUrl}/${endpoint}`;
            const response = await axios.get(url, {
                headers: {
                    'X-Finnhub-Token': this.configService.apiKey
                }
            });
            return response.data;
        } catch (error) {
            this.logger.error(`GET request failed: ${error.message ?? 'Unknown error'}`);
            throw new HttpException(`GET request failed`, HttpStatus.BAD_REQUEST);
        }
    }

    async addInterval(symbol: string, interval?: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.schedulerRegistry.doesExist('interval', symbol)) {
                return reject(new Error(`[${symbol}] interval already exists`));
            }

            interval = interval ?? this.configService.fetchInterval;

            this.schedulerRegistry.addInterval(symbol, setInterval(() => this.getQuote(symbol), interval));
            this.logger.warn(`[${symbol}] interval added, executing every ${interval}ms`)
            resolve();
        })
    }

    clearInterval(symbol: string): void {
        this.logger.warn(`[${symbol}] interval cleared.`);
        this.schedulerRegistry.deleteInterval(symbol);
    }

    clearAllIntervals(): void {
        this.logger.log('Clearing all intervals!')
        this.schedulerRegistry.getIntervals().forEach(this.clearInterval);
    }

    onModuleDestroy(): void {
        this.logger.debug('AppService teardown in progress..');
        this.clearAllIntervals();
        this.logger.debug('AppService teardown complete.');
    }
}
