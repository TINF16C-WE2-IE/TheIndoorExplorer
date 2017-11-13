import { Injectable, Component } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable()
export class MessageService {

    public snackConfig: MatSnackBarConfig;

    constructor(public snackBar: MatSnackBar) {
        this.snackConfig = new MatSnackBarConfig();
        this.snackConfig.duration = 3500;
    }

    public notify(msg: string, action: string = '') {
        this.snackBar.open(msg, action, this.snackConfig);
    }

    public setDuration(duration: number): void {
        this.snackConfig.duration = duration;
    }
}
