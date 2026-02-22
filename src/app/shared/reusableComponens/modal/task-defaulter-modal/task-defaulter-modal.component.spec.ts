import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDefaulterModalComponent } from './task-defaulter-modal.component';

describe('TaskDefaulterModalComponent', () => {
  let component: TaskDefaulterModalComponent;
  let fixture: ComponentFixture<TaskDefaulterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDefaulterModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDefaulterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
