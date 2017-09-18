import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgEditComponent } from './svg-edit.component';

describe('SvgEditComponent', () => {
  let component: SvgEditComponent;
  let fixture: ComponentFixture<SvgEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
