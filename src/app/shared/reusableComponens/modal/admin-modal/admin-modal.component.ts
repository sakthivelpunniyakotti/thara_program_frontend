import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './admin-modal.component.html',
  styleUrl: './admin-modal.component.css'
})
export class AdminModalComponent {

  title: string = '';
  popUpType: string = '';

  adminForm!:FormGroup;

  constructor(private modalref: BsModalRef){
    this.adminForm = new FormGroup({
      name: new FormControl(),
      password: new FormControl(),
      cPassword: new FormControl(),
      role: new FormControl(''),
      org: new FormControl()
    })
  }

  hide(){
    this.modalref.hide();
  }
}
