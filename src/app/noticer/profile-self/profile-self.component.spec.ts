import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfProfileComponent } from './profile-self.component';


describe('SelfProfileComponent', () => {
  let component: SelfProfileComponent;
  let fixture: ComponentFixture<SelfProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
