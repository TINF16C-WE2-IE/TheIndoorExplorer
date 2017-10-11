import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RequestService {


    private static readonly URL_API = 'https://bin.nubenum.de/ie/api/api.php?';
    public static readonly LIST_MAPS = 'maplist';
    public static readonly LIST_MAP_DETAILS = 'jsonmap';

    private options: RequestOptions;

    constructor(private http: Http) {
        this.options = new RequestOptions();
    }

    public get(endpoint: string): Observable<any> {

        const obj = this.http.get(RequestService.URL_API + endpoint).map(res => {
            if (res.ok === true && res.status === 200) {
                const jsonObj = res.json();
                if (jsonObj.error !== undefined && jsonObj !== null) {
                    console.error(jsonObj.error);
                    return null;
                } else {
                    return jsonObj;
                }
            } else {
                console.error('Server is not responding correctly! Maybe down?', res);
                return null;
            }
        });

        return obj;
    }

    public post(endpoint: string, obj: any): Observable<any> {
        return this.http.post(RequestService.URL_API + endpoint, obj).map(res => res.json());
    }
}
