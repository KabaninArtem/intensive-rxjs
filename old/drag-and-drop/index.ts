import {fromEvent, Observable} from "rxjs";
import {concatMap, map, takeUntil} from "rxjs/operators";

const box = document.querySelector('.draggable') as HTMLDivElement;
const mousedown$ = fromEvent<MouseEvent>(box, 'mousedown');
const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
const mouseup$ = fromEvent<MouseEvent>(box, 'mouseup');

export function drag(
    source1$: Observable<MouseEvent>,
    source2$: Observable<MouseEvent>,
    source3$: Observable<MouseEvent>
) {
    return source1$
        .pipe(
            concatMap((startEvt) => {
                return source2$
                    .pipe(
                        map((moveEvt) => {
                            moveEvt.preventDefault();
                            return {
                                left: moveEvt.clientX - startEvt.offsetX,
                                top: moveEvt.clientY - startEvt.offsetY,
                            }
                        }),
                        takeUntil(source3$)
                    )
            })
        )
}

drag(mousedown$, mousemove$, mouseup$).subscribe(({left, top}) => {
    box.style.left = `${left}px`;
    box.style.top = `${top}px`;
});
