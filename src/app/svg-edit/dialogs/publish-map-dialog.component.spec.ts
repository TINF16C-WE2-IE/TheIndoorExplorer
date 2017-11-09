import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishMapDialogComponent } from './publish-map-dialog.component';

describe('PublishMapDialogComponent', () => {
  let component: PublishMapDialogComponent;
  let fixture: ComponentFixture<PublishMapDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishMapDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
