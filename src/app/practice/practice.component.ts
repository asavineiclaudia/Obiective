import { Component, OnInit } from '@angular/core';
import { PracticeService } from './practice.service';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';

@Component({
    selector: 'app-practice',
    templateUrl: './practice.component.html',
    styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements OnInit {
    public breedsInfo: any;
    public catsInfo: any;
    public catsPromis: any;
    public image: string;
    public promiseImg: string;
    public newCats: any;

    breeds: any;

    public fulljsonStr: any;

    public randomCatUrl = 'https://api.thecatapi.com/v1/images/search';

    private readonly unsubscribe$: Subject<void> = new Subject();

    constructor(private readonly practiceService: PracticeService) {}

    ngOnInit(): void {
        this.getNonChildFriendlyCatsCatsList();
    }

    public getAllCats(): void {
        this.practiceService
            .getRandomImageCat()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data: any) => {
                this.catsInfo = data;
                console.log('1111111111', this.catsInfo);
                this.image = this.catsInfo[0].url;
            });
    }

    public promisesCats() {
        fetch('https://api.thecatapi.com/v1/images/search', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log('response, response');
                return response.json();
            })
            .then((data) => {
                this.catsPromis = data;
                this.promiseImg = this.catsPromis[0].url;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    public getNonChildFriendlyCatsCatsList() {
        this.practiceService
            .mapCatsList()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data: any) => {
                console.log('getNonChildFriendlyCatsCatsList', data);
            });
    }
}
