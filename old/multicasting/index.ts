import {ConnectableObservable, interval, Observable, Subject} from "rxjs";
import {multicast, publish, refCount, share} from "rxjs/operators";

// const control = new Subject();
const sequence$ = interval(1000)
    .pipe(
        // multicast(control)
        // publish(),
        // refCount()
        share() // publish + refCount
    )

// sequence$.connect();
sequence$.subscribe((v) => {
    console.log('sub 1  - ', v);
});

setTimeout(() => {
    sequence$.subscribe((v) => {
        console.log('sub 2  - ', v);
    });
}, 5000)
