import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'svg-edit',
  templateUrl: './svg-edit.component.html',
  styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements OnInit {

  lines = []
  nowDrawing: boolean = false;
  moveStart = [];
  tool: number = 0;

  constructor() {
  }

  ngOnInit() {
  }

  gridSnap(evt) {
    return [Math.round(evt.layerX/10)*10, Math.round(evt.layerY/10)*10]
  }

  equalsXY(a, b) : boolean {
    return a[0] == b[0] && a[1] == b[1];
  }

  updateVertex(evt: MouseEvent) {
    let currentPos = this.gridSnap(evt);
    if (this.nowDrawing) {
      this.lines[this.lines.length-1][1] = currentPos;
    }
    else if (evt.buttons) {
      if (this.moveStart.length && !this.equalsXY(this.moveStart, currentPos)) {
        console.log(this.moveStart, currentPos);      
        this.lines.forEach(line => {
          for (let i=0;i<2;i++) {
            if (this.equalsXY(line[i],this.moveStart)) line[i] = currentPos;
          }
        });
      }
      this.moveStart = currentPos;
    }
    else if (!evt.buttons) {
      this.moveStart = [];
    }
  }

  setVertex(evt: MouseEvent) {
    console.log('cl',evt);
    if (!this.moveStart.length) {
      if (!this.nowDrawing) {
        this.lines.push([this.gridSnap(evt),this.gridSnap(evt)]); 
      }
      this.nowDrawing = !this.nowDrawing; 
    } 
    else {
      this.moveStart = [];
    }  
  }

  mouseClick(evt: MouseEvent) {
    if (this.tool == 0) this.setVertex(evt);
  }

  mouseMove(evt: MouseEvent) {
    if (this.tool == 0) this.updateVertex(evt);
  }

}
