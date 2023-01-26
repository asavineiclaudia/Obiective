<!-- Documentation -->

https://angular.io/guide/comparing-observables https://hackernoon.com/understanding-promises-in-javascript-13d99df067c1
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise?ref=hackernoon.com
https://hackernoon.com/understanding-promises-in-javascript-13d99df067c1
https://www.syncfusion.com/blogs/post/angular-promises-versus-observables.aspx
https://www.youtube.com/watch?v=Kpn2ajSa92c
https://www.javatpoint.com/rxjs
https://angular.io/guide/observables



<!-- Observables -->

- Observables provide support for passing messages between parts of your application
- Observables are a representation of any set of values over any amount of time. This is the most basic building block of RxJS.
- Used to watch the streams and trigger specific callbacks when a value, error or a complete signal was emitted. -Can be subscribed by a consumer.
    Observer:
        - subscribes to an observable for consuming the values
        - is a simply a set of callbacks
        - receive notifications when a value, error or a complete signal was emitted by the observable.

        - next - Required. A handler for each delivered value. Called zero or more times after execution starts.
        - error - Optional. A handler for an error notification. An error halts execution of the observable instance.
        - complete - Optional. A handler for the execution-complete notification. Delayed values can continue to be delivered to the next handler after execution is complete.

- we will receive notifications until the complete signal was emited by the Observable
- we will receive notifications until the Observer is no longer interested in the values and unsubscribe
- A Subscription is an object that represents a disposable resource, usually the execution of an Observable.
- A Subscription has one important method, unsubscribe, that takes no argument and just disposes the resource held by the subscription. In previous versions of RxJS, Subscription was called "Disposable".
- A Subscription essentially just has an unsubscribe() function to release resources or cancel Observable 
executions.


<!-- Promises -->

-   A promise gives you an assurance that an asynchronous operation will be done
-   PromiseStatus can have three different values: pending, resolved or rejected
-   The constructor accepts a function called executor (with two parameters resolve and reject)
-   Promises are generally used for easier handling of asynchronous operations or blocking code, examples for which being file operations, API calls, DB calls,
    IO calls etc.
-   If the asynchronous operations are successful then the expected result is returned by calling the resolvefunction, if there was some unexpected error the
    reasons is passed on by calling the rejectfunction

<!-- Difference between observable and promise -->

O: Emit multiple values over a period of time.
P: Emit a single value at a time.
This makes observables useful for getting multiple values over time.

O: Are lazy: they’re not executed until we subscribe to them using the subscribe() method.
P: Are not lazy: execute immediately after creation.
This makes observables useful for defining recipes that can be run whenever you need the result.

O: Have subscriptions that are cancellable using the unsubscribe() method, which stops the listener from receiving further values.	
P: Are not cancellable.

O: Observables differentiate between chaining and subscription.	
P: Promises only have .then() clauses.
This makes observables useful for creating complex transformation recipes to be used by other part of the system, without causing the work to be executed.

O: Deliver errors to the subscribers.	
P:Push errors to the child promises.
This makes observables useful for centralized and predictable error handling.

<!-- Creation -->
const observable = new Observable((observer) => {
    observer.next(10);
});

const promise = new Promise(() => {
    resolve(10);
});

<!-- Transform -->
- Observables differentiate between transformation function such as a map and subscription. Only subscription activates the subscriber function to start computing the values.

                observable.pipe(map(value) => value * 2);

- Promises do not differentiate between the last .then clauses (equivalent to subscription) and intermediate .then clauses (equivalent to map).

                promise.then((value) => value * 2);

<!-- Subscribe -->

const sub = observable.subscribe((value) => {
    console.log(value)
});

promise.then((value) => {
    console.log(value)
});

<!-- Unsubscribe -->
const subscription = observable.subscribe(() => {
  // observer handles notifications
});

subscription.unsubscribe();

P: Can’t unsubscribe

<!-- Error handling -->
Observable execution errors are delivered to the subscriber's error handler, and the subscriber automatically unsubscribes from the observable.
    observable.subscribe(() => {
        throw new Error('my error');
    });

Promises push errors to the child promises.
    promise.then(() => {
        throw new Error('my error');
    });

<!-- RXJS Operators -->
- operators are functions
- there are 2 kinds:
    - pipe-able operators - the kind that can be piped to Observables using the syntax : obs.pipe(operator()) - ex: filter, map, swithcMap etc. They do not change the existing observable, they are creating a new Observable
    - creation operators - the kind that can be called as standalone functions to create new Observables - ex: of, from, trowError

    <!-- Operators
 <!-- Creation Operators -->

- of  - each argument becomes a next notification
- from - converts into an observable
- throwError - Creates an observable that will create an error instance and push it to the consumer as an error immediately upon subscription.


<!-- Join Creation Operators: these are Observable creation operators that also have join functionality -- emitting values of multiple source Observables. -->
- combineLatest: combine 2 streams - takes the last 2 items and combine them toghether
- merge: merges 2 streams;
- concat
- forkJoin

<!-- Transformation Operators -->
- map: for each value that the Observable emits, a function that modifies the data can be applied;
       should return the result: the value will be reemitted as an Observable again, so it can be used in the stream.
- switchMap - call to the backend - switching the observable from the old observable to the new one from the BE
            - use switchMap when you need to flatten the data into one Observable but only when you need the latest value
            - for any source item, completes the previous Observable and immediately creates the next one
            - cancels previous HTTP requests that are still in progress
            - for a list of filters into a data stream and perform an API call when a filter is changed. If the previous filter changes are still being processed while a new change is already made, it will cancel the previous subscription and start a new subscription on the latest change.
            - this operator maps each value from the source observable into an inner observable, subscribes to it, and then starts emitting the values from it. It creates a new inner observable for every value it receives from the Source. Whenever it creates a new inner observable it unsubscribes from all the previously created inner observables. Basically, it switches to the newest observable discarding all others.
- mergeMap: -merge both stream
            - use mergeMap when you simply want to flatten the data into one Observable
            - is a combination of mergeAll and map. MergeAll takes care of subscribing to the ‘inner’ Observable so that we no longer have to Subscribe two times as mergeAll merges the value of the ‘inner’ Observable into the ‘outer’ Observable.
- concatMap:- receive one obs, and when the second come waits first to finalise the first obs
            - use concatMap if you need to flatten the data into one Observable and the order is important
            - waits for the previous Observable to complete before creating the next one
            - does not cancel any of its inner observables.
- exhaustMap:  receive one obs, and when the second come it ignores it until  first it is  finalise the first one

<!-- Filtering Operators -->
- filter
- debounceTime: waits a specific amount of time, and after that publics the results
- debounce: it's like debounceTime, but the time span of emission silence is determined by a second Observable.
- takeUntil
- take
- takeWhile

<!-- Utility Operators -->
- tap - do other things
- delay
- toArray

<!-- Join Opeators -->
- startWith(n): starts with the value that you give: ex n
- concatAll
- exhaustAll
- mergeAll
- switchAll

<!-- Error Handling Operators -->
- catchError

<!-- Conditional and Boolean Operators -->
- find
- findIndex


finalise  - Execute callback function when the observable completes or errors


