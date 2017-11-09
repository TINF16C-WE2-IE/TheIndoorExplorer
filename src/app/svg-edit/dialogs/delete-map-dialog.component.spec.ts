import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMapDialogComponent } from './delete-map-dialog.component';

describe('DeleteMapDialogComponent', () => {
  let component: DeleteMapDialogComponent;
  let fixture: ComponentFixture<DeleteMapDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteMapDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
