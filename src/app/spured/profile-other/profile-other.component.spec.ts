import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OthersProfileComponent } from './profile-other.component';


describe('OthersProfileComponent', () => {
  let component: OthersProfileComponent;
  let fixture: ComponentFixture<OthersProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
