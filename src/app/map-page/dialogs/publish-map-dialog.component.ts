import { Component, OnInit } from '@angular/core';
import {ModelService} from '../../service/model.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-publish-map-dialog',
  templateUrl: './publish-map-dialog.component.html',
  styleUrls: ['./publish-map-dialog.component.css']
})
export class PublishMapDialogComponent implements OnInit {

  constructor(private modelSvc: ModelService, public dialogRef: MatDialogRef<PublishMapDialogComponent>) { }

  ngOnInit() {
  }

  public publishMap() {
      this.modelSvc.publishMap();
      this.dialogRef.close();
  }
}
