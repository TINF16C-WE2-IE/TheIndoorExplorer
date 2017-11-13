import { Injectable } from '@angular/core';
import { ModelService } from './model.service';
import { RequestService } from './request.service';

@Injectable()
export class UserService {

    private _userId: number = null;
    private _userName: string = null;

    get userId(): number {
        return this._userId;
    }

    get userName(): string {
        return this._userName === null ? 'Log in / Sign up' : this._userName;
    }

    get isLoggedIn(): boolean {
        return this._userId !== null;
    }


    constructor(private modelSvc: ModelService, private requestSvc: RequestService) {
    }


    public refreshUserInfo() {
        this.requestSvc.get(RequestService.INFO_USER, {}).subscribe(
            resp => {
                if (resp) {
                    console.log('got user info:', resp);
                    const userInfo = resp as UserInfoResponse;
                    this._userId = userInfo.id;
                    this._userName = userInfo.username;
                }
            }
        );
    }

    public login(provider: string): void {
        window.location.href = RequestService.URL_LOGIN_ENDPOINT
            + this.requestSvc.uriEncodeObject({'providerId': provider})
            + '&redirect= ' + encodeURI(location.href);
    }

    public logout(): void {
        this.requestSvc.get(RequestService.LOGOUT, {}).subscribe(
            resp => {
                if (resp) {
                    console.log('Logout response:', resp);
                }
            }
        );
        location.reload();
    }
}

interface UserInfoResponse {
    id: number;
    username: string;
}
