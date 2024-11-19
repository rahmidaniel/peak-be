import {Queue} from "./queue.model";
import {QuoteApi} from "../interfaces/quote.api.interface";
import {Quote} from "../interfaces/quote.interface";

export class QuoteQueue {
    private readonly apiQueue: Queue<QuoteApi>;
    private quote: Quote;

    constructor(queueSize: number) {
        this.apiQueue = new Queue<QuoteApi>(queueSize);
    }

    get newestQuote(): Quote {
        return this.quote;
    }

    updateQueue(quote: QuoteApi): Quote {
        this.apiQueue.enqueue(quote);

        const sma = this.apiQueue.isFull() ? this.apiQueue.queue.reduce((acc, item) => acc + item.c, 0) / this.apiQueue.queue.length : null;

        this.quote = {
            c: quote.c,
            sma: sma,
            t: quote.t
        }

        return this.quote;
    }
}