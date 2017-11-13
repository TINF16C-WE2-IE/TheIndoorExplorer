import {Component, OnInit} from '@angular/core';
import {ModelService} from '../../service/model.service';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';


@Component({
    selector: 'app-delete-map-dialog',
    templateUrl: './delete-map-dialog.component.html',
    styleUrls: ['./delete-map-dialog.component.css']
})
export class DeleteMapDialogComponent implements OnInit {

    constructor(private modelSvc: ModelService, private router: Router,
                public dialogRef: MatDialogRef<DeleteMapDialogComponent>) {
    }

    ngOnInit() {
    }

    public deleteMap() {
        this.dialogRef.close();
        this.modelSvc.deleteMap(() => {
            console.log('GOTO /');
            this.router.navigate(['root']);
        });
    }
}
