import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-task-defaulter-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './task-defaulter-modal.component.html',
  styleUrl: './task-defaulter-modal.component.css'
})
export class TaskDefaulterModalComponent {

  popUpType: string = '';
  title: string = ''

  defaultForm!: FormGroup

  constructor(private modalRef: BsModalRef){
    this.defaultForm = new FormGroup({
      grade: new FormControl(''),
      subject: new FormControl(''),
      count: new FormControl(),
      timer: new FormControl()
    })
  }

  hide(){
    this.modalRef.hide();
  }

}
