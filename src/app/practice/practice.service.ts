import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class PracticeService {
    private myapikey = 'ea88d668-b380-4077-be34-d5aa441fbdea';
    private headerDict = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-api-key': this.myapikey,
    };
    private requestOptions = {
        headers: new HttpHeaders(this.headerDict),
    };
    private randomCatUrl = 'https://api.thecatapi.com/v1';

    publicKey = 'd9ec60fa-716e-4975-b0e5-31cfcbf5edda';

    constructor(private http: HttpClient) {}

    public getRandomImageCat() {
        return this.http.get(this.randomCatUrl + '/images/search', this.requestOptions);
    }

    public getListOfCats(): Observable<any> {
        const params = `api_key=${this.publicKey}`;
        return this.http.get(`${this.randomCatUrl}/breeds?${params}`);
    }

    public mapCatsList() {
        return this.getListOfCats().pipe(
            map((data) => {
                console.log('mapCatsList', data);
                return data.filter((data: any) => data.child_friendly <= 3);
            })
        );
    }
}
