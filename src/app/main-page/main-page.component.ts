import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ModelService } from '../service/model.service';

@Component({
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

    isScrolled: boolean;

    @ViewChild('appMenu') appMenu: ElementRef;


    constructor(public modelSvc: ModelService) {
    }


    @HostListener('window:scroll', ['$event'])
    onScroll() {
        this.isScrolled = window.pageYOffset > 0;
    }
}
