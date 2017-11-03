import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapnameDialogComponent } from './mapname-dialog.component';

describe('MapnameDialogComponent', () => {
  let component: MapnameDialogComponent;
  let fixture: ComponentFixture<MapnameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapnameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapnameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
