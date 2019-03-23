import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportUsComponent } from './report-us.component';


describe('ReportUsComponent', () => {
  let component: ReportUsComponent;
  let fixture: ComponentFixture<ReportUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
