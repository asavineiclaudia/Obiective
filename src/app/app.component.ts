import { Component } from '@angular/core';
import { from, interval, map, Observable, of, combineLatest, timer } from 'rxjs';
import { filter, tap, delay, switchMap, startWith } from 'rxjs/operators';

export class Person {
    name: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public displayCats: boolean;
    public practisRxjs: boolean;

    constructor() {}

    public showExemples(): void {
        alert('Open the console to see results!')
        this.displayCats = false;
        console.log('-------------------Exemples---------------------');
        // eg 1
        const keepsHisWord = true;
        const promise1 = new Promise((resolve, reject) => {
            if (keepsHisWord) {
                resolve('The man likes to keep his word');
            } else {
                reject('The man doesnt want to keep his word');
            }
        });
        console.log(promise1);

        // eg 2
        console.log('---------eg2----------');
        const momsPromise = new Promise((resolve, reject) => {
            // if momsSavings = 20000 then mom will be able to gift the son.
            let momsSavings = 2000;
            let priceOfPhone = 6000;
            if (momsSavings > priceOfPhone) {
                resolve({ brand: 'samsung', model: 's22' });
            } else {
                reject('We donot have enough savings. Let us save some more money.');
            }
        });

        momsPromise.then(
            (value) => {
                console.log('Hurray I got this phone as a gift ', JSON.stringify(value));
            },
            (reason) => {
                console.log("Mom coudn't buy me the phone because ", reason);
            }
        );

        momsPromise.finally(() => {
            console.log('Irrespecitve of whether my mom can buy me a phone or not, I still love her');
        });

    }

    public showCats() {
        this.displayCats = true;
    }

