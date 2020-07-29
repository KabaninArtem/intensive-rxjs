import {Observable, timer} from "rxjs";
import {ajax} from "rxjs/ajax";
import {concatAll, map, pluck, shareReplay, switchMap, toArray} from "rxjs/operators";

const PARTICIPANTS_URL = 'https://learn.javascript.ru/courses/groups/api/participants'

class UserService {
    private _uniqNameSequence$: Observable<any>;

    public getNames() {
        if (!this._uniqNameSequence$) {
            // this._uniqNameSequence$ = ajax(`${PARTICIPANTS_URL}?key=dsodaf`)
            //     .pipe(
            //         pluck('response'),
            //         concatAll(), // --([1, 2, 3, 4]) =====> 1, 2, 3, 4
            //         pluck('profileName'),
            //         toArray(), // --1, 2, 3, 4 =====> --([1, 2, 3, 4])
            //         shareReplay() // Кешируем риквест. Мы 1 раз вытащили значения и распространяем их
            //                      // При последующей подписке, запрос не будет заново отрабатывать, так как здесь уже есть значение
            //     )
            this._uniqNameSequence$ = timer(0, 16000).pipe(
                switchMap(() => {
                    return ajax(`${PARTICIPANTS_URL}?key=dsodaf`)
                        .pipe(
                            pluck('response'),
                            concatAll(), // --([1, 2, 3, 4]) =====> 1, 2, 3, 4
                            pluck('profileName'),
                            toArray(), // --1, 2, 3, 4 =====> --([1, 2, 3, 4])
                            shareReplay() // Кешируем риквест. Мы 1 раз вытащили значения и распространяем их
                            // При последующей подписке, запрос не будет заново отрабатывать, так как здесь уже есть значение
                        )
                }),
                shareReplay()
            )
        }
        return this._uniqNameSequence$;
    }
}

export const userService = new UserService();
