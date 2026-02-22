import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css'
})
export class TaskModalComponent {
  title: string = '';
  popUpType: string = '';

  taskForm!:FormGroup

  constructor(private modelRef: BsModalRef){
    this.taskForm = new FormGroup({
      subject: new FormControl(''),
      grade: new FormControl(''),
      count: new FormControl(),
      word: new FormControl(),
      timer: new FormControl(),
      meaning: new FormControl()
    })
  }

  hide(){
    this.modelRef.hide();
  }
}
