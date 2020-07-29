import {interval, Observable, Subscriber, TeardownLogic} from "rxjs";
import {filter} from "rxjs/operators";

function doNothing(source$: Observable<any>) {
    return source$
}

function toText(source$: Observable<any>) {
    return new Observable(subscriber => {
        subscriber.next('RxJs is Awesome');
        subscriber.complete();
    })
}

class DoubleSubscriber extends Subscriber<unknown> {
    next(value: number) {
        super.next(value * 2);
    }
}

class SkipLimitSubscriber extends Subscriber<unknown> {
    private count: number = 1;
    private interval = 1;

    constructor(
        subscriber: any,
        private skip: number,
        private limit: number
    ) {
        super(subscriber);
    }

    next(value: any) {
        const borderLeft: number = this.interval * (this.skip + this.limit) - this.limit;
        const borderRight: number = borderLeft + this.limit;
        if (borderLeft < this.count && this.count <= borderRight) {
            super.next(value);
            this.count++
            if (borderRight < this.count) {
                this.interval++
            }
            return
        }
        this.count++;
    }
}

const pipe = (...fns: Function[]) => (source: Observable<any>) => fns.reduce(
    (newSource, fn) => fn(newSource), source
)

const filterWithDouble = pipe(
    filter((x: number) => x % 3 === 0),
    double
)

function double(source$: Observable<any>) {
    return source$.lift({
        call(subscriber: Subscriber<unknown>, source: any): void {
            source.subscribe(new DoubleSubscriber(subscriber));
        }
    })
}

function skipLimit(skip: number, limit: number) {
    return (source$: Observable<any>) => source$.lift({
        call(subscriber: Subscriber<unknown>, source: any): void {
            source.subscribe(new SkipLimitSubscriber(subscriber, skip, limit));
        }
    })
}


interval(1000).pipe(
    skipLimit(3, 4)
).subscribe(
    (v) => console.log(v),
    (err) => console.error(err),
    () => {
        console.log('complete')
    }
)
