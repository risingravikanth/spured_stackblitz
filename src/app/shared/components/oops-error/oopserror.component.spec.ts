import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OopsErrorComponent } from './oopserror.component';

describe('OopsErrorComponent', () => {
  let component: OopsErrorComponent;
  let fixture: ComponentFixture<OopsErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OopsErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OopsErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
