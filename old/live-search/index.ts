import {fromEvent, Observable} from "rxjs";
import {
    bufferCount,
    concatAll,
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    pluck, reduce,
    switchMap
} from "rxjs/operators";
import {ajax} from "rxjs/ajax";

export interface IResult {
    name: string;
    description: string;
    owner: {
        avatar_url: string
    }
}
const input = document.querySelector('input') as HTMLInputElement;
const container = document.querySelector('#container') as HTMLElement;

liveSearch(
    fromEvent<KeyboardEvent>(input, 'input'),
    (text) => request(ajax(`https://api.github.com/search/repositories?q=${text}`))
).subscribe(htmlStr => {
    console.log(htmlStr);
    container.innerHTML = htmlStr;
})

export function liveSearch(source$: Observable<KeyboardEvent>, request: (text: string) => Observable<any>) {
    return source$.pipe(
        debounceTime(300),
        pluck<KeyboardEvent, string>('target', 'value'),
        map((value) => value.trim()),
        filter((value: string) => value.length > 3),
        distinctUntilChanged(),
        switchMap(request)
    )
}

export function request(source$: Observable<any>) {
    return source$.pipe(
        pluck<any, IResult[]>('response', 'items'),
        concatAll(), // flatt arr
        map(createCard),
        bufferCount(3),
        reduce((resultString, htmlString: string[]) => resultString += createRow(htmlString), ''),
        map((htmlString: string) => htmlString.trim().replace(/\s+{<}/g, ''))
    )
}

function createRow(htmlStrings: string[]) {
    return `
        <div class="row">
            ${htmlStrings.join(' ')}
        </div>  
    `
}

function createCard({name, description, owner: {avatar_url}}: IResult) {
    return `
        <div>
            <div class="card">
                <img src="${avatar_url}" alt="${name}">
                <div>
                    <h5>${name}</h5>
                    <p>${description}</p>
                </div>
            </div>    
        </div>    
    `
}
