import {combineLatest, EMPTY, fromEvent, Observable, of} from "rxjs";
import {debounceTime, pluck, switchMap, withLatestFrom} from "rxjs/operators";
import {userService} from "./user.service";


export class Form {
    private readonly _input: HTMLInputElement;
    private readonly _saveButton: HTMLButtonElement;

    public valueSequence$: Observable<any>;

    constructor(
        public formContainer: HTMLFormElement
    ) {
        this._input = formContainer.querySelector('input') as HTMLInputElement;
        this._saveButton = formContainer.querySelector('button') as HTMLButtonElement;

        this.valueSequence$ = combineLatest(
            fromEvent<InputEvent>(this._input, 'input').pipe(pluck('target', 'value')),
            userService.getNames()
        ).pipe(
            debounceTime(300),
            switchMap(([value, names]: any) => {
                const isNotValid = names.find((name: string) => name === value);
                if (isNotValid) {
                    this._input.classList.add('error');
                    this._saveButton.disabled = true;
                    return EMPTY;
                }
                this._input.classList.remove('error');
                this._saveButton.disabled = false;
                return of(value);
            })
        )

        fromEvent<MouseEvent>(this._saveButton, 'click')
            .pipe(
                withLatestFrom(this.valueSequence$),
            ).subscribe((v) => {
                console.log('value - ', v)
        })
    }

}
