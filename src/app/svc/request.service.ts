import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RequestService {


    public static readonly URL_LOGIN_ENDPOINT = 'https://bin.nubenum.de/ie/auth.php?action=login';
    private static readonly URL_API = 'https://bin.nubenum.de/ie/api/v1/';
    public static readonly LIST_MAPS = 'map';
    public static readonly LIST_MAP_DETAILS = 'map/';
    public static readonly LIST_MAP_SAVE = 'map/';
    public static readonly INFO_USER = 'user';
    public static readonly  DELETE_MAP = 'map/';
    public static readonly LOGOUT = 'user/logout'

    private options: RequestOptions;

    constructor(private http: Http) {
        this.options = new RequestOptions();
        this.options.withCredentials = true;
    }

    public get(endpoint: string, paramsObj: any): Observable<any> {
        return this.http.get(
            encodeURI(RequestService.URL_API + endpoint + this.uriEncodeObject(paramsObj)),
            this.options
        ).map(res => this.handleResponse(res));
    }

    public post(endpoint: string, obj: any): Observable<any> {
        return this.http.post(
            encodeURI(RequestService.URL_API + endpoint), obj, this.options
        ).map(res => this.handleResponse(res));
    }

    public delete(endpoint: string, paramsObj: any): Observable<any> {
        return this.http.delete(
            encodeURI(RequestService.URL_API + endpoint + this.uriEncodeObject(paramsObj)),
            this.options
        ).map(res => this.handleResponse(res));
    }

    private handleResponse(res: any): any {
        if (res.ok === true && res.status === 200) {
            try {
                const jsonObj = res.json();
                if (jsonObj.error !== undefined && jsonObj !== null) {
                    console.log(jsonObj.error);
                    return null;
                } else {
                    return jsonObj;
                }
            } catch (e) {
                console.log('Non-JSON response', res.body);
                return null;
            }
        } else {
            console.log('Server is not responding correctly! Maybe down?', res);
            return null;
        }
    }

    public uriEncodeObject(obj: any): string {
        let str = '';
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                str += '&' + encodeURI(key) + '=' + encodeURIComponent(obj[key]);
            }
        }

        return str;
    }
}
