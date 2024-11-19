export interface QuoteApi {
    c: number; // current price
    d?: number; // change
    dp?: number; // percent change
    h: number; // high of the day
    l: number; // low of the day
    o: number;  // open price
    pc: number; // previous close
    t: number; // timestamp
}