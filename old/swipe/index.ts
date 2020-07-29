import {fromEvent, iif, interval, merge, Observable, of, zip} from "rxjs";
import {map, pluck, switchMap} from "rxjs/operators";

const swipe$ = swipe(
    zip(
        getX(fromEvent<TouchEvent>(document, 'touchstart'), fromEvent<MouseEvent>(document, 'mousedown')),
        getX(fromEvent<TouchEvent>(document, 'touchend'), fromEvent<MouseEvent>(document, 'mouseup'))
    )
)

swipe$.subscribe(e => {
    console.log(e)
})

function getX(touchStream$: Observable<TouchEvent>, clickStream$: Observable<MouseEvent>) {
    return merge(touchStream$, clickStream$)
        .pipe(
            switchMap((event: TouchEvent | MouseEvent) => {
                return iif(
                    () => event instanceof TouchEvent,
                    of(event as TouchEvent).pipe(pluck('changedTouches', 0, 'clientX')),
                    of(event as MouseEvent).pipe(pluck('clientX'))
                )
            })
        )
}

function swipe(stream$: Observable<[number, number]>) {
    return stream$.pipe(
        switchMap(([start, end]) => {
                return iif(
                    () => end - start > 0,
                    of('Swipe right'),
                    of('Swipe left')
                )
            }
        )
    )
}
