import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainboardModalComponent } from './mainboard-modal.component';

describe('MainboardModalComponent', () => {
  let component: MainboardModalComponent;
  let fixture: ComponentFixture<MainboardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainboardModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainboardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
