export class Queue<T> {
    queue: T[] = [];

    constructor(private readonly capacity: number) {}

    enqueue(item: T) {
        if (this.queue.length < this.capacity) {
            this.queue.unshift(item);
        } else {
            this.queue.pop();
            this.queue.unshift(item);
        }
    }

    isFull(): boolean {
        return this.queue.length === this.capacity;
    }
}