    public showOperators() {
        alert('Please check the console!')
        this.displayCats = false;

        console.log('-------------------pipe---------------------');
        // combine multiple functions into a single function
        // The pipe method of the Angular Observable is used to chain multiple operators together

        const obs: Observable<number> = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        obs.pipe(
            filter((v) => v + 2 > 10),
            map((v) => v * 10),
        ).subscribe((data) => {
            console.log('pipe operator', data);
            // 90
            // 100
        });

        console.log('-------------------of---------------------');
        // each argument becomes a next notification
        // converts the arguments to an observable sequence.
        const person: Person = {
            name: 'Claudia',
        };
        const personObs: Observable<Person> = of(person);
        personObs.subscribe((data) => {
            console.log('of ex 1: person', data);
            // {name: 'Claudia'}
        });

        //transform a string to observable
        const strObs: Observable<string> = of('lalalallalalallalal');
        strObs.subscribe((data) => {
            console.log('of ex 2 - person string', data);
            // lalalallalalallalal
        });

        // transform promise to observable
        const personPromise: Promise<Person> = Promise.resolve(person);
        const persObs = from(personPromise);
        persObs.subscribe((data) => {
            console.log('of ex 3', data);
            // {name: 'Claudia'}
        });

        console.log('------------------- map operator--------------------');
        // map is part of the transformation operators group because it’s used to transform each item received from the source observable.
        // map operator works in the following way:
        // - Subscribe to a source observable
        // - When a new value arrives from a source observable, execute the projection function for the current value
        // - Send the returned value to the observer
        // - Once the source observable completes, send the complete notification to the observer
        // - If the source observable throws an error, send the error notification to the observer
        // Transforms emitted data from the stream.

        const name = of('claudia');
        name.pipe(
            map((data) => {
                return data.toUpperCase();
            })
        ).subscribe((data) => {
            console.log('map ex 1 - Mapped object', data);
            // CLAUDIA
        });

        //////////////////////////////////////////////////

        const map1 = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        //add 10 to each value
        map1.pipe(map((val) => val + 10)).subscribe((value) => {
            console.log('map ex 2', value);
            // 11 12 13 14 15 16 17 18 19 20
        });

        //////////////////////////////////////////////////

        const map2 = from([
            { name: 'Claudia', age: 30 },
            { name: 'Maria', age: 20 },
            { name: 'Alina', age: 21 },
            { name: 'Razvan', age: 35 },
            { name: 'Ana', age: 28 },
            { name: 'Are', age: 31 },
            { name: 'Mere', age: 35 },
        ]);

        map2.pipe(map(({ name }) => name)).subscribe((value) => {
            console.log('map ex 3', value);
            // Claudia
            // Maria
            // Alina
            // Razvan
            // Ana
            // Are
            // Mere
        });

        console.log('------------------- tap operator--------------------');
        // tap does not make changes to actual stream
        // is most often used for running side effects
        // tap operator works in the following way:
        // - Subscribe to a source observable
        // - When a new value arrives from a source observable, execute the next callback for the current value, disregard the returned value
        // - Send the original value to the observer
        // - If an error occurs inside the next callback, unsubscribe from the source, and send the error notification to the observer
        // - Once the source observable completes, execute the complete callback, and send the complete notification to the observer
        // - If the source observable throws an error, execute the error callback, and send the error notification to the observer

        const name2 = of('claudia');
        name2
            .pipe(
                tap((data) => {
                    console.log('tap', data.toUpperCase());
                    // CLAUDIA
                    return data.toUpperCase();
                })
            )
            .subscribe((data) => {
                console.log('tap ex 1 ', data);
                //claudia
            });

        ///////////////////////////////////////////

        const tap1 = of(1, 2, 3, 4, 5);
        tap1.pipe(
            tap((value) => {
                console.log('Tap ' + value);
                // 1 2 3 4 5
            })
        ).subscribe((value) => console.log('la subscribe pt tap1--->' + value));
        // 1 2 3 4 5

        ///////////////////////////////////////////
        const tap2 = of(1, 2, 3, 4, 5);
        tap2.pipe(
            tap((value) => {
                console.log('before ' + value);
                // 1 2 3 4 5
            }),
            map((value) => {
                console.log('mapped value:', value + 10);
                // 11 12 13 14 15
                return value + 10;
            }),
            tap((value) => {
                console.log('after ' + value);
                // 11 12 13 14 15
            })
        ).subscribe((value) => {
            console.log('in subscribe pt tap2 ----->', value);
            // 11 12 13 14 15
        });

        /////////////////////////////////////////////

        console.log('------------------- filter operator--------------------');
        // a filtering operator used to filter items emitted by the source observable according to the predicate function
        // It only emits those values that satisfy a specified predicate.
        // Filter: Removes emitted data from the stream.
        const age = from([
            { name: 'claudia', age: 30 },
            { name: 'maria', age: 25 },
        ]);
        age.pipe(filter((item) => item.age >= 30)).subscribe((val) => console.log('Fix: ', val));
        // 30

        //////////////////////////////////
        const numbers = of(1, 4, 5, 10, 7, 20, 60);
        numbers.pipe(filter((a) => a % 2 === 0)).subscribe((x) => console.log('The filtered numbers are ' + x));
        // 4 10 20 60

        console.log('------------------- switchMap--------------------');

        // When you click on the button, the clicks observable emits its first value
        // Transformation Operator

        // - switchMap - call to the backend - switching the observable from the old observable to the new one from the BE
        // - use switchMap when you need to flatten the data into one Observable but only when you need the latest value
        // - for any source item, completes the previous Observable and immediately creates the next one
        // - cancels previous HTTP requests that are still in progress
        // - for a list of filters into a data stream and perform an API call when a filter is changed.
        // If the previous filter changes are still being processed while a new change is already made,
        // it will cancel the previous subscription and start a new subscription on the latest change.
        // - this operator maps each value from the source observable into an inner observable, subscribes to it, and then starts emitting the values from it.
        // It creates a new inner observable for every value it receives from the Source.
        // Whenever it creates a new inner observable it unsubscribes from all the previously created inner observables.
        // Basically, it switches to the newest observable discarding all others.

        // const httpResult$ = this.simulateHttp(' user saved ', 1000)
        //     .pipe(
        //         switchMap((sourceValue) => {
        //             console.log(sourceValue);
        //             return this.simulateHttp(' data reloaded ', 2000);
        //         })
        //     )
        //     .subscribe();

        const switchedTest = of(1, 2, 3)
        switchedTest.pipe(switchMap(x => of(x, x * 2, x * 3))).subscribe(x => console.log('switchMap', x));
        // 1 2 3 2 4 6 3 6 9

    // }

    // console.log('------------------- from--------------------');
    // The from operator is used to create an observable from an array, an array-like object, a promise, an iterable object, or an observable-like object.

        const fromEx = from(['Claudia', 'Maria', 'Asavinei']) ;
        fromEx.subscribe((data) => {
            console.log('fromArr - ex1', data);
            // Claudia Maria Asavinei
        });


        //////////////////////////////////////////////////////////
        const fromArr = from([1,2,3,4])
        fromArr.subscribe((data) => {
            console.log('fromArr - ex2', data);
            // 1, 2, 3, 4
        });

        console.log('------------------- delay--------------------');
        // ---- is a utility operator used to delay the values emitted from the source observable 
        // according to a timeout given or by the specified delay value until a given Date
        // - is used to delay or time shift each item by some specified amount of milliseconds

        const delayOp = of('delay operator');
        delayOp.pipe(
          tap(val => console.log("Before " + val)),
          delay(1000)
        ).subscribe((val) => {
            console.log('delay', val)
        }); 

        /////////////////////////////

        const justDelay = from([1,2,3,4]).pipe(
            delay(500)
          );
          
        justDelay.subscribe(x => console.log('justDelay ', x));
          
      
    // console.log('------------------- debounceTime--------------------');
    // --operator is a filtering operator that emits a value from the source Observable 
    // only after completing a particular period without another source emission
    // --This operator is mostly used in type-ahead scenarios, where you have to control the user input rate.


    // console.log('------------------- startWith--------------------');
    // The startWith operator is mostly useful when you have an Observable of values that might arrive over time, but for which you'd also like to set an initial value. 
    // For example, you might want to display user input, and a placeholder when the user has not yet provided any input. 
    // Or you could have a configuration option that the user can toggle by pressing a button, and which should be initialised 
    // to either true or false in lieu of the user having pressed the button.


        const source = of(1, 2, 3);
        source.pipe(startWith(0)).subscribe((val) => {
            console.log('startWith', val)
        });
        // 0 1 2 3 

        const userName = of('Claudia');
        userName.pipe(startWith('Please enter a username')).subscribe((val) => {
            console.log('startWith - userName', val)
        });

        //Please enter a username
        //Claudia

        // console.log('------------------- combineLatest--------------------');

        // combineLatest is useful when you have multiple Observables whose values only make sense when used together. 
        // For example, you might want to combine the responses of several microservices which come in asynchronously. 
        // Or you might have Observables representing user input in several form fields, which you want to combine into a single result.

        const waitOneSecond$ = interval(1000);
        const waitTwoSecond$ = interval(2000);
        const waitThreeSecond$ = interval(3000);

        combineLatest([waitOneSecond$, waitTwoSecond$, waitThreeSecond$]).subscribe(() => {
            console.log('We waited three seconds!');
        });

        ///////////////////////////////////
        const weight = of(50, 51, 52);
        const height = of(1.76, 1.77, 1.78);

        combineLatest([weight, height], (w, h) => {
            return w / (h * h);
          }).subscribe(res => console.log('BMI is ' + res));


 }
}