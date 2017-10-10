import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RequestService {


    private static readonly URL_API = 'https://bin.nubenum.de/ie/api/api.php?';
    public static readonly LIST_MAPS = 'maplist';

    private options: RequestOptions;

    constructor(private http: Http) {
        this.options = new RequestOptions();
    }

    public get(endpoint: string): Observable<any> {
        return this.http.get(RequestService.URL_API + endpoint).map(res => res.json());
    }

    public post(endpoint: string, obj: any): Observable<any> {
        return this.http.post(RequestService.URL_API + endpoint, obj).map(res => res.json());
    }
}
