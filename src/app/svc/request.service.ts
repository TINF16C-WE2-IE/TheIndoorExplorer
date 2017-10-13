import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RequestService {


    private static readonly URL_API = 'https://bin.nubenum.de/ie/api/api.php?';
    public static readonly URL_LOGIN_ENDPOINT = 'https://bin.nubenum.de/ie/auth.php?action=login';
    public static readonly LIST_MAPS = 'maplist';
    public static readonly LIST_MAP_DETAILS = 'jsonmap';
    public static readonly LIST_MAP_SAVE = 'savemap';

    private options: RequestOptions;

    constructor(private http: Http) {
        this.options = new RequestOptions();
    }

    public get(endpoint: string, paramsObj: any): Observable<any> {
        return this.http.get(
            encodeURI(RequestService.URL_API + endpoint + this.uriEncodeObject(paramsObj))
        ).map(res => this.handleResponse(res));
    }

    public post(endpoint: string, obj: any): Observable<any> {
        return this.http.post(
            encodeURI(RequestService.URL_API + endpoint), obj
        ).map(res => this.handleResponse(res));
    }

    private handleResponse(res: any): any {
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
    }

    public uriEncodeObject(obj: any): string {
        let str = '';
        for (const key in obj) {
            if ( obj.hasOwnProperty(key) ) {
                str += '&' + encodeURI(key) + '=' + encodeURIComponent(obj[key]);
            }
        }

        return str;
    }
}
