import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoticerMainComponent } from './noticer-main.component';


describe('NoticerMainComponent', () => {
  let component: NoticerMainComponent;
  let fixture: ComponentFixture<NoticerMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticerMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
