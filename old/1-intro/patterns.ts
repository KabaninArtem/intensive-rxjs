// ReactiveX - iterator + observer + FP

// class CustomIterator {
//
//     private cursor = 0;
//     private value: number;
//
//     constructor(private arr: number[], private divisor: number = 1) {
//     }
//
//     public next() {
//         while (this.cursor < this.arr.length) {
//             this.value = this.arr[this.cursor++];
//             if(this.value % this.divisor === 0) {
//                 return {done: false, value: this.value}
//             }
//         }
//         return {done: true, value: this.value}
//     }
//
//     [Symbol.iterator]() {
//         return {
//             next: this.next.bind(this)
//         }
//     }
// }
//
// const consumer = new CustomIterator([1, 2, 3, 4, 5,6, 7, 8, 9, 10], 3);
// console.log(consumer.next());
// console.log(consumer.next());
// console.log(consumer.next());
// console.log(consumer.next());
// console.log(consumer.next());

// for (let item of consumer) {
//     console.log('item - ', item);
// }

// Array.from(consumer).forEach((v) => console.log('v - ', v));

// interface IListener {
//     next(message: string): void;
// }
//
// class Producer {
//    private listeners: IListener[] = [];
//
//    public subscribe(listener: IListener) {
//        const index = this.listeners.push(listener);
//        return {
//            unsubscribe: () => {
//                this.listeners.splice(index - 1, 1);
//            }
//        }
//    }
//
//    public notify(message: string) {
//        this.listeners.forEach((listener) => {
//            listener.next(message);
//        })
//    }
// }
//
// const listener1 = {
//     next(message: string) {
//         console.log('Listener 1', message);
//     }
// }
//
// const listener2 = {
//     next(message: string) {
//         console.log('Listener 2', message);
//     }
// }
//
// const notifier = new Producer();
// const subscription1 = notifier.subscribe(listener1);
// const subscription2 = notifier.subscribe(listener2);
//
// notifier.notify('Hi all, RxJS is awesome');
//
// subscription1.unsubscribe();
//
// setInterval(() => {
//     notifier.notify('After unsubscribe');
// }, 5000);
