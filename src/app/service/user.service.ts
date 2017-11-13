import { MessageService } from './message.service';
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


    constructor(private modelSvc: ModelService, private msgSvc: MessageService,
                  private requestSvc: RequestService) {
    }


    public refreshUserInfo() {
        this.requestSvc.get(RequestService.INFO_USER, {}).subscribe(
            resp => {
                if (resp.status >= 200 && resp.status <= 299 && resp.data) {
                    const userInfo = resp.data as UserInfoResponse;
                    this._userId = userInfo.id;
                    this._userName = userInfo.username;
                } else if (resp.status >= 400 && resp.status <= 499) {
                    // user not logged in
                } else {
                    console.log('Received invalid user info response:', resp);
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
                if (resp.status >= 200 && resp.status <= 299) {
                    console.log('Logout response:', resp);
                }
                else {
                    console.log('Received invalid logout response:', resp);
                }
                location.reload();
            }
        );
    }
}

interface UserInfoResponse {
    id: number;
    username: string;
}
