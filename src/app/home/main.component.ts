import { RequestService } from '../svc/request.service';
import { ModelService } from '../svc/model.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private modelSvc: ModelService) { }

  ngOnInit() {
      this.modelSvc.loadUserInfo();
  }

}
