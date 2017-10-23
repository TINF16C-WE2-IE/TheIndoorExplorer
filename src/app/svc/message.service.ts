import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable()
export class MessageService {

    public snackConfig: MatSnackBarConfig;

    constructor(public snackBar: MatSnackBar) {
        this.snackConfig = new MatSnackBarConfig();
        this.snackConfig.duration = 2000;
    }

    public notify(msg: string) {
        this.snackBar.open(msg, '', this.snackConfig);
    }
}
