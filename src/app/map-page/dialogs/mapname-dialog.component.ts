import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ModelService} from '../../service/model.service';

@Component({
    selector: 'app-mapname-dialog',
    templateUrl: './mapname-dialog.component.html',
    styleUrls: ['./mapname-dialog.component.css']
})
export class MapnameDialogComponent implements OnInit {
    public mapname: string;

    constructor(public dialogRef: MatDialogRef<MapnameDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public modelSvc: ModelService) {
    }

    ngOnInit(): void {
        this.mapname = this.modelSvc.currentMap.name;
    }

    onSubmitClick(): void {

        this.modelSvc.currentMap.name = this.mapname;
        this.modelSvc.currentMap.dirty = true;
        this.dialogRef.close();

    }
}

