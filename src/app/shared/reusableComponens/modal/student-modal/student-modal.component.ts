import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MultiSelectComponent } from '../../multi-select/multi-select.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MultiSelectComponent,
    CommonModule
  ],
  templateUrl: './student-modal.component.html',
  styleUrl: './student-modal.component.css'
})
export class StudentModalComponent {

  studentsForm!: FormGroup;

  title:any = '';
  popUpType:any = '';
  constructor(private modalRef: BsModalRef){
    // exclude id. add role as default student.
    this.studentsForm = new FormGroup({
      // id: new FormControl(),
      role: new FormControl('Student'),
      grade: new FormControl(''),
      name: new FormControl(),
      skill: new FormControl('')
    })
  }

  // for hiding
  hide(){
    this.modalRef.hide();
  }

}
