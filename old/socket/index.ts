import {Observable} from "rxjs";

const socket: WebSocket = new WebSocket("wss://echo.websocket.org");
const sequence$ = new Observable<any>((subscriber) => {
    socket.addEventListener('message', (e) => subscriber.next(e))
});